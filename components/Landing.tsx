import Link from 'next/link';
import Reveal from './Reveal';
import ThemeToggle from './ThemeToggle';
import { BRANDS, PENS } from '@/lib/core';

const FEATURES = [
  ['📅', 'O ano inteiro numa tela', 'Os 12 meses lado a lado. Passe o mouse (ou toque) num mês para ampliar e registrar.'],
  ['⚖️', 'Peso e IMC automáticos', 'Anote o peso e o IMC é calculado na hora, com histórico e variação desde o início.'],
  ['💉', 'Todas as canetas', 'De Ozempic e Mounjaro a Trulicity, Soliqua e as substâncias em estudo.'],
  ['📝', 'Anotações da consulta', 'Efeitos, dúvidas e doses anotados para você não esquecer nada com o médico.'],
  ['🔒', 'Dados criptografados', 'Seus registros ficam guardados de forma criptografada.'],
  ['🌗', 'Claro e escuro', 'Tema automático, claro ou escuro, do jeito que seus olhos preferirem.'],
];
const STEPS = [
  ['1', 'Crie sua conta', 'Só e-mail e senha. Em seguida você já entra.'],
  ['2', 'Configure o tratamento', 'Escolha a caneta, o dia da semana e por quanto tempo vai usar.'],
  ['3', 'Registre toda semana', 'No dia marcado, um toque para anotar a aplicação e o peso.'],
];

const Row = ({ rev }: { rev?: boolean }) => {
  const list = rev ? [...BRANDS].reverse() : BRANDS;
  return (
    <div className="overflow-hidden py-1.5">
      <div className={`marquee ${rev ? 'marquee-rev' : ''}`} aria-hidden={rev}>
        {[...list, ...list].map((b, i) => (
          <span key={i} className="mr-3 whitespace-nowrap rounded-full border border-line bg-card px-5 py-2.5 font-display text-lg font-bold">{b}</span>
        ))}
      </div>
    </div>
  );
};

