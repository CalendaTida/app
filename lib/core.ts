export type Cfg = { pen: string; start: string; months: number; weekday: number; birth: string; height: number; notes: string };
export type Log = { done?: boolean; weight?: number; note?: string };
export type Data = { cfg: Cfg | null; logs: Record<string, Log> };
export type Freq = 'semanal' | 'diária' | 'prescrição';
export type Pen = { g: string; f: Freq; items: string[]; ov?: Record<string, Freq>; d: string };

export const PENS: Pen[] = [
  { g: 'Semaglutida', f: 'semanal', items: ['Ozempic', 'Wegovy', 'Poviztra', 'Extensior', 'Ozivy', 'Semavy', 'Semaclique', 'Owozy', 'Seemasun', 'Zempneo', 'Orsema', 'Yluméc', 'Semaglutida genérica'],
    d: 'Agonista de GLP-1. O Wegovy é aprovado para obesidade, em doses maiores; o Ozempic tem indicação primária para diabetes tipo 2 (uso off-label para emagrecimento). Poviztra e Extensior são versões nacionais, com doses menores. Os demais são outras versões de semaglutida, e a genérica não tem nome comercial. Os registros e as indicações variam entre os produtos, então confira a bula do seu.' },
  { g: 'Tirzepatida', f: 'semanal', items: ['Mounjaro', 'Zepbound'],
    d: 'Agonista duplo dos receptores GLP-1 e GIP. Considerada a opção mais eficaz atualmente, com perda média de peso superior à dos agonistas de GLP-1 isolados.' },
  { g: 'Liraglutida', f: 'diária', items: ['Saxenda', 'Victoza', 'Olire', 'Lirux', 'Liraclick'],
    d: 'Molécula mais antiga da classe, agonista de GLP-1. Saxenda e Olire são aprovados para obesidade; Victoza e Lirux focam no diabetes. Confira na bula a indicação do Liraclick.' },
  { g: 'Dulaglutida', f: 'semanal', items: ['Trulicity'], d: 'Agonista de GLP-1 de aplicação semanal, indicado para diabetes tipo 2.' },
  { g: 'Lixisenatida', f: 'diária', items: ['Adlyxin', 'Lyxumia'], d: 'Agonista de GLP-1 de aplicação diária, indicado para diabetes tipo 2. O nome comercial varia conforme o país.' },
  { g: 'Exenatida', f: 'diária', items: ['Byetta', 'Bydureon'], ov: { Bydureon: 'semanal' },
    d: 'Agonista de GLP-1 para diabetes tipo 2. O Byetta é aplicado duas vezes ao dia; o Bydureon é de liberação prolongada, semanal.' },
  { g: 'Insulina glargina + lixisenatida', f: 'diária', items: ['Soliqua'], d: 'Combinação de insulina basal com agonista de GLP-1, de aplicação diária, para diabetes tipo 2.' },
  { g: 'Insulina degludeca + liraglutida', f: 'diária', items: ['Xultophy'], d: 'Combinação de insulina basal com agonista de GLP-1, de aplicação diária, para diabetes tipo 2.' },
  { g: 'Retatrutida', f: 'prescrição', items: ['Retatrutida'], d: 'Agonista triplo (GLP-1, GIP e glucagon). Substância experimental, sem nome comercial aprovado.' },
  { g: 'CagriSema', f: 'prescrição', items: ['CagriSema'], d: 'Combinação experimental de cagrilintida e semaglutida.' },
  { g: 'Cagrilintida', f: 'prescrição', items: ['Cagrilintida'], d: 'Análogo da amilina. Substância investigacional.' },
  { g: 'Survodutida', f: 'prescrição', items: ['Survodutida'], d: 'Agonista duplo de GLP-1 e glucagon. Substância experimental.' },
  { g: 'Mazdutida', f: 'prescrição', items: ['Mazdutida'], d: 'Agonista duplo de GLP-1 e glucagon. O status de aprovação depende do país e da indicação.' },
  { g: 'Pemvidutida', f: 'prescrição', items: ['Pemvidutida'], d: 'Agonista duplo de GLP-1 e glucagon. Substância experimental.' },
];
export const MON = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
export const DOW = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

const p2 = (n: number) => String(n).padStart(2, '0');
export const iso = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const fmt = (s: string) => parse(s).toLocaleDateString('pt-BR');
export const kg = (n: number) => n.toFixed(1).replace('.', ',');
export const num = (v: string) => parseFloat(v.replace(',', '.'));
export const penInfo = (n: string) => PENS.find((p) => p.items.includes(n)) ?? PENS[0];
export const penFreq = (n: string): Freq => penInfo(n).ov?.[n] ?? penInfo(n).f;
export const freqLabel = (f: Freq) => (f === 'semanal' ? 'aplicação semanal' : f === 'diária' ? 'aplicação diária' : 'uso conforme prescrição');
export const BRANDS = PENS.flatMap((p) => p.items);

export const bmi = (w: number, h: number) => (w > 0 && h > 0 ? w / (h / 100) ** 2 : null);
export const age = (birth: string) => {
  const n = new Date(), b = parse(birth);
  let a = n.getFullYear() - b.getFullYear();
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--;
  return a;
};
// Sem idade mínima para o cálculo. Abaixo de 18 anos não há classificação de adultos: a avaliação é do médico.
export const bmiLabel = (v: number, birth: string) =>
  age(birth) < 18 ? 'avaliação com seu médico'
    : v < 18.5 ? 'abaixo do peso' : v < 25 ? 'peso normal' : v < 30 ? 'sobrepeso'
    : v < 35 ? 'obesidade grau I' : v < 40 ? 'obesidade grau II' : 'obesidade grau III';

export const endDate = (c: Cfg) => { const d = parse(c.start); d.setMonth(d.getMonth() + c.months); return iso(d); };
export const isPlan = (c: Cfg, ds: string) => ds >= c.start && ds <= endDate(c) && parse(ds).getDay() === c.weekday;
export const nextPlan = (c: Cfg, from: string) => {
  const end = endDate(c);
  for (const d = parse(from > c.start ? from : c.start); iso(d) <= end; d.setDate(d.getDate() + 1)) if (d.getDay() === c.weekday) return iso(d);
  return null;
};
