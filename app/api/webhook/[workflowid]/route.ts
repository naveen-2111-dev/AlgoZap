import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getCollection from "@/lib/link/collections";
import crypto from "crypto";

export async function POST(req: NextRequest, { params }: { params: { workflowId: string } }) {
    const signature = req.headers.get("x-hub-signature-256") || "";
    const event = req.headers.get("x-github-event") || "";
    const workflowId = params.workflowId;

    if (!workflowId) return NextResponse.json({ error: "Missing workflowId" }, { status: 400 });

    const collection = await getCollection("PROJECTS");
    const app = await collection.findOne({ _id: new ObjectId(workflowId) });
    if (!app) return NextResponse.json({ error: "App not found" }, { status: 404 });

    const body = await req.json();

    const expectedHash = `sha256=${crypto
        .createHmac("sha256", app.webhookSecret)
        .update(JSON.stringify(body))
        .digest("hex")}`;

    const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedHash)
    );

    if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 403 });

    if (event === "pull_request" && body.action === "closed" && body.pull_request?.merged) {
        const contributor = body.pull_request.user.login;
        const repo = body.repository.full_name;

        console.log(event)
        console.log(`✅ Merged PR in ${repo} by ${contributor}`);
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
