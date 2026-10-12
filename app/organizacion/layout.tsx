import type { Metadata } from 'next';
import { Nav, Toast } from '../componentes';

export const metadata: Metadata = { title: 'Organización · Convención Cuyo 2026', robots: { index: false, follow: false } };

const LINKS: [string, string][] = [
  ['/organizacion', 'Menú'],
  ['/organizacion/confirmaciones', 'Confirmaciones'],
  ['/organizacion/info', 'Wi‑Fi y objetos perdidos'],
  ['/organizacion/bienvenidas', 'Bienvenidas'],
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel">
      <header className="hero">
        <img src="/sello.png" alt="Convención Cuyo" style={{ width: 48 }} />
        <div><small>Organización</small><h1 style={{ fontSize: '1.6rem' }}>Convención Cuyo 2026</h1></div>
      </header>
      <Nav links={LINKS} />
      <main>{children}</main>
      <Toast />
    </div>
  );
}
