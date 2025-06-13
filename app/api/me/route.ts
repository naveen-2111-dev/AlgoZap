import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import getCollection from '@/lib/link/collections';

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const token = cookie
      .split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token found' }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { walletId: string };

    if (!decoded.walletId) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const Collection = await getCollection('LOGIN');
    const user = await Collection.findOne({ walletid: decoded.walletId });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data if needed
    delete user.password;

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 });
  }
}
