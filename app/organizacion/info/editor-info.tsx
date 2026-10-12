'use client';
import type { Perdido } from '@/lib/db';
import { DIAS } from '@/lib/convencion';
import { agregarPerdido, editar, entregarPerdido, guardarWifi } from '../acciones';
import { Campo, correr } from '../campo';

function ahoraTexto() {
  const tz = 'America/Argentina/Mendoza', ahora = new Date();
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(ahora);
  const h = new Intl.DateTimeFormat('es-AR', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(ahora);
  return `${DIAS.find((d) => d.fecha === f)?.nombre ?? f.split('-').reverse().slice(0, 2).join('/')} ${h}`;
}

export function EditorInfo({ red, clave, perdidos }: { red: string; clave: string; perdidos: Perdido[] }) {
  const cargar = () => correr(() => agregarPerdido(ahoraTexto()), 'Cargado: escribí qué es y dónde estaba');
  return (
    <>
      <div className="cols2" style={{ maxWidth: 760 }}>
        <div className="field"><label htmlFor="red">Red de Wi‑Fi</label><Campo id="red" valor={red} guardar={(v) => guardarWifi('wifi_red', v)} /></div>
        <div className="field"><label htmlFor="clave">Clave</label><Campo id="clave" valor={clave} guardar={(v) => guardarWifi('wifi_clave', v)} /></div>
      </div>
      <div className="edit-meal" style={{ maxWidth: 980 }}>
        <h3>Objetos perdidos</h3>
        <button className="btn movil" type="button" onClick={cargar}>+ Cargar objeto encontrado</button>
        {perdidos.map((p) => (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="row">
              <Campo className="tipo" aria-label="Cuándo" valor={p.cuando} guardar={(v) => editar('perdidos', p.id, 'cuando', v)} />
              <Campo className="val" aria-label="Qué se encontró" placeholder="Qué se encontró" valor={p.que} guardar={(v) => editar('perdidos', p.id, 'que', v)} />
              <button className="mini" type="button" onClick={() => correr(() => entregarPerdido(p.id), 'Marcado como entregado')}>Entregado</button>
            </div>
            <Campo className="donde" aria-label="Dónde se encontró" placeholder="Dónde se encontró" valor={p.donde} guardar={(v) => editar('perdidos', p.id, 'donde', v)} />
          </div>
        ))}
        {!perdidos.length && <p className="note">No hay objetos cargados.</p>}
        <button className="add escritorio" type="button" onClick={cargar}>+ Cargar objeto encontrado</button>
        <p className="note">“Entregado” lo saca de la lista que ven los asistentes.</p>
      </div>
    </>
  );
}
