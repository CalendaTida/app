'use client';
import { useEffect, useState } from 'react';
import { Cfg, Log, MON, isPlan, iso } from '@/lib/core';

type Props = { cfg: Cfg; logs: Record<string, Log>; year: number; today: string; onPick: (ds: string) => void };

function Month({ cfg, logs, year, today, onPick, m, big, inert }: Props & { m: number; big?: boolean; inert?: boolean }) {
  const n = new Date(year, m + 1, 0).getDate(), lead = new Date(year, m, 1).getDay();
  return (
    <div className={`grid grid-cols-7 text-center ${big ? 'gap-1.5 text-base' : 'gap-px text-[9px] leading-none'}`}>
      {'DSTQQSS'.split('').map((x, i) => <i key={i} className="not-italic text-mut">{x}</i>)}
      {Array.from({ length: lead }, (_, i) => <b key={`l${i}`} />)}
      {Array.from({ length: n }, (_, i) => {
        const d = i + 1, ds = iso(new Date(year, m, d)), L = logs[ds], plan = isPlan(cfg, ds);
        const cls = [
          'aspect-square rounded-full transition hover:bg-bg', inert ? 'pointer-events-none' : '',
          L?.done ? 'bg-ok font-bold text-okfg hover:!bg-ok' : plan ? `font-bold text-plan ring-inset ring-plan ${big ? 'ring-2' : 'ring-1'}` : '',
          L?.weight ? 'underline underline-offset-2' : '',
          ds === today ? 'outline-dashed outline-1 outline-offset-1 outline-ink' : '',
        ].join(' ');
        return (
          <button key={d} type="button" tabIndex={inert ? -1 : 0} className={cls} onClick={() => onPick(ds)}
            aria-label={`${d} de ${MON[m]}${plan ? ', dia de registro' : ''}${L?.done ? ', aplicação feita' : ''}`}>{d}</button>
        );
      })}
    </div>
  );
}

// Mouse: o mês amplia ao passar o cursor. Toque: tocar no mês abre uma versão grande.
export default function Calendar(p: Props) {
  const [coarse, setCoarse] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    const mq = matchMedia('(hover: none)');
    const f = () => setCoarse(mq.matches);
    f(); mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);

  return (
    <>
      <div className="mgrid mt-3">
        {MON.map((name, m) => (
          <section key={name} className="mcard cursor-zoom-in rounded-2xl border border-line bg-card p-2" onClick={coarse ? () => setOpen(m) : undefined}>
            <h3 className="mb-1 text-xs">{name}</h3>
            <Month {...p} m={m} inert={coarse} />
          </section>
        ))}
      </div>
      {open !== null && (
        <div className="pop-bg fixed inset-0 z-40 grid place-items-center bg-black/60 p-4" onClick={() => setOpen(null)}>
          <div className="pop w-full max-w-sm rounded-2xl border border-line bg-card p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl">{MON[open]} {p.year}</h3>
              <button type="button" className="btn-alt !px-3 !py-1.5" onClick={() => setOpen(null)} aria-label="Fechar">✕</button>
            </div>
            <Month {...p} m={open} big onPick={(ds) => { setOpen(null); p.onPick(ds); }} />
          </div>
        </div>
      )}
    </>
  );
}
