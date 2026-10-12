// Estructura común de todas las pantallas (lienzo de desarrollo):
// celular = cabecera con sello + franja + píldoras; escritorio = menú lateral marino + título grande.
// Sin hooks: sirve tanto en páginas del servidor como dentro de componentes de cliente.
import Link from 'next/link';
import { iniciales } from '@/lib/convencion';
import type { Pastor } from '@/lib/db';
import { Nav, type Enlace } from './cliente';

type Props = {
  links: Enlace[];
  marca: string;          // menú lateral
  pie: string;            // menú lateral, abajo
  eyebrow: string;        // celular, arriba del título
  franja?: boolean;       // celular: franja celeste "Movimiento Cristiano y Misionero"
  chico?: boolean;        // celular: cabecera compacta (panel)
  titulo: string;
  tituloMovil?: string;
  sub?: string;           // celular, debajo del título
  lbl?: string;           // escritorio, arriba del título
  derecha?: React.ReactNode;
  volver?: string;        // link "← Volver a la lista"; en celular oculta las píldoras
  children: React.ReactNode;
};

export function Pantalla(p: Props) {
  return (
    <div className="shell">
      <aside className="side">
        <div className="side-brand"><img src="/sello.png" alt="Convención Cuyo" /><b>{p.marca}</b></div>
        <nav><Nav links={p.links} /></nav>
        <p className="side-foot">{p.pie}</p>
      </aside>
      <div>
        <div className="movil">
          <header className={`hero${p.chico ? ' chico' : ''}`}>
            <img src="/sello.png" alt="Convención Cuyo" />
            <div>
              <span className="eyebrow">{p.eyebrow}</span>
              <h2>{p.tituloMovil ?? p.titulo}</h2>
              {p.sub && <div className="date">{p.sub}</div>}
            </div>
          </header>
          {p.franja && <div className="franja">Movimiento Cristiano y Misionero</div>}
          {p.volver
            ? <div className="pnav"><Link className="pill" href={p.volver}>← Volver a la lista</Link></div>
            : <nav className="pnav"><Nav links={p.links} pill /></nav>}
        </div>
        <main className="main">
          <div className="main-head">
            <div>
              {p.volver && <Link className="note volver" href={p.volver}>← Volver a la lista</Link>}
              {p.lbl && <span className="lbl">{p.lbl}</span>}
              <h1>{p.titulo}</h1>
            </div>
            {p.derecha}
          </div>
          {p.children}
        </main>
      </div>
    </div>
  );
}

export function FotoPastor({ p, clase = 'foto' }: { p: Pick<Pastor, 'nombres' | 'foto_url'>; clase?: string }) {
  return (
    <div className={clase}>{p.foto_url ? <img src={p.foto_url} alt={`Foto de ${p.nombres}`} /> : iniciales(p.nombres)}</div>
  );
}

export function TarjetaPastor({ p }: { p: Pick<Pastor, 'nombres' | 'iglesia' | 'mensaje' | 'foto_url'> }) {
  return (
    <article className="card">
      <div className="pastor-h">
        <FotoPastor p={p} />
        <div><b>Pastores {p.nombres.trim() || '[nombres]'}</b><span>{p.iglesia}</span></div>
      </div>
      <p>{p.mensaje}</p>
    </article>
  );
}

export const Candado = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const Camara = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" />
  </svg>
);
