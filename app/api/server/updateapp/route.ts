import { cookies } from 'next/headers';
import { ObjectId } from "mongodb";
import jwt, { JwtPayload } from 'jsonwebtoken';
import getCollection from "@/lib/link/collections";

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

type UpdateAppInput = {
    webhookurl: string;
};

export async function POST(req: Request) {
    try {
        const { webhookurl } = await req.json() as UpdateAppInput;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        const wallet = decoded.walletId;

        if (!wallet || !webhookurl) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        const collection = await getCollection("PROJECTS");
        const user = await getCollection("LOGIN");
        const loggeduser = await user.findOne({ walletid: wallet });

        if (!loggeduser) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const app = await collection.updateOne(
            { userId: new ObjectId(loggeduser._id) },
            { $set: { webhookurl: webhookurl } }
        );

        if (app.modifiedCount > 0) {
            return new Response(JSON.stringify({ message: "Webhook URL updated" }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: "No update made" }), { status: 200 });
        }

    } catch (err) {
        console.error("App update error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
