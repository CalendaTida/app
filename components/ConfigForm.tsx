'use client';
import { useState } from 'react';
import { Cfg, DOW, PENS, freqLabel, iso, num, penFreq, penInfo } from '@/lib/core';

type Props = { initial: Cfg | null; onSave: (c: Cfg) => void; onCancel?: () => void };
const STEPS = ['Caneta', 'Rotina', 'Você'];

export default function ConfigForm({ initial, onSave, onCancel }: Props) {
  const now = new Date();
  const [step, setStep] = useState(0);
  const [c, setC] = useState({
    pen: initial?.pen ?? 'Mounjaro', start: initial?.start ?? iso(now), months: String(initial?.months ?? 6),
    weekday: initial?.weekday ?? now.getDay(), birth: initial?.birth ?? '', height: initial ? String(initial.height) : '', notes: initial?.notes ?? '',
  });
  const [err, setErr] = useState('');
  const g = penInfo(c.pen), f = penFreq(c.pen);
  const set = (k: keyof typeof c, v: string | number) => setC({ ...c, [k]: v });
  const go = (n: number) => { setErr(''); setStep(n); };
  const months = parseInt(c.months, 10), height = num(c.height);

  const next = () => (!c.start || !months ? setErr('Informe a data de início e por quantos meses.') : go(step + 1));
  const save = () => {
    if (!c.start || !months) { go(1); return setErr('Informe a data de início e por quantos meses.'); }
    if (!c.birth || !height) return setErr('Preencha a data de nascimento e a altura. O IMC depende deles.');
    onSave({ pen: c.pen, start: c.start, months, weekday: c.weekday, birth: c.birth, height, notes: c.notes });
  };

  return (
    <div className="card pop mx-auto mt-6 max-w-2xl">
      <ol className="mb-5 flex gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <button type="button" onClick={() => go(i)} className="block w-full text-left">
              <span className={`block h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-plan' : 'bg-line'}`} />
              <span className={`mt-1.5 block text-sm font-semibold ${i === step ? 'text-ink' : 'text-mut'}`}>{i + 1}. {s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div key={step} className="rise">
        {step === 0 && (<>
          <h2 className="text-2xl">Qual caneta você usa?</h2>
          <p className="hint">Escolha a substância e depois o nome comercial.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PENS.map((p) => <button key={p.g} type="button" className={p.g === g.g ? 'chip chip-on' : 'chip'} onClick={() => set('pen', p.items[0])}>{p.g}</button>)}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {g.items.map((i) => <button key={i} type="button" className={i === c.pen ? 'chip chip-on' : 'chip'} onClick={() => set('pen', i)}>{i}</button>)}
          </div>
          <p className="hint mt-4">{g.d}</p>
          <p className="mt-2 text-sm font-semibold">{c.pen}: {freqLabel(f)}</p>
        </>)}

        {step === 1 && (<>
          <h2 className="text-2xl">Sua rotina</h2>
          <label className="lbl" htmlFor="start">Início do tratamento</label>
          <input id="start" type="date" className="inp" value={c.start} onChange={(e) => set('start', e.target.value)} />
          <label className="lbl" htmlFor="months">Por quantos meses?</label>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {[3, 6, 12, 24].map((n) => <button key={n} type="button" className={String(n) === c.months ? 'chip chip-on' : 'chip'} onClick={() => set('months', String(n))}>{n}</button>)}
            <input id="months" type="number" min={1} max={60} className="inp !mt-0 !w-24" value={c.months} onChange={(e) => set('months', e.target.value)} />
          </div>
          <span className="lbl">Dia da semana do registro</span>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {DOW.map((d, i) => <button key={d} type="button" aria-pressed={i === c.weekday} className={`chip !px-0 text-center ${i === c.weekday ? 'chip-on' : ''}`} onClick={() => set('weekday', i)}>{d.slice(0, 3)}</button>)}
          </div>
          <p className="hint">
            {f === 'diária' ? 'Como o uso é diário, este será o dia da pesagem semanal. Você marca a aplicação em qualquer dia do calendário.'
              : f === 'semanal' ? 'Toda semana, neste dia, o calendário mostra o registro. Se precisar mudar, volte aqui ou registre em outra data.'
              : 'Use o dia da semana que o seu médico indicou. Se precisar mudar, volte aqui.'}
          </p>
        </>)}

        {step === 2 && (<>
          <h2 className="text-2xl">Sobre você</h2>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <div><label className="lbl" htmlFor="birth">Data de nascimento</label><input id="birth" type="date" className="inp" value={c.birth} onChange={(e) => set('birth', e.target.value)} /></div>
            <div><label className="lbl" htmlFor="height">Altura (cm)</label><input id="height" type="number" min={30} max={250} className="inp" value={c.height} onChange={(e) => set('height', e.target.value)} placeholder="Ex.: 170" /></div>
          </div>
          <p className="hint">Com a altura, o IMC é calculado sozinho a cada peso que você registrar.</p>
          <label className="lbl" htmlFor="notes">Anotações para a próxima consulta</label>
          <textarea id="notes" className="inp min-h-24" value={c.notes} onChange={(e) => set('notes', e.target.value)} />
        </>)}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {step > 0 && <button type="button" className="btn-alt" onClick={() => go(step - 1)}>Voltar</button>}
        {step < 2 ? <button type="button" className="btn" onClick={next}>Continuar</button> : <button type="button" className="btn" onClick={save}>Salvar configuração</button>}
        {onCancel && <button type="button" className="btn-alt" onClick={onCancel}>Cancelar</button>}
      </div>
      {err && <p className="hint !text-warn" role="alert">{err}</p>}
    </div>
  );
}
