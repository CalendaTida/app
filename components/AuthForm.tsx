'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';

type SbError = { message: string; code?: string };
// Traduz o código de erro do Supabase. Se não reconhecer, mostra o código para facilitar o diagnóstico.
const tr = (e: SbError) => {
  const off = /email (signups|logins) are disabled/i.test(e.message);
  switch (off ? 'email_provider_disabled' : e.code) {
    case 'invalid_credentials': return 'E-mail ou senha incorretos.';
    case 'email_not_confirmed': return 'Esta conta ainda não foi confirmada. Veja o README (Supabase) para liberar contas antigas.';
    case 'user_already_exists': case 'email_exists': return 'Este e-mail já tem uma conta.';
    case 'weak_password': return 'Senha fraca. Use pelo menos 6 caracteres, de preferência com letras e números.';
    case 'email_address_invalid': return 'Este e-mail não foi aceito. Domínios de teste (como example.com) e e-mails muito curtos são recusados. Use um e-mail real.';
    case 'email_address_not_authorized': return 'O Supabase tentou enviar um e-mail de confirmação, mas só pode enviar para o dono do projeto. Desligue "Confirm email" no painel do Supabase.';
    case 'email_provider_disabled': return 'O cadastro por e-mail está desligado no Supabase. Ligue em Authentication > Sign In / Providers > Email (Enable Email provider).';
    case 'signup_disabled': return 'Os cadastros estão desativados no Supabase.';
    case 'over_email_send_rate_limit': case 'over_request_rate_limit': return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    default: return `Não foi possível concluir (${e.code ?? e.message}).`;
  }
};

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
      if (error) setMsg({ ok: false, t: tr(error) }); else return location.assign('/');
    } else {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name.trim() || undefined } } });
      if (error) setMsg({ ok: false, t: tr(error) });
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
