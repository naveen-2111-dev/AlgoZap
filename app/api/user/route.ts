import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = (await cookies()).get('github_access_token')?.value;
  const username = (await cookies()).get('github_username')?.value;

  if (token && username) {
    return NextResponse.json({
      connected: true,
      username, // 👈 make sure this is returned
    });
  }

  return NextResponse.json({ connected: false });
}
