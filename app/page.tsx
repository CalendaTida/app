import App from '@/components/App';
import AuthForm from '@/components/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';
import { getSession } from '@/lib/server';

export default async function Page() {
  const session = await getSession();
  if (session) return <App name={session.name} />;

  return (
    <main className="mx-auto max-w-md px-4 pb-16 pt-[8vh]">
      <div className="mb-6 flex justify-end"><ThemeToggle /></div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" className="mb-5 size-24" />
      <h1 className="text-5xl leading-none">CalendaTida</h1>
      <p className="mt-3 text-mut">Registre aplicações, peso semanal e IMC ao longo do tratamento. Seus dados ficam criptografados.</p>
      <AuthForm />
      <p className="mt-8 text-sm text-mut">Este app serve apenas para acompanhamento e não substitui a orientação do seu médico.</p>
    </main>
  );
}
