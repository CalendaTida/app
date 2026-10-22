import { SignJWT, jwtVerify, EncryptJWT, jwtDecrypt } from 'jose';
import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import type { Data } from './core';

const key = (use: string) => createHash('sha256').update(`${process.env.SESSION_SECRET}:${use}`).digest();

type Provider = { auth: string; token: string; user: string; scope: string; id?: string; secret?: string };
export const providers = (): Record<string, Provider> => ({
  github: {
    auth: 'https://github.com/login/oauth/authorize', token: 'https://github.com/login/oauth/access_token',
    user: 'https://api.github.com/user', scope: 'read:user',
    id: process.env.GITHUB_CLIENT_ID, secret: process.env.GITHUB_CLIENT_SECRET,
  },
  google: {
    auth: 'https://accounts.google.com/o/oauth2/v2/auth', token: 'https://oauth2.googleapis.com/token',
    user: 'https://openidconnect.googleapis.com/v1/userinfo', scope: 'openid profile',
    id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  microsoft: {
    auth: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize', token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    user: 'https://graph.microsoft.com/oidc/userinfo', scope: 'openid profile',
    id: process.env.MICROSOFT_CLIENT_ID, secret: process.env.MICROSOFT_CLIENT_SECRET,
  },
});
export const availableProviders = () => Object.entries(providers()).filter(([, p]) => p.id).map(([k]) => k);

export type Session = { sub: string; name: string };
export const createSession = (sub: string, name: string) =>
  new SignJWT({ name }).setProtectedHeader({ alg: 'HS256' }).setSubject(sub).setExpirationTime('7d').sign(key('sign'));

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key('sign'));
    return { sub: String(payload.sub), name: String(payload.name ?? 'Você') };
  } catch { return null; }
}

// Armazenamento: um arquivo JWE (JWT criptografado, AES-256-GCM) por usuário, no repositório privado de dados.
const gh = (file: string, init: RequestInit = {}) =>
  fetch(`https://api.github.com/repos/${process.env.GH_DATA_REPO}/contents/${file}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${process.env.GH_DATA_TOKEN}`, Accept: 'application/vnd.github+json',
      'User-Agent': 'calendatida', ...init.headers,
    },
  });
const fileFor = (sub: string) => `data/${sub.replace(/[^\w-]/g, '_')}.jwt`;

export async function loadData(sub: string): Promise<Data | null> {
  const r = await gh(fileFor(sub));
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`github ${r.status}`);
  const f = (await r.json()) as { content: string };
  const { payload } = await jwtDecrypt(Buffer.from(f.content, 'base64').toString('utf8'), key('enc'));
  return payload.data as Data;
}

export async function saveData(sub: string, data: Data) {
  const jwe = await new EncryptJWT({ data }).setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }).setIssuedAt().encrypt(key('enc'));
  const file = fileFor(sub);
  const cur = await gh(file);
  const sha = cur.ok ? ((await cur.json()) as { sha: string }).sha : undefined;
  const r = await gh(file, { method: 'PUT', body: JSON.stringify({ message: 'atualiza dados', content: Buffer.from(jwe).toString('base64'), sha }) });
  if (!r.ok) throw new Error(`github ${r.status}`);
}
