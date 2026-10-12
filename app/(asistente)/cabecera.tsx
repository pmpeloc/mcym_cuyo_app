import { Nav } from '../componentes';

const LINKS: [string, string][] = [
  ['/', 'Menú de hoy'],
  ['/comidas', 'Confirmar comidas'],
  ['/bienvenida', 'Bienvenida'],
  ['/info', 'Wi‑Fi y avisos'],
  ['/apuntes', 'Mis apuntes'],
];

export function Cabecera({ titulo, sub }: { titulo: string; sub?: string }) {
  return (
    <>
      <header className="hero">
        <img src="/sello.png" alt="Convención Cuyo" />
        <div>
          <small>Convención Regional Cuyo · 2026</small>
          <h1>{titulo}</h1>
          {sub && <div>{sub}</div>}
        </div>
      </header>
      <div className="franja">Movimiento Cristiano y Misionero</div>
      <Nav links={LINKS} />
    </>
  );
}
