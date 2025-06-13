import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('github_access_token')?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const res = await fetch('https://api.github.com/user/repos', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
    cache: 'no-store',
  });

  const data = await res.json();
  console.log('🔐 Token from cookie:', token);
  const username = (await cookies()).get('github_username')?.value;
  console.log('👤 Username:', username);




  return Response.json(data);
}
