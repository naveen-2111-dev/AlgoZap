import { ObjectId } from "mongodb";
import getCollection from "@/lib/link/collections";

export async function POST(req: Request) {
    try {
        const { appId, type, config, condition = "" } = await req.json();
        const collection = await getCollection("PROJECTS");

        if (!appId || !type || !config) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400
            });
        }

        const project = await collection.findOne({ _id: new ObjectId(String(appId)) });
        if (!project) {
            return new Response(JSON.stringify({ error: "App not found" }), { status: 404 });
        }

        const lastNode = project?.nodes?.[project.nodes.length - 1];
        const previousNodeId = lastNode?._id;

        const newNodeId = new ObjectId();

        const newNode = {
            _id: newNodeId,
            type,
            config,
            nextNodeIds: [],
            condition,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        /* eslint-disable @typescript-eslint/no-explicit-any */
        await collection.updateOne(
            { _id: new ObjectId(String(appId)) },
            {
                $push: { nodes: newNode },
                $set: { updatedAt: new Date() }
            } as any
        );
        /* eslint-enable @typescript-eslint/no-explicit-any */

        if (previousNodeId) {
            await collection.updateOne(
                { _id: new ObjectId(String(appId)), "nodes._id": previousNodeId },
                {
                    $addToSet: { "nodes.$.nextNodeIds": newNodeId.toString() }
                }
            );
        }

        return new Response(JSON.stringify({
            message: "Node added",
            nodeId: newNodeId.toString()
        }), {
            status: 200
        });

    } catch (err) {
        console.error("Add node error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500
        });
    }
}
