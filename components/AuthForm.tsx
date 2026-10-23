'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

const tr = (m: string) =>
  m.includes('Invalid login') ? 'E-mail ou senha incorretos.'
    : m.includes('not confirmed') ? 'Esta conta ainda não foi confirmada. Veja o README (Supabase) para liberar contas antigas.'
    : m.includes('already registered') ? 'Este e-mail já tem uma conta.'
    : m.includes('at least') ? 'A senha precisa ter pelo menos 6 caracteres.'
    : m.includes('is invalid') ? 'Este e-mail não foi aceito. Confira se está correto.'
    : m.toLowerCase().includes('signups not allowed') ? 'Cadastros desativados no Supabase.'
    : m.toLowerCase().includes('rate limit') ? 'Muitas tentativas. Aguarde um pouco e tente de novo.'
    : `Não foi possível concluir (${m}).`;

export default function AuthForm({ initial }: { initial: 'in' | 'up' }) {
  const [mode, setMode] = useState(initial);
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
      if (error) setMsg({ ok: false, t: tr(error.message) }); else return location.assign('/');
    } else {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name.trim() || undefined } } });
      if (error) setMsg({ ok: false, t: tr(error.message) });
      else if (data.user?.identities?.length === 0) setMsg({ ok: false, t: 'Este e-mail já tem uma conta.' });
      else if (data.session) return location.assign('/'); // conta criada: já entra direto
      else setMsg({ ok: true, t: `Conta criada. Confirme pelo link enviado para ${email} e depois entre.` });
    }
    setBusy(false);
  };

  const tab = (m: 'in' | 'up', label: string) => (
    <button type="button" role="tab" aria-selected={mode === m} className={mode === m ? 'btn' : 'btn-alt'} onClick={() => { setMode(m); setMsg(null); }}>{label}</button>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-2" role="tablist">{tab('up', 'Criar conta')}{tab('in', 'Entrar')}</div>
      <form onSubmit={submit} key={mode} className="rise">
        {mode === 'up' && (<>
          <label className="lbl" htmlFor="nm">Nome</label>
          <input id="nm" className="inp" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como quer ser chamado" />
        </>)}
        <label className="lbl" htmlFor="em">E-mail</label>
        <input id="em" type="email" required className="inp" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="lbl" htmlFor="pw">Senha</label>
        <input id="pw" type="password" required minLength={6} className="inp" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} />
        {mode === 'up' && <p className="hint">Mínimo de 6 caracteres. Você entra na hora, sem precisar confirmar nada.</p>}
        <button type="submit" className="btn mt-5 w-full py-3" disabled={busy}>{busy ? 'Aguarde…' : mode === 'in' ? 'Entrar' : 'Criar conta e entrar'}</button>
      </form>
      {msg && <p role="alert" className={`hint pop ${msg.ok ? '!text-ok' : '!text-warn'}`}>{msg.t}</p>}
    </div>
  );
}
