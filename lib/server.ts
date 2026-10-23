import { EncryptJWT, jwtDecrypt } from 'jose';
import { createHash } from 'crypto';
import type { Data } from './core';
import { supabaseServer } from './supabase';

const encKey = () => createHash('sha256').update(`${process.env.SESSION_SECRET}:enc`).digest();

export type Session = { sub: string; name: string };
export async function getSession(): Promise<Session | null> {
  const { data: { user } } = await (await supabaseServer()).auth.getUser();
  if (!user) return null;
  const m = (user.user_metadata ?? {}) as Record<string, unknown>;
  return { sub: user.id, name: String(m.full_name ?? m.name ?? m.user_name ?? user.email?.split('@')[0] ?? 'Você') };
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
  const { payload } = await jwtDecrypt(Buffer.from(f.content, 'base64').toString('utf8'), encKey());
  return payload.data as Data;
}

export async function saveData(sub: string, data: Data) {
  const jwe = await new EncryptJWT({ data }).setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }).setIssuedAt().encrypt(encKey());
  const file = fileFor(sub);
  const cur = await gh(file);
  const sha = cur.ok ? ((await cur.json()) as { sha: string }).sha : undefined;
  const r = await gh(file, { method: 'PUT', body: JSON.stringify({ message: 'atualiza dados', content: Buffer.from(jwe).toString('base64'), sha }) });
  if (!r.ok) throw new Error(`github ${r.status}`);
}
