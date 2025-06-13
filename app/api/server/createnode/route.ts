import { ObjectId } from "mongodb";
import getCollection from "@/lib/link/collections";

export async function POST(req: Request) {
    try {
        const { appId, type, config, condition = "", nextNodeIds = [] } = await req.json();
        const collection = await getCollection("PROJECTS");

        if (!appId || !type || !config) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400
            });
        }

        const newNode = {
            type,
            config,
            nextNodeIds,
            condition,
        };

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const updatedApp = await collection.findOneAndUpdate(
            { _id: new ObjectId(appId) },
            {
                $push: { "nodes": { $each: [newNode] } },
                $set: { updatedAt: new Date() }
            } as any,
            { returnDocument: "after" }
        );
        /* eslint-enable @typescript-eslint/no-explicit-any */

        if (!updatedApp) {
            return new Response(JSON.stringify({ error: "App not found" }), {
                status: 404
            });
        }

        return new Response(JSON.stringify({ message: "Node added" }), { status: 200 });
    } catch (err) {
        console.error("Add node error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}