import getCollection from "@/lib/link/collections";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from "mongodb"
import { cookies } from "next/headers";

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function GET() {
    try {
        const token = (await cookies()).get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        const wallet = decoded.walletId;

        const collection = await getCollection("PROJECTS");
        const user = await getCollection("LOGIN");

        const loggeduser = await user.findOne({ walletid: wallet });

        if (!loggeduser) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
            });
        }

        const apps = await collection.find({
            userId: new ObjectId(loggeduser._id)
        }).toArray();

        return new Response(JSON.stringify({ apps }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error("Fetch apps error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}