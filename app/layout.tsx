import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { League_Spartan } from 'next/font/google';
import './globals.css';

const display = localFont({ src: './TanMeringue.woff2', variable: '--font-display', display: 'swap' });
const sans = League_Spartan({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sans' });

// Todo se lee de la base en cada visita (el menú cambia en el día).
export const dynamic = 'force-dynamic';

const DESCRIPCION = 'Menú del día, confirmación de almuerzos y cenas, bienvenida de los pastores, Wi‑Fi y avisos. 12 al 15 de noviembre de 2026, Godoy Cruz, Mendoza.';
const DOMINIO = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(DOMINIO ? `https://${DOMINIO}` : 'http://localhost:3000'),
  title: { default: 'Convención Regional Cuyo 2026', template: '%s · Convención Cuyo 2026' },
  description: DESCRIPCION,
  applicationName: 'Convención Cuyo 2026',
  icons: { icon: '/sello.png', apple: '/sello.png' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Convención Regional Cuyo 2026',
    title: 'Convención Regional Cuyo 2026 · Creciendo en su Gracia',
    description: DESCRIPCION,
  },
  twitter: { card: 'summary_large_image', title: 'Convención Regional Cuyo 2026 · Creciendo en su Gracia', description: DESCRIPCION },
};
export const viewport: Viewport = { themeColor: '#083d6b', colorScheme: 'light' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
