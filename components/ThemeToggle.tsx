'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const ORDER = ['system', 'light', 'dark'] as const;
const LABEL = { system: '◐ Auto', light: '☀ Claro', dark: '☾ Escuro' };
const NAME = { system: 'automático', light: 'claro', dark: 'escuro' };

export default function ThemeToggle() {
  const { theme = 'system', setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const cur = (ORDER.includes(theme as (typeof ORDER)[number]) ? theme : 'system') as (typeof ORDER)[number];
  const next = ORDER[(ORDER.indexOf(cur) + 1) % ORDER.length];
  return (
    <button type="button" className="btn-alt" onClick={() => setTheme(next)} aria-label={`Tema ${NAME[cur]}. Clique para mudar.`}>
      {mounted ? LABEL[cur] : '◐'}
    </button>
  );
}
