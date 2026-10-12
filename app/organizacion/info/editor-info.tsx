'use client';
import type { Perdido } from '@/lib/db';
import { DIAS } from '@/lib/convencion';
import { agregarPerdido, editar, entregarPerdido, guardarWifi } from '../acciones';
import { Campo, correr } from '../campo';

function ahoraTexto() {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Mendoza' }).format(new Date());
  const h = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Mendoza', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
  return `${DIAS.find((d) => d.fecha === f)?.nombre ?? f.split('-').reverse().slice(0, 2).join('/')} ${h}`;
}

export function EditorInfo({ red, clave, perdidos }: { red: string; clave: string; perdidos: Perdido[] }) {
  return (
    <>
      <div className="grid2" style={{ maxWidth: 760 }}>
        <div className="field"><label htmlFor="red">Red de Wi‑Fi</label><Campo id="red" valor={red} guardar={(v) => guardarWifi('wifi_red', v)} /></div>
        <div className="field"><label htmlFor="clave">Clave</label><Campo id="clave" valor={clave} guardar={(v) => guardarWifi('wifi_clave', v)} /></div>
      </div>
      <div className="edit-meal" style={{ maxWidth: 980 }}>
        <h3>Objetos perdidos</h3>
        <button className="btn" style={{ justifySelf: 'start' }} onClick={() => correr(() => agregarPerdido(ahoraTexto()), 'Cargado: escribí qué es y dónde estaba')}>
          + Cargar objeto encontrado
        </button>
        {perdidos.map((p) => (
          <div className="card" key={p.id}>
            <div className="row">
              <Campo className="tipo" aria-label="Cuándo" valor={p.cuando} guardar={(v) => editar('perdidos', p.id, 'cuando', v)} />
              <Campo className="val" aria-label="Qué se encontró" placeholder="Qué se encontró" valor={p.que} guardar={(v) => editar('perdidos', p.id, 'que', v)} />
              <button className="mini" onClick={() => correr(() => entregarPerdido(p.id), 'Marcado como entregado')}>Entregado</button>
            </div>
            <Campo className="input" aria-label="Dónde se encontró" placeholder="Dónde se encontró" valor={p.donde} guardar={(v) => editar('perdidos', p.id, 'donde', v)} />
          </div>
        ))}
        <p className="note">“Entregado” lo saca de la lista que ven los asistentes.</p>
      </div>
    </>
  );
}
