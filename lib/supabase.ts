import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// O Supabase guarda SOMENTE as contas (e-mail e login). Os dados do tratamento ficam no GitHub, criptografados.
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* em Server Components o middleware renova a sessão */ }
      },
    },
  });
}