export default function Landing() {
  return (
    <div className="overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-line backdrop-blur" style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className="size-9" /><span className="font-display text-xl font-bold">CalendaTida</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-mut md:flex">
            <a href="#recursos" className="hover:text-ink">Recursos</a><a href="#canetas" className="hover:text-ink">Canetas</a><a href="#como" className="hover:text-ink">Como funciona</a>
          </nav>
          <div className="flex items-center gap-2"><ThemeToggle /><Link href="/entrar" className="btn">Entrar</Link></div>
        </div>
      </header>

      <section className="relative isolate">
        <span aria-hidden className="absolute -left-24 top-8 -z-10 size-80 animate-[drift_14s_ease-in-out_infinite] rounded-full opacity-25 blur-3xl" style={{ background: '#4054d6' }} />
        <span aria-hidden className="absolute -right-24 top-40 -z-10 size-80 animate-[drift_18s_ease-in-out_infinite_reverse] rounded-full opacity-25 blur-3xl" style={{ background: '#0f7f78' }} />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-14 md:grid-cols-2 md:pt-20">
          <div>
            <p className="rise inline-block rounded-full border border-line bg-card px-3.5 py-1 text-sm font-semibold text-mut">Acompanhamento de canetas emagrecedoras</p>
            <h1 className="rise mt-4 text-5xl leading-[1.02] [animation-delay:100ms] md:text-6xl">Seu tratamento, semana a semana, num só calendário.</h1>
            <p className="rise mt-5 max-w-lg text-lg text-mut [animation-delay:200ms]">Registre aplicações, peso e IMC, leve suas anotações para a consulta e veja a sua evolução ao longo do ano.</p>
            <div className="rise mt-7 flex flex-wrap gap-3 [animation-delay:300ms]">
              <Link href="/entrar?modo=criar" className="btn !px-6 !py-3.5 text-lg">Criar conta</Link>
              <a href="#como" className="btn-alt !px-6 !py-3.5 text-lg">Ver como funciona</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="card pop !mt-0 rotate-2 animate-[bob_7s_ease-in-out_infinite] shadow-2xl">
              <div className="mb-3 flex items-center justify-between"><b className="font-display text-lg">Outubro</b><span className="text-xs text-mut">quinta: dia de registro</span></div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 35 }, (_, i) => i % 7 === 4
                  ? <span key={i} style={{ animationDelay: `${Math.floor(i / 7) * 0.9}s` }} className="lit aspect-square rounded-full ring-2 ring-inset ring-plan" />
                  : <span key={i} className="aspect-square rounded-full" style={{ background: 'var(--dot)' }} />)}
              </div>
            </div>
            <span className="absolute -left-5 top-6 animate-[bob_5s_ease-in-out_infinite] rounded-full border border-line bg-card px-4 py-2 font-display font-bold shadow-lg">Mounjaro</span>
            <span className="absolute -right-3 top-28 animate-[bob_6s_ease-in-out_infinite_reverse] rounded-full border border-line bg-card px-4 py-2 font-display font-bold shadow-lg">IMC 24,8</span>
            <span className="absolute -bottom-4 left-10 animate-[bob_8s_ease-in-out_infinite] rounded-full px-4 py-2 font-display font-bold text-white shadow-lg" style={{ background: '#0f7f78' }}>−3,2 kg</span>
          </div>
        </div>
      </section>

      <section aria-label="Canetas compatíveis" className="py-6">
        <Row /><Row rev />
      </section>

      <section id="recursos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <Reveal><h2 className="text-4xl">Tudo para acompanhar sem complicação</h2></Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([i, t, d], n) => (
            <Reveal key={t} delay={n * 80}>
              <div className="card !mt-0 h-full transition hover:-translate-y-1 hover:shadow-xl"><span className="text-3xl">{i}</span><h3 className="mt-3 text-xl">{t}</h3><p className="mt-1.5 text-mut">{d}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="como" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <Reveal><h2 className="text-4xl">Como funciona</h2></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 120}>
              <div className="card !mt-0 h-full"><span className="grid size-11 place-items-center rounded-full font-display text-xl font-bold text-white" style={{ background: 'linear-gradient(135deg,#4054d6,#0f7f78)' }}>{n}</span><h3 className="mt-4 text-xl">{t}</h3><p className="mt-1.5 text-mut">{d}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="canetas" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <Reveal><h2 className="text-4xl">Todas as canetas, num lugar só</h2><p className="mt-2 max-w-2xl text-mut">Os registros e as indicações variam entre os produtos. Confira sempre a bula e a orientação do seu médico.</p></Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PENS.map((p, i) => (
            <Reveal key={p.g} delay={(i % 3) * 80}>
              <div className="card !mt-0 h-full">
                <h3 className="text-xl">{p.g}</h3>
                <div className="mt-2.5 flex flex-wrap gap-1.5">{p.items.map((b) => <span key={b} className="rounded-full border border-line px-3 py-1 text-sm font-semibold">{b}</span>)}</div>
                <p className="mt-3 text-sm text-mut">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-8">
        <Reveal>
          <div className="shift rounded-3xl px-6 py-14 text-center text-white" style={{ backgroundImage: 'linear-gradient(120deg,#4054d6,#0f7f78,#4054d6)' }}>
            <h2 className="text-4xl md:text-5xl">Comece o seu calendário hoje</h2>
            <p className="mx-auto mt-3 max-w-md opacity-90">Crie a conta em menos de um minuto e já registre a próxima aplicação.</p>
            <Link href="/entrar?modo=criar" className="mt-7 inline-block rounded-xl bg-white px-7 py-3.5 text-lg font-semibold transition hover:-translate-y-0.5 active:scale-95" style={{ color: '#10282f' }}>Criar conta</Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-line px-4 py-8 text-center text-sm text-mut">
        <p>CalendaTida serve apenas para acompanhamento e não substitui a orientação do seu médico.</p>
        <p className="mt-2"><Link href="/entrar" className="font-semibold text-ink underline underline-offset-4">Entrar</Link></p>
      </footer>
    </div>
  );
}
