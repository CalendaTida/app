import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';
import { getSession } from '@/lib/server';

export const metadata = { title: 'Entrar | CalendaTida' };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ modo?: string }> }) {
  if (await getSession()) redirect('/');
  const { modo } = await searchParams;
  return (
    <main className="relative isolate mx-auto grid min-h-dvh max-w-md content-center overflow-hidden px-4 py-10">
      <span aria-hidden className="absolute -left-24 top-0 -z-10 size-72 animate-[drift_14s_ease-in-out_infinite] rounded-full opacity-25 blur-3xl" style={{ background: '#4054d6' }} />
      <span aria-hidden className="absolute -right-24 bottom-0 -z-10 size-72 animate-[drift_18s_ease-in-out_infinite_reverse] rounded-full opacity-25 blur-3xl" style={{ background: '#0f7f78' }} />
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="btn-alt !px-3 !py-1.5 text-sm">← Início</Link>
        <ThemeToggle />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" className="rise mb-3 size-16" />
      <h1 className="rise text-4xl leading-none">CalendaTida</h1>
      <div className="card pop"><AuthForm initial={modo === 'criar' ? 'up' : 'in'} /></div>
      <p className="mt-6 text-center text-sm text-mut">Este app serve apenas para acompanhamento e não substitui a orientação do seu médico.</p>
    </main>
  );
}
