export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getCollection from "@/lib/link/collections";
import crypto from "crypto";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ workflowid: string; workflowname: string }> }
) {
    try {
        const params = await context.params;
        const signature = req.headers.get("x-hub-signature-256") || "";
        const event = req.headers.get("x-github-event") || "";
        const { workflowid: workflowId, workflowname } = params;

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
                        const user1 = await contributedUser.findOne({ github: contributor });
                        return NextResponse.json({ walletId: user1?.walletid || null });
                    }
                    case "push": {
                        const pusher = body.pusher?.name || body.head_commit?.author?.name;
                        const user2 = await contributedUser.findOne({ github: pusher });
                        return NextResponse.json({ walletId: user2?.walletid || null });
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
