'use client';
import { useEffect, useState } from 'react';
import { toast } from '../../componentes';
import { confirmar, misConfirmaciones } from '../acciones';

type Dia = { id: string; titulo: string; abierto: boolean; comidas: { id: string; nombre: string; hora: string }[] };

// Sin login: cada celular se identifica con un id al azar guardado en el navegador.
function leer(k: string) { try { return localStorage.getItem(k) } catch { return null } }
function guardar(k: string, v: string) { try { localStorage.setItem(k, v) } catch {} }
function dispositivo() {
  let id = leer('cc-dispositivo');
  if (!id) { id = crypto.randomUUID(); guardar('cc-dispositivo', id) }
  return id;
}

export function Confirmar({ dias }: { dias: Dia[] }) {
  const [nombre, setNombre] = useState('');
  const [resp, setResp] = useState<Record<string, boolean>>({});
  const [enviando, setEnviando] = useState('');

  useEffect(() => {
    setNombre(leer('cc-nombre') || '');
    misConfirmaciones(dispositivo()).then((r) => setResp(Object.fromEntries(r.map((x) => [x.comida, x.va]))), () => {});
  }, []);

  async function elegir(comida: string, va: boolean) {
    if (!nombre.trim()) { toast('Escribí tu nombre e iglesia antes de confirmar'); document.getElementById('nombre')?.focus(); return }
    setEnviando(comida);
    try {
      const r = await confirmar(dispositivo(), nombre, comida, va);
      if ('error' in r) toast(r.error === 'Ese día ya cerró' ? 'Ese día ya cerró. Avisá en recepción.' : 'No se pudo guardar. Probá de nuevo.');
      else { setResp((p) => ({ ...p, [comida]: va })); toast(va ? 'Confirmado. ¡Te esperamos!' : 'Listo, avisamos a cocina que no venís') }
    } catch { toast('Sin conexión. Probá de nuevo en un rato.') }
    setEnviando('');
  }

  return (
    <div className="stack">
      <div className="field">
        <label htmlFor="nombre">Tu nombre e iglesia</label>
        <input id="nombre" autoComplete="name" maxLength={80} placeholder="Ej.: Juan Pérez · Iglesia de Maipú" value={nombre}
          onChange={(e) => { setNombre(e.target.value); guardar('cc-nombre', e.target.value) }} />
        <small className="note">Solo lo ve el equipo de cocina, para saber cuántos platos preparar.</small>
      </div>
      {dias.map((d) => (
        <div className="card" key={d.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
            <span className="lbl">{d.titulo}</span>{!d.abierto && <span className="cerrado">Cerrado</span>}
          </div>
          {d.comidas.map((c) => (
            <div className="meal-row" key={c.id}>
              <div>{c.nombre}<small>{c.hora} h</small></div>
              <span className="sino" role="group" aria-label={`${c.nombre} del ${d.titulo}`}>
                {([true, false] as const).map((va) => (
                  <button key={String(va)} className={va ? 'si' : 'no'} aria-pressed={resp[c.id] === va}
                    disabled={!d.abierto || enviando === c.id} onClick={() => elegir(c.id, va)}>
                    {va ? 'Voy' : 'No voy'}
                  </button>
                ))}
              </span>
            </div>
          ))}
        </div>
      ))}
      <p className="note">Si cambiás de idea, podés modificar tu respuesta mientras el día siga abierto.</p>
    </div>
  );
}
