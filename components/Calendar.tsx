import { Cfg, Log, MON, isPlan, iso } from '@/lib/core';

type Props = { cfg: Cfg; logs: Record<string, Log>; year: number; today: string; onPick: (ds: string) => void };

export default function Calendar({ cfg, logs, year, today, onPick }: Props) {
  return (
    <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {MON.map((name, m) => {
        const n = new Date(year, m + 1, 0).getDate();
        const lead = new Date(year, m, 1).getDay();
        return (
          <section key={name} className="rounded-2xl border border-line bg-card p-3.5">
            <h3 className="mb-2 text-lg">{name}</h3>
            <div className="grid grid-cols-7 gap-[3px] text-center">
              {'DSTQQSS'.split('').map((x, i) => <i key={i} className="text-xs not-italic text-mut">{x}</i>)}
              {Array.from({ length: lead }, (_, i) => <b key={`l${i}`} />)}
              {Array.from({ length: n }, (_, i) => {
                const d = i + 1, ds = iso(new Date(year, m, d)), L = logs[ds], plan = isPlan(cfg, ds);
                const cls = [
                  'aspect-square rounded-full text-sm hover:bg-bg',
                  L?.done ? 'bg-ok font-bold text-okfg hover:!bg-ok' : plan ? 'font-bold text-plan ring-2 ring-inset ring-plan' : '',
                  L?.weight ? 'underline underline-offset-4' : '',
                  ds === today ? 'outline-dashed outline-2 outline-offset-1 outline-ink' : '',
                ].join(' ');
                return (
                  <button key={d} type="button" className={cls} onClick={() => onPick(ds)}
                    aria-label={`${d} de ${name}${plan ? ', dia de registro' : ''}${L?.done ? ', aplicação feita' : ''}`}>{d}</button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
