// Imagen de vista previa al compartir el link (WhatsApp, Facebook, etc.). Se genera en el build.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Convención Regional Cuyo 2026 · Creciendo en su Gracia · 12 al 15 de noviembre, Godoy Cruz, Mendoza';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MARINO = '#083d6b', CREMA = '#f4e7d1', CELESTE = '#b3defa';

export default async function Imagen() {
  const [tan, ls500, ls700, sello] = await Promise.all([
    readFile(join(process.cwd(), 'app/og/TanMeringue.otf')),
    readFile(join(process.cwd(), 'app/og/LeagueSpartan-500.ttf')),
    readFile(join(process.cwd(), 'app/og/LeagueSpartan-700.ttf')),
    readFile(join(process.cwd(), 'public/sello.png')),
  ]);
  const items = ['Menú del día', 'Confirmá almuerzo y cena', 'Bienvenida de los pastores', 'Wi‑Fi y objetos perdidos'];

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: MARINO, fontFamily: 'League Spartan' }}>
        <div style={{ flex: 1, display: 'flex', padding: '56px 64px 40px', gap: 56 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: CREMA }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <img src={`data:image/png;base64,${sello.toString('base64')}`} width={120} height={120} style={{ objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: 22, fontWeight: 700, letterSpacing: 3, color: CELESTE, textTransform: 'uppercase' }}>
                <span>12 al 15 de noviembre</span>
                <span style={{ color: CREMA, fontWeight: 500, letterSpacing: 1, textTransform: 'none', fontSize: 26, marginTop: 4 }}>Godoy Cruz, Mendoza</span>
              </div>
            </div>
            <div style={{ fontFamily: 'Tan Meringue', fontSize: 78, lineHeight: 1.02, marginTop: 34 }}>Convención Regional Cuyo 2026</div>
            <div style={{ fontSize: 32, marginTop: 22, color: CELESTE }}>Creciendo en su Gracia · 2 Pedro 3:18</div>
          </div>
          <div style={{ width: 380, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, color: CELESTE, textTransform: 'uppercase', marginBottom: 4 }}>En esta app</div>
            {items.map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, background: CREMA, color: MARINO, borderRadius: 14, padding: '16px 20px', fontSize: 28, fontWeight: 700 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: MARINO }} />
                {t}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', background: CELESTE, color: MARINO, fontSize: 20, fontWeight: 700, letterSpacing: 5, padding: '12px 64px', textTransform: 'uppercase' }}>
          Movimiento Cristiano y Misionero
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Tan Meringue', data: tan, weight: 400 },
        { name: 'League Spartan', data: ls500, weight: 500 },
        { name: 'League Spartan', data: ls700, weight: 700 },
      ],
    },
  );
}
