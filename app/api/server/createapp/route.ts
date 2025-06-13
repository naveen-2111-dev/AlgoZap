import { cookies } from 'next/headers';
import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken';
import getCollection from "@/lib/link/collections";

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    try {
        const { name, sourcePlatform, destination, webhookSecret } = await req.json();
        const token = (await cookies()).get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        const wallet = decoded.walletId;

        if (!name || !sourcePlatform || !destination || !webhookSecret) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
            });
        }

        const collection = await getCollection("PROJECTS");
        const user = await getCollection("LOGIN");
        const existingApp = await collection.findOne({ name });
        const loggeduser = await user.findOne({ walletid: wallet });

        if (existingApp) {
            return new Response(JSON.stringify({ error: "App name already exists" }), {
                status: 409,
            });
        }

        const app = await collection.insertOne({
            userId: new ObjectId(loggeduser?._id),
            name: name,
            sourcePlatform: sourcePlatform,
            destination: destination,
            webhookSecret: webhookSecret,
            createdAt: new Date()
        });

        if (app.insertedId)
            return new Response(JSON.stringify({ message: "Success" }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
    } catch (err) {
        console.error("App creation error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
