import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/figtree';
import './globals.css';

export const metadata: Metadata = {
  title: 'CalendaTida',
  description: 'Calendário anual, peso semanal e IMC para acompanhar o seu tratamento.',
};
export const viewport: Viewport = { themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#081216' }, { media: '(prefers-color-scheme: light)', color: '#eef3f4' }] };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
