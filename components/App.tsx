'use client';
import { useEffect, useRef, useState } from 'react';
import Calendar from './Calendar';
import ConfigForm from './ConfigForm';
import DayDialog from './DayDialog';
import ThemeToggle from './ThemeToggle';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { Cfg, Data, DOW, age, bmi, bmiLabel, endDate, fmt, freqLabel, iso, kg, nextPlan, parse, penFreq, penInfo } from '@/lib/core';

export default function App({ name }: { name: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [editing, setEditing] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [status, setStatus] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    fetch('/api/data')
      .then((r) => { if (r.status === 401) { location.reload(); throw 0; } return r.json(); })
      .then((r: { data: Data | null }) => setData({ cfg: r.data?.cfg ?? null, logs: r.data?.logs ?? {} }))
      .catch(() => setStatus('Não foi possível carregar seus dados. Atualize a página.'));
  }, []);

  const commit = (d: Data) => {
    setData(d);
    setStatus('Salvando…');
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch('/api/data', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: d }) });
        setStatus(r.ok ? 'Salvo e criptografado' : 'Não foi possível salvar. Tente novamente.');
      } catch { setStatus('Sem conexão. Tente novamente.'); }
    }, 700);
  };
  const logout = async () => { await supabaseBrowser().auth.signOut(); location.reload(); };

  if (!data) return <main className="mx-auto max-w-5xl p-6 text-mut">{status || 'Carregando…'}</main>;
  if (!data.cfg || editing) {
    return (
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <ConfigForm initial={data.cfg} onCancel={data.cfg ? () => setEditing(false) : undefined}
          onSave={(c: Cfg) => { commit({ ...data, cfg: c }); setEditing(false); }} />
      </main>
    );
  }

  const { cfg, logs } = data, pen = penInfo(cfg.pen), today = iso(new Date());
  const weights = Object.entries(logs).filter(([, l]) => l.weight).sort(([a], [b]) => a.localeCompare(b)) as [string, { weight: number }][];
  const last = weights.at(-1)?.[1].weight, first = weights[0]?.[1].weight;
  const cur = last ? bmi(last, cfg.height) : null;
  const diff = last && first && weights.length > 1 ? last - first : null;
  const next = nextPlan(cfg, today);
  const stats = [
    { v: cfg.pen, l: `${pen.g}, ${freqLabel(penFreq(cfg.pen))}` },
    { v: last ? `${kg(last)} kg` : '—', l: 'Peso atual' },
    { v: cur ? kg(cur) : '—', l: cur ? `IMC, ${bmiLabel(cur, cfg.birth)}` : 'IMC' },
    { v: diff === null ? '—' : `${diff > 0 ? '+' : ''}${kg(diff)} kg`, l: 'Variação desde o início' },
    { v: String(Object.values(logs).filter((l) => l.done).length), l: 'Aplicações registradas' },
    { v: `${age(cfg.birth)} anos`, l: `Tratamento até ${fmt(endDate(cfg))}` },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-5">
      <header className="rise flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="size-11" />
          <div><h1 className="text-3xl leading-none">CalendaTida</h1><span className="text-sm text-mut">Olá, {name}</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-mut" role="status">{status}</span>
          <ThemeToggle />
          <button type="button" className="btn-alt" onClick={() => setEditing(true)}>Configuração</button>
          <button type="button" className="btn-alt" onClick={logout}>Sair</button>
        </div>
      </header>

      <section className="card rise [animation-delay:80ms] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        {stats.map((s) => (
          <div key={s.l}><b className="block font-display text-2xl">{s.v}</b><span className="text-sm text-mut">{s.l}</span></div>
        ))}
      </section>

      <section className="card rise [animation-delay:160ms] flex flex-wrap items-center justify-between gap-4 border-l-[6px] border-l-plan">
        <div>
          <h3 className="text-lg">{next ? 'Próximo registro' : 'Tratamento concluído'}</h3>
          <span className="text-sm text-mut">{next ? `${DOW[parse(next).getDay()]}, ${fmt(next)}` : 'O período configurado terminou. Ajuste a duração na configuração, se continuar.'}</span>
        </div>
        {next && <button type="button" className="btn" onClick={() => setPick(next)}>Registrar</button>}
      </section>

      <section className="card rise [animation-delay:240ms]">
        <h3 className="text-lg">Anotações para a próxima consulta</h3>
        <textarea className="inp min-h-24" placeholder="Efeitos, dúvidas, doses, o que perguntar ao médico" value={cfg.notes}
          onChange={(e) => commit({ ...data, cfg: { ...cfg, notes: e.target.value } })} />
      </section>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" className="btn-alt" onClick={() => setYear(year - 1)} aria-label="Ano anterior">‹</button>
        <h2 className="text-3xl">{year}</h2>
        <button type="button" className="btn-alt" onClick={() => setYear(year + 1)} aria-label="Próximo ano">›</button>
      </div>
      <p className="mt-2 text-sm text-mut">Anel: dia de registro. Preenchido: aplicação feita. Sublinhado: peso registrado. Passe o mouse (ou toque) num mês para ampliar e clique no dia para registrar.</p>
      <Calendar cfg={cfg} logs={logs} year={year} today={today} onPick={setPick} />

      <section className="card">
        <h3 className="text-lg">Histórico de peso</h3>
        {weights.length ? (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-sm text-mut"><tr><th className="py-2 font-medium">Data</th><th className="font-medium">Peso</th><th className="font-medium">IMC</th><th className="font-medium">Variação</th></tr></thead>
              <tbody>
                {weights.map(([d, l], i) => {
                  const prev = weights[i - 1]?.[1].weight, v = bmi(l.weight, cfg.height);
                  return (
                    <tr key={d} className="border-t border-line">
                      <td className="py-2">{fmt(d)}</td><td>{kg(l.weight)} kg</td>
                      <td>{v ? `${kg(v)} (${bmiLabel(v, cfg.birth)})` : '—'}</td>
                      <td>{prev ? `${l.weight - prev > 0 ? '+' : ''}${kg(l.weight - prev)} kg` : '—'}</td>
                    </tr>
                  );
                }).reverse()}
              </tbody>
            </table>
          </div>
        ) : <p className="hint">Nenhum peso registrado ainda. Use o botão Registrar acima.</p>}
      </section>
      <p className="mt-8 text-sm text-mut">Este app serve apenas para acompanhamento e não substitui a orientação do seu médico.</p>

      {pick && (
        <DayDialog key={pick} ds={pick} cfg={cfg} log={logs[pick]} onClose={() => setPick(null)}
          onSave={(l) => {
            const next = { ...logs };
            if (l) next[pick] = l; else delete next[pick];
            commit({ cfg, logs: next });
            setPick(null);
          }} />
      )}
    </main>
  );
}
