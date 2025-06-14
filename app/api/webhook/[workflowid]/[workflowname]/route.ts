import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getCollection from "@/lib/link/collections";
import crypto from "crypto";
import algosdk from "algosdk";
import dotenv from "dotenv";

dotenv.config();

const algodClient = new algosdk.Algodv2(
    "",
    "https://testnet-api.algonode.cloud",
    ""
);

async function triggerAlgorandPayment(recipient: string, amount: number): Promise<void> {
    try {
        const senderMnemonic = process.env.DEPLOYER_MNEMONIC;
        if (!senderMnemonic) {
            throw new Error("DEPLOYER_MNEMONIC environment variable is not set");
        }

        const senderAccount = algosdk.mnemonicToSecretKey(senderMnemonic);
        const triggerAppId = 741185305; // Replace with your actual trigger app ID

        const suggestedParams = await algodClient.getTransactionParams().do();

        const atc = new algosdk.AtomicTransactionComposer();
        const method = new algosdk.ABIMethod({
            name: "trigger_payment",
            args: [
                { type: "address", name: "recipient" },
                { type: "uint64", name: "amount" },
            ],
            returns: { type: "string" },
        });

        atc.addMethodCall({
            appID: triggerAppId,
            method,
            methodArgs: [recipient, amount],
            sender: senderAccount.addr,
            suggestedParams,
            signer: async (txns: algosdk.Transaction[]) => {
                return txns.map(txn => txn.signTxn(senderAccount.sk));
            },
        });

        const result = await atc.execute(algodClient, 4);
        console.log("Payment triggered successfully:", result.methodResults[0].returnValue);
    } catch (error) {
        console.error("Error triggering payment:", error);
        throw error;
    }
}

export async function POST(
    req: NextRequest,
    context: { params: { workflowid: string; workflowname: string } }
) {
    try {
        const { workflowid: workflowId, workflowname } = context.params;
        const signature = req.headers.get("x-hub-signature-256") || "";
        const event = req.headers.get("x-github-event") || "";

        const contributedUser = await getCollection("LOGIN");
        if (!workflowId) {
            return NextResponse.json({ error: "Missing workflowId" }, { status: 400 });
        }

        const collection = await getCollection("PROJECTS");
        const app = await collection.findOne({ _id: new ObjectId(workflowId) });

        if (!app?.githubConfig?.webhookSecret) {
            return NextResponse.json({ error: "Missing webhookSecret" }, { status: 500 });
        }

        let rawBody = "";
        try {
            rawBody = await req.text();
        } catch (err) {
            console.error("Failed to read raw body:", err);
            return NextResponse.json({ error: "Cannot read body" }, { status: 400 });
        }

        const expectedHash = `sha256=${crypto
            .createHmac("sha256", app.githubConfig.webhookSecret)
            .update(rawBody)
            .digest("hex")}`;

        const signatureBuffer = Buffer.from(signature, "utf8");
        const expectedBuffer = Buffer.from(expectedHash, "utf8");

        const isValid =
            signatureBuffer.length === expectedBuffer.length &&
            crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }

        const body = JSON.parse(rawBody);

        switch (workflowname) {
            case "github":
                switch (event) {
            case "pull_request": {
                const contributor = body.pull_request?.user?.login;
                const id = await contributedUser.findOne({ github: contributor });

                if (id && id._id) {
                    const user = await collection.findOne({ _id: new ObjectId(id._id) });
                    if (user?.walletid) {
                        await triggerAlgorandPayment(user.walletid, 1000000);
                        return NextResponse.json({
                            message: "Payment triggered successfully",
                            recipient: user.walletid
                        });
                    }
                }
                return NextResponse.json({
                    message: "No eligible contributor found for payment"
                });
            }
            case "push": {
                const pusher = body.pusher?.name || body.head_commit?.author?.name;
                const user = await contributedUser.findOne({ github: pusher });
                return NextResponse.json({ walletId: user?.walletid || null });
            }
            default:
                return NextResponse.json({ message: "Unhandled GitHub event" });
        }

            case "discard":
                return NextResponse.json({ message: "Discard webhook received" });

            case "email":
                return NextResponse.json({ message: "Email webhook received" });

            default:
                return NextResponse.json({ message: "Unhandled workflow type" });
        }
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export const runtime = "nodejs";