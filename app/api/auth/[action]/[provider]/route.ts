import { NextRequest, NextResponse } from 'next/server';
import { createSession, providers } from '@/lib/server';

type Ctx = { params: Promise<{ action: string; provider: string }> };
const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { action, provider } = await params;
  const p = providers()[provider];
  if (!p?.id || !p.secret) return NextResponse.json({ error: 'provedor não configurado' }, { status: 404 });
  const base = req.nextUrl.origin;
  const redirectUri = `${base}/api/auth/callback/${provider}`;

  if (action === 'login') {
    const state = crypto.randomUUID();
    const q = new URLSearchParams({ client_id: p.id, response_type: 'code', scope: p.scope, state, redirect_uri: redirectUri });
    const res = NextResponse.redirect(`${p.auth}?${q}`);
    res.cookies.set('oauth_state', state, { ...cookieOpts, maxAge: 600 });
    return res;
  }

  if (action === 'callback') {
    const code = req.nextUrl.searchParams.get('code');
    if (!code || req.nextUrl.searchParams.get('state') !== req.cookies.get('oauth_state')?.value) {
      return NextResponse.json({ error: 'estado inválido' }, { status: 400 });
    }
    const t = (await (await fetch(p.token, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: p.id, client_secret: p.secret, code, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    })).json()) as { access_token?: string };
    if (!t.access_token) return NextResponse.json({ error: 'falha no login' }, { status: 400 });

    const u = (await (await fetch(p.user, { headers: { Authorization: `Bearer ${t.access_token}`, 'User-Agent': 'calendatida' } })).json()) as Record<string, unknown>;
    const session = await createSession(`${provider}-${u.id ?? u.sub}`, String(u.name ?? u.login ?? 'Você'));
    const res = NextResponse.redirect(new URL('/', base));
    res.cookies.set('session', session, { ...cookieOpts, maxAge: 7 * 86400 });
    res.cookies.delete('oauth_state');
    return res;
  }

  return NextResponse.json({ error: 'rota não encontrada' }, { status: 404 });
}
