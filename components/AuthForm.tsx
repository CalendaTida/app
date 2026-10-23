'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

// Google e Microsoft ficam desativados. Para ligar um deles: troque `on` para true e ative o provedor no painel do Supabase.
const SOCIAL = [
  { id: 'github', label: 'GitHub', on: true },
  { id: 'google', label: 'Google', on: false },
  { id: 'azure', label: 'Microsoft', on: false },
] as const;

const tr = (m: string) =>
  m.includes('Invalid login') ? 'E-mail ou senha incorretos.'
    : m.includes('not confirmed') ? 'Confirme seu e-mail antes de entrar.'
    : m.includes('already registered') ? 'Este e-mail já tem uma conta.'
    : m.includes('at least') ? 'A senha precisa ter pelo menos 6 caracteres.'
    : m.toLowerCase().includes('rate limit') ? 'Muitas tentativas. Aguarde um pouco e tente de novo.'
    : 'Não foi possível concluir. Tente novamente.';

export default function AuthForm() {
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const sb = supabaseBrowser();
    if (mode === 'in') {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) setMsg({ ok: false, t: tr(error.message) }); else return location.reload();
    } else {
      const { data, error } = await sb.auth.signUp({
        email, password,
        options: { data: { full_name: name.trim() || undefined }, emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) setMsg({ ok: false, t: tr(error.message) });
      else if (data.user?.identities?.length === 0) setMsg({ ok: false, t: 'Este e-mail já tem uma conta.' });
      else if (data.session) return location.reload();
      else setMsg({ ok: true, t: `Enviamos um link de confirmação para ${email}. Confirme e depois entre.` });
    }
    setBusy(false);
  };

  const social = async (provider: (typeof SOCIAL)[number]['id']) => {
    setMsg(null);
    const { error } = await supabaseBrowser().auth.signInWithOAuth({ provider, options: { redirectTo: `${location.origin}/auth/callback` } });
    if (error) setMsg({ ok: false, t: 'Não foi possível iniciar o login. Tente novamente.' });
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={mode === 'in'} className={mode === 'in' ? 'btn' : 'btn-alt'} onClick={() => { setMode('in'); setMsg(null); }}>Entrar</button>
        <button type="button" role="tab" aria-selected={mode === 'up'} className={mode === 'up' ? 'btn' : 'btn-alt'} onClick={() => { setMode('up'); setMsg(null); }}>Criar conta</button>
      </div>
      <form onSubmit={submit}>
        {mode === 'up' && (
          <><label className="lbl" htmlFor="nm">Nome</label>
            <input id="nm" className="inp" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como quer ser chamado" /></>
        )}
        <label className="lbl" htmlFor="em">E-mail</label>
        <input id="em" type="email" required className="inp" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="lbl" htmlFor="pw">Senha</label>
        <input id="pw" type="password" required minLength={6} className="inp" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn mt-4 w-full py-3" disabled={busy}>{busy ? 'Aguarde…' : mode === 'in' ? 'Entrar' : 'Criar conta'}</button>
      </form>
      {msg && <p role="alert" className={`hint ${msg.ok ? '!text-ok' : '!text-warn'}`}>{msg.t}</p>}
      <div className="my-5 flex items-center gap-3 text-sm text-mut"><span className="h-px flex-1 bg-line" />ou<span className="h-px flex-1 bg-line" /></div>
      <div className="grid gap-2.5">
        {SOCIAL.filter((s) => s.on).map((s) => (
          <button key={s.id} type="button" className="btn-alt py-3" onClick={() => social(s.id)}>Entrar com {s.label}</button>
        ))}
      </div>
    </div>
  );
}
