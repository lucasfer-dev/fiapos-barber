import {NextResponse} from 'next/server';
import {adminCookie, createAdminSession, getAdminCredentials} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');
  const credentials = getAdminCredentials();

  if (!credentials.email || !credentials.password) {
    return NextResponse.json({error: 'Credenciais administrativas não configuradas no servidor.'}, {status: 500});
  }

  if (email !== credentials.email.toLowerCase() || password !== credentials.password) {
    return NextResponse.json({error: 'E-mail ou senha inválidos.'}, {status: 401});
  }

  const response = NextResponse.json({ok: true});
  response.cookies.set(adminCookie.name, createAdminSession(credentials.email), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: adminCookie.maxAge,
  });
  return response;
}
