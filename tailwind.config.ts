import type { Config } from 'tailwindcss';

const v = (n: string) => `var(--${n})`;
export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { bg: v('bg'), card: v('card'), ink: v('ink'), mut: v('mut'), line: v('line'), plan: v('plan'), ok: v('ok'), okfg: v('okfg'), warn: v('warn') },
      fontFamily: {
        display: ['Bricolage Grotesque Variable', 'system-ui', 'sans-serif'],
        body: ['Figtree Variable', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config;
