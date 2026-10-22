export type Cfg = { pen: string; start: string; months: number; weekday: number; birth: string; height: number; notes: string };
export type Log = { done?: boolean; weight?: number; note?: string };
export type Data = { cfg: Cfg | null; logs: Record<string, Log> };
type Pen = { g: string; f: 'semanal' | 'diária'; items: string[]; d: string };

export const PENS: Pen[] = [
  { g: 'Tirzepatida', f: 'semanal', items: ['Mounjaro', 'Zepbound'],
    d: 'Agonista duplo dos receptores GLP-1 e GIP. Considerada a opção mais eficaz atualmente, com perda média de peso superior à dos agonistas de GLP-1 isolados. Aplicação semanal.' },
  { g: 'Semaglutida', f: 'semanal', items: ['Wegovy', 'Ozempic', 'Poviztra', 'Extensior'],
    d: 'Agonista de GLP-1. O Wegovy é aprovado para obesidade, em doses maiores; o Ozempic tem indicação primária para diabetes tipo 2 (uso off-label para emagrecimento). Poviztra e Extensior são versões nacionais, com doses menores e custo potencialmente mais acessível. Aplicação semanal.' },
  { g: 'Liraglutida', f: 'diária', items: ['Saxenda', 'Olire', 'Victoza', 'Lirux'],
    d: 'Molécula mais antiga da classe, agonista de GLP-1. Saxenda e Olire são aprovados para obesidade; Victoza e Lirux focam no diabetes. A aplicação é diária.' },
  { g: 'Retatrutida', f: 'semanal', items: ['Retatrutida'],
    d: 'Agonista triplo (GLP-1, GIP e glucagon), em fase avançada de estudo e ainda sem aprovação clínica ampla para uso rotineiro.' },
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
