import { NextResponse } from 'next/server';
import { getSession, loadData, saveData } from '@/lib/server';
import type { Data } from '@/lib/core';

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function GET() {
  const s = await getSession();
  if (!s) return fail('não autenticado', 401);
  try { return NextResponse.json({ data: await loadData(s.sub) }); } catch { return fail('falha ao carregar', 500); }
}

export async function PUT(req: Request) {
  const s = await getSession();
  if (!s) return fail('não autenticado', 401);
  try {
    const { data } = (await req.json()) as { data: Data };
    if (!data || typeof data.logs !== 'object') return fail('dados inválidos', 400);
    await saveData(s.sub, data);
    return NextResponse.json({ ok: true });
  } catch { return fail('falha ao salvar', 500); }
}
