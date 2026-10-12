'use client';
import type { MenuItem } from '@/lib/db';
import { agregarItem, editar, guardarAviso, quitarItem, volverItem } from './acciones';
import { Campo, correr } from './campo';

type Props = { dia: string; aviso: string; comidas: { id: string; nombre: string; hora: string }[]; items: MenuItem[] };

export function EditorMenu({ dia, aviso, comidas, items }: Props) {
  return (
    <>
      <div className="field">
        <label htmlFor="aviso">Aviso del día (opcional)</label>
        <Campo id="aviso" multilinea valor={aviso} guardar={(v) => guardarAviso(dia, v)} placeholder="Ej.: El almuerzo se sirve a las 13:30 en el salón B" />
      </div>
      <div className="cols2">
        {comidas.map((c) => (
          <div className="edit-meal" key={c.id}>
            <h3>{c.nombre} · {c.hora} h</h3>
            {items.filter((i) => i.comida === c.id).map((i) => {
              const nuevo = i.original === null, cambio = !nuevo && !i.quitado && i.valor !== i.original;
              return (
                <div key={i.id} className={`row${cambio ? ' changed' : ''}${i.quitado ? ' off' : ''}`}>
                  <Campo className="tipo" aria-label="Tipo" valor={i.tipo} disabled={i.quitado} guardar={(v) => editar('menu_items', i.id, 'tipo', v)} />
                  <Campo className="val" aria-label={i.tipo || 'Plato'} valor={i.quitado ? i.original ?? '' : i.valor} disabled={i.quitado}
                    guardar={(v) => editar('menu_items', i.id, 'valor', v)} />
                  {cambio || i.quitado
                    ? <button className="mini" onClick={() => correr(() => volverItem(i.id), 'Volvió al menú original')}>Volver al original</button>
                    : <button className="mini" onClick={() => correr(() => quitarItem(i.id), nuevo ? 'Borrado' : 'Marcado como "Hoy no hay"')}>{nuevo ? 'Borrar' : 'Quitar hoy'}</button>}
                </div>
              );
            })}
            <button className="add" onClick={() => correr(() => agregarItem(c.id), 'Agregado: escribí qué es')}>+ Agregar algo</button>
          </div>
        ))}
      </div>
    </>
  );
}
