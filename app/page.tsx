import App from '@/components/App';
import ThemeToggle from '@/components/ThemeToggle';
import { availableProviders, getSession } from '@/lib/server';

const NAMES: Record<string, string> = { github: 'GitHub', google: 'Google', microsoft: 'Microsoft' };

export default async function Page() {
  const session = await getSession();
  if (session) return <App name={session.name} />;

  const list = availableProviders();
  return (
    <main className="mx-auto max-w-md px-4 pt-[12vh]">
      <div className="mb-6 flex justify-end"><ThemeToggle /></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" className="mb-5 size-24" />
      <h1 className="text-5xl leading-none">CalendaTida</h1>
      <p className="mt-3 text-mut">Registre aplicações, peso semanal e IMC ao longo do tratamento. Seus dados ficam criptografados.</p>
      <div className="mt-6 grid gap-2.5">
        {list.length === 0 && <p className="hint">Nenhum login configurado. Veja o README.</p>}
        {list.map((k, i) => (
          <a key={k} href={`/api/auth/login/${k}`} className={`${i === 0 ? 'btn' : 'btn-alt'} py-3.5`}>Entrar com {NAMES[k]}</a>
        ))}
      </div>
      <p className="mt-8 text-sm text-mut">Este app serve apenas para acompanhamento e não substitui a orientação do seu médico.</p>
    </main>
  );
}
