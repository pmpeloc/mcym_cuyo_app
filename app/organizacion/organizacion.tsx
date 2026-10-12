import type { Enlace } from '../cliente';
import { Pantalla } from '../pantalla';

const LINKS: Enlace[] = [
  ['/organizacion', 'Menú'],
  ['/organizacion/confirmaciones', 'Confirmaciones'],
  ['/organizacion/info', 'Wi‑Fi y objetos perdidos', 'Wi‑Fi y objetos'],
  ['/organizacion/bienvenidas', 'Bienvenidas'],
];

type P = { titulo: string; tituloMovil?: string; lbl?: string; derecha?: React.ReactNode; volver?: string; eyebrow?: string; children: React.ReactNode };

export function Organizacion({ eyebrow = 'Organización', ...p }: P) {
  return <Pantalla links={LINKS} marca="Organización" pie="Solo cocina y organizadores" eyebrow={eyebrow} chico {...p} />;
}
