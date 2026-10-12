import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { League_Spartan } from 'next/font/google';
import './globals.css';

const display = localFont({ src: './TanMeringue.woff2', variable: '--font-display', display: 'swap' });
const sans = League_Spartan({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });

// Todo se lee de la base en cada visita (el menú cambia en el día).
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Convención Regional Cuyo 2026',
  description: 'Menú del día, comidas, bienvenida y avisos. 12 al 15 de noviembre, Godoy Cruz, Mendoza.',
  icons: { icon: '/sello.png' },
};
export const viewport: Viewport = { themeColor: '#083d6b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
