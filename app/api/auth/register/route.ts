import { NextResponse } from 'next/server';
import getCollection from '@/lib/link/collections';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { walletId, email, password, username } = await req.json();

        if (!walletId || !email || !password || !username) {
            return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
        }

        const Collection = await getCollection("LOGIN");

        const existingUser = await Collection.findOne({ walletid: walletId });

        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Collection.insertOne({
            walletid: walletId,
            username,
            email,
            password: hashedPassword
        });

        if (user?.insertedId) {
            return NextResponse.json({ success: true, message: 'Signup successful' }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: 'Failed to create user' }, { status: 500 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
