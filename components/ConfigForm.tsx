'use client';
import { useState } from 'react';
import { Cfg, DOW, PENS, iso, num, penInfo } from '@/lib/core';

type Props = { initial: Cfg | null; onSave: (c: Cfg) => void; onCancel?: () => void };

export default function ConfigForm({ initial, onSave, onCancel }: Props) {
  const now = new Date();
  const [c, setC] = useState({
    pen: initial?.pen ?? 'Mounjaro', start: initial?.start ?? iso(now), months: String(initial?.months ?? 6),
    weekday: String(initial?.weekday ?? now.getDay()), birth: initial?.birth ?? '', height: initial ? String(initial.height) : '', notes: initial?.notes ?? '',
  });
  const [err, setErr] = useState('');
  const set = (k: keyof typeof c) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setC({ ...c, [k]: e.target.value });
  const pen = penInfo(c.pen);

  const submit = () => {
    const months = parseInt(c.months, 10), height = num(c.height);
    if (!c.start || !months || !c.birth || !height) return setErr('Preencha início, duração, data de nascimento e altura. O IMC depende deles.');
    onSave({ pen: c.pen, start: c.start, months, weekday: parseInt(c.weekday, 10), birth: c.birth, height, notes: c.notes });
  };

  return (
    <div className="card mx-auto mt-6 max-w-2xl">
      <h2 className="text-2xl">{initial ? 'Configuração' : 'Vamos configurar seu tratamento'}</h2>
      <label className="lbl" htmlFor="pen">Qual caneta você está usando?</label>
      <select id="pen" className="inp" value={c.pen} onChange={set('pen')}>
        {PENS.map((p) => (
          <optgroup key={p.g} label={p.g}>{p.items.map((i) => <option key={i}>{i}</option>)}</optgroup>
        ))}
      </select>
      <p className="hint">{pen.d}</p>
      <div className="grid gap-x-4 sm:grid-cols-2">
        <div><label className="lbl" htmlFor="start">Início do tratamento</label><input id="start" type="date" className="inp" value={c.start} onChange={set('start')} /></div>
        <div><label className="lbl" htmlFor="months">Por quantos meses?</label><input id="months" type="number" min={1} max={60} className="inp" value={c.months} onChange={set('months')} /></div>
        <div>
          <label className="lbl" htmlFor="wd">Dia da semana do registro</label>
          <select id="wd" className="inp" value={c.weekday} onChange={set('weekday')}>{DOW.map((d, i) => <option key={d} value={i}>{d}</option>)}</select>
        </div>
        <div><label className="lbl" htmlFor="birth">Data de nascimento</label><input id="birth" type="date" className="inp" value={c.birth} onChange={set('birth')} /></div>
        <div><label className="lbl" htmlFor="height">Altura (cm)</label><input id="height" type="number" min={30} max={250} className="inp" value={c.height} onChange={set('height')} placeholder="Ex.: 170" /></div>
      </div>
      <p className="hint">
        {pen.f === 'diária'
          ? 'Como o uso é diário, este dia será o da pesagem semanal. Você pode marcar a aplicação em qualquer dia do calendário.'
          : 'Toda semana, neste dia, o calendário mostra o registro. Se precisar mudar, volte aqui ou registre em outra data.'}
      </p>
      <label className="lbl" htmlFor="notes">Anotações para a próxima consulta</label>
      <textarea id="notes" className="inp min-h-24" value={c.notes} onChange={set('notes')} />
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={submit}>Salvar configuração</button>
        {onCancel && <button type="button" className="btn-alt" onClick={onCancel}>Cancelar</button>}
      </div>
      {err && <p className="hint !text-warn" role="alert">{err}</p>}
    </div>
  );
}
