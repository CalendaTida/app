import { NextResponse, type NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

// Destino do login com GitHub e do link de confirmação de e-mail.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (code) await (await supabaseServer()).auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL('/', req.nextUrl.origin));
}
