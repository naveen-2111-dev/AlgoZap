import { cookies } from 'next/headers';
import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken';
import getCollection from "@/lib/link/collections";
import { CreateAppInput } from '@/lib/types';

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    try {
        const { userId, name, sourcePlatform, destination, webhookSecret, webhookurl } = await req.json();
        
        return new Response(JSON.stringify({ message: "Success" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        });
    }
}
