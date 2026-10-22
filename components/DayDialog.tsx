'use client';
import { useEffect, useRef, useState } from 'react';
import { Cfg, DOW, Log, bmi, bmiLabel, fmt, isPlan, kg, num, parse } from '@/lib/core';

type Props = { ds: string; cfg: Cfg; log?: Log; onSave: (l: Log | null) => void; onClose: () => void };

export default function DayDialog({ ds, cfg, log, onSave, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const plan = isPlan(cfg, ds);
  const [done, setDone] = useState(log?.done ?? (!log && plan));
  const [weight, setWeight] = useState(log?.weight ? String(log.weight).replace('.', ',') : '');
  const [note, setNote] = useState(log?.note ?? '');
  useEffect(() => { ref.current?.showModal(); }, []);

  const w = num(weight), v = bmi(w, cfg.height);
  const save = () => {
    const l: Log = { done, note: note.trim() };
    if (w > 0 && w < 400) l.weight = Math.round(w * 10) / 10;
    onSave(l.done || l.weight || l.note ? l : null);
  };

  return (
    <dialog ref={ref} onClose={onClose} className="m-auto w-[min(440px,92vw)] rounded-2xl border border-line bg-card p-5 text-ink backdrop:bg-black/60">
      <h3 className="text-xl">{DOW[parse(ds).getDay()]}, {fmt(ds)}</h3>
      <p className="hint">{plan ? 'Dia de registro do seu tratamento.' : 'Fora do seu dia habitual. Use para registrar em outra data.'}</p>
      <label className="mt-3.5 flex items-center gap-2.5 font-semibold">
        <input type="checkbox" className="size-5" checked={done} onChange={(e) => setDone(e.target.checked)} /> Aplicação feita
      </label>
      <label className="lbl" htmlFor="w">Peso (kg)</label>
      <input id="w" className="inp" inputMode="decimal" placeholder="Ex.: 82,4" value={weight} onChange={(e) => setWeight(e.target.value)} />
      <p className="hint">{v ? `IMC ${kg(v)}, ${bmiLabel(v, cfg.birth)}` : 'O IMC aparece quando você informa o peso.'}</p>
      <label className="lbl" htmlFor="nt">Observação do dia</label>
      <textarea id="nt" className="inp min-h-[70px]" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={save}>Salvar</button>
        <button type="button" className="btn-alt" onClick={onClose}>Cancelar</button>
        {log && <button type="button" className="btn-danger" onClick={() => onSave(null)}>Remover registro</button>}
      </div>
    </dialog>
  );
}
