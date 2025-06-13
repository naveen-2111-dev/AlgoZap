import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import getCollection from '@/lib/link/collections';

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
    try {
        const { walletId } = await req.json();

        if (!walletId) {
            return NextResponse.json({ success: false, message: 'Wallet ID is required' }, { status: 400 });
        }

        const Collection = await getCollection("LOGIN");
        const user = await Collection.findOne({ walletid: walletId });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const token = jwt.sign(
            {
                walletId: user.walletid,
                username: user.username,
                email: user.email,
                id: user._id
            },
            SECRET,
            { expiresIn: '30d' }
        );

        const response = NextResponse.json({ success: true, message: 'Login successful' });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
