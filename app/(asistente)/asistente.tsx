import type { Enlace } from '../cliente';
import { Pantalla } from '../pantalla';

const LINKS: Enlace[] = [
  ['/', 'Menú de hoy'],
  ['/comidas', 'Confirmar comidas'],
  ['/bienvenida', 'Bienvenida'],
  ['/info', 'Wi‑Fi y avisos'],
  ['/apuntes', 'Mis apuntes'],
];

type P = { titulo: string; sub?: string; lbl?: string; derecha?: React.ReactNode; children: React.ReactNode };

export function Asistente(p: P) {
  return (
    <Pantalla links={LINKS} marca="Convención Regional Cuyo" pie="Movimiento Cristiano y Misionero"
      eyebrow="Convención Regional Cuyo · 2026" franja {...p} />
  );
}
