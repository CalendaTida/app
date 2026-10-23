import Link from 'next/link';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';
import { getSession } from '@/lib/server';

export const metadata = { title: 'Entrar | CalendaTida' };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ modo?: string }> }) {
  if (await getSession()) redirect('/');
  const { modo } = await searchParams;
  const dots = [['8%', '18%', 14, 5], ['86%', '12%', 22, 7], ['14%', '72%', 18, 6], ['90%', '66%', 12, 8], ['50%', '90%', 20, 9], ['72%', '40%', 10, 6]] as const;
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <span aria-hidden className="absolute -left-40 -top-24 size-[30rem] animate-[drift_12s_ease-in-out_infinite] rounded-full opacity-30 blur-3xl" style={{ background: '#4054d6' }} />
      <span aria-hidden className="absolute -bottom-32 -right-40 size-[32rem] animate-[drift_16s_ease-in-out_infinite_reverse] rounded-full opacity-30 blur-3xl" style={{ background: '#0f7f78' }} />
      <span aria-hidden className="absolute left-1/2 top-1/3 size-72 animate-[drift_20s_ease-in-out_infinite] rounded-full opacity-15 blur-3xl" style={{ background: '#8da0ff' }} />
      {dots.map(([x, y, size, t], i) => (
        <span key={i} aria-hidden className="absolute rounded-full opacity-60" style={{ left: x, top: y, width: size, height: size, background: i % 2 ? '#0f7f78' : '#4054d6', animation: `bob ${t}s ease-in-out ${i * 0.7}s infinite` }} />
      ))}
      <main className="relative mx-auto grid min-h-dvh max-w-md content-center px-4 py-10">
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
    </div>
  );
}
