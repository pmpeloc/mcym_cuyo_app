import { COMIDAS, DIAS, hoy, hora } from '@/lib/convencion';
import { db, ok, type MenuItem } from '@/lib/db';
import { Refrescar } from '../cliente';
import { Asistente } from './asistente';

export const metadata = { title: 'Menú de hoy' };

export default async function MenuDeHoy() {
  const h = hoy();
  const dia = DIAS.find((d) => d.id === h);
  if (!dia) {
    const antes = h === 'antes';
    return (
      <Asistente titulo="Menú del día">
        <div className="empty-state">
          <h2>{antes ? 'Todavía no empezó' : '¡Gracias por venir!'}</h2>
          <p className="note">{antes ? 'El jueves 12 de noviembre vas a ver acá el menú de ese día.' : 'La convención terminó. ¡Nos vemos el año que viene!'}</p>
          {antes && <p className="note">Mientras tanto, ya podés confirmar si venís a comer.</p>}
        </div>
      </Asistente>
    );
  }

  const comidas = COMIDAS.filter((c) => c.dia === dia.id);
  const s = db();
  const [items, info] = await Promise.all([
    s.from('menu_items').select('*').in('comida', comidas.map((c) => c.id)).order('orden').then(ok<MenuItem[]>),
    s.from('dias').select('aviso, actualizado').eq('id', dia.id).maybeSingle().then(ok<{ aviso: string; actualizado: string | null } | null>),
  ]);
  const actualizado = info?.actualizado ? `Actualizado hoy a las ${hora(info.actualizado)} h` : '';
  const fecha = `${dia.nombre} ${dia.texto}`;

  return (
    <Asistente titulo="Menú de hoy" sub={fecha} lbl={fecha} derecha={actualizado && <span className="note">{actualizado}</span>}>
      <Refrescar />
      {info?.aviso.trim() && <div className="aviso" role="status"><b>Aviso</b>{info.aviso}</div>}
      <div className="menu-dia">
        {comidas.map((c) => (
          <section className="comida" key={c.id}>
            <h3>{c.nombre} <span>{c.hora} h</span></h3>
            <ul className="items">
              {/* Pedido de la organización: el asistente ve el menú vigente, sin marcar qué cambió. */}
              {items.filter((i) => i.comida === c.id && !i.quitado && i.valor.trim()).map((i) => (
                <li key={i.id}><span className="k">{i.tipo}</span><span className="v">{i.valor}</span></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {actualizado && <p className="foot movil">{actualizado}</p>}
    </Asistente>
  );
}
