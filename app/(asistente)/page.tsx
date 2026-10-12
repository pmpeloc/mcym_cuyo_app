import { COMIDAS, DIAS, hoy, hora } from '@/lib/convencion';
import { db, ok, type MenuItem } from '@/lib/db';
import { Refrescar } from '../componentes';
import { Cabecera } from './cabecera';

export default async function MenuDeHoy() {
  const h = hoy();
  const dia = DIAS.find((d) => d.id === h);
  if (!dia) {
    const antes = h === 'antes';
    return (
      <>
        <Cabecera titulo="Menú del día" />
        <div className="empty">
          <h2>{antes ? 'Todavía no empezó' : '¡Gracias por venir!'}</h2>
          <p>{antes ? 'El jueves 12 de noviembre vas a ver acá el menú de ese día.' : 'La convención terminó. ¡Nos vemos el año que viene!'}</p>
        </div>
      </>
    );
  }

  const comidas = COMIDAS.filter((c) => c.dia === dia.id);
  const s = db();
  const [items, info] = await Promise.all([
    s.from('menu_items').select('*').in('comida', comidas.map((c) => c.id)).order('orden').then(ok<MenuItem[]>),
    s.from('dias').select('aviso, actualizado').eq('id', dia.id).maybeSingle().then(ok<{ aviso: string; actualizado: string | null } | null>),
  ]);

  return (
    <>
      <Refrescar />
      <Cabecera titulo="Menú de hoy" sub={`${dia.nombre} ${dia.texto}`} />
      {info?.aviso.trim() && <div className="aviso" role="status"><b>Aviso</b>{info.aviso}</div>}
      {comidas.map((c) => (
        <section className="sec" key={c.id}>
          <h2>{c.nombre} <span>{c.hora} h</span></h2>
          <ul className="items">
            {items.filter((i) => i.comida === c.id && (i.quitado || i.valor.trim())).map((i) => {
              if (i.quitado)
                return <li key={i.id} className="off"><span className="k">{i.tipo}<span className="chip off">Hoy no hay</span></span><span className="v">{i.original ?? i.valor}</span></li>;
              const nuevo = i.original === null, cambio = !nuevo && i.valor !== i.original;
              return (
                <li key={i.id}>
                  <span className="k">{i.tipo}{nuevo ? <span className="chip nuevo">Nuevo</span> : cambio && <span className="chip cambio">Cambió</span>}</span>
                  <span className="v">{i.valor}</span>
                  {cambio && <span className="was">Antes: <s>{i.original}</s></span>}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <div className="foot">{info?.actualizado ? `Actualizado hoy a las ${hora(info.actualizado)} h` : 'Menú publicado por el equipo de cocina'}</div>
    </>
  );
}
