import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, ok, type Pastor } from '@/lib/db';
import { FotoPastor } from '../../pantalla';
import { Organizacion } from '../organizacion';
import { Formulario } from './formulario';
import { Orden } from './orden';

const URL = '/organizacion/bienvenidas';

function estado(p: Pastor): [string, string] {
  if (!p.mensaje.trim()) return ['falta', 'Falta mensaje'];
  return p.foto_url ? ['abierta', 'Publicado'] : ['falta', 'Falta foto'];
}

export default async function Bienvenidas({ searchParams }: { searchParams: Promise<{ editar?: string }> }) {
  const { editar } = await searchParams;
  const pastores = ok(await db().from('pastores').select('*').order('orden')) as Pastor[];

  // B / C — Editar o cargar un matrimonio
  if (editar) {
    const p = editar === 'nuevo' ? null : pastores.find((x) => x.id === editar);
    if (p === undefined) notFound();
    return (
      <Organizacion titulo={p?.nombres || 'Nuevo matrimonio'} volver={URL} eyebrow="Organización · Bienvenidas">
        <div className="stack"><Formulario p={p} /></div>
      </Organizacion>
    );
  }

  // A — Lista
  const completos = pastores.filter((p) => estado(p)[0] === 'abierta').length;
  const cuenta = `${completos} de ${pastores.length} completos`;
  return (
    <Organizacion titulo="Bienvenidas de los pastores" tituloMovil="Bienvenidas" lbl={cuenta}
      derecha={<Link className="btn" href={`${URL}?editar=nuevo`}>+ Agregar matrimonio</Link>}>
      <div className="card escritorio" style={{ padding: '4px 20px' }}>
        <table className="tabla">
          <thead><tr><th style={{ width: 70 }}>Foto</th><th>Matrimonio</th><th>Mensaje</th><th>Estado</th><th style={{ width: 210 }} /></tr></thead>
          <tbody>
            {pastores.map((p, i) => {
              const [cls, txt] = estado(p);
              return (
                <tr key={p.id}>
                  <td><FotoPastor p={p} clase={`foto${p.foto_url ? '' : ' vacia'}`} /></td>
                  <td><b>{p.nombres}</b><br /><span className="note">{p.iglesia}</span></td>
                  <td className="note" style={p.mensaje ? undefined : { fontStyle: 'italic' }}>{p.mensaje ? recortar(p.mensaje, 70) : 'Sin mensaje todavía'}</td>
                  <td><span className={`estado ${cls}`}>{txt}</span></td>
                  <td>
                    <div className="wrapgap" style={{ gap: 6 }}>
                      <Orden id={p.id} primero={i === 0} ultimo={i === pastores.length - 1} />
                      <Link className="mini" href={`${URL}?editar=${p.id}`}>Editar</Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="stack movil">
        <div className="entre"><span className="lbl">{cuenta}</span><Link className="mini" href={`${URL}?editar=nuevo`}>+ Agregar</Link></div>
        {pastores.map((p) => {
          const [cls, txt] = estado(p);
          return (
            <Link key={p.id} className="card b-fila" href={`${URL}?editar=${p.id}`} style={{ flexDirection: 'row' }}>
              <FotoPastor p={p} clase={`foto${p.foto_url ? '' : ' vacia'}`} />
              <div style={{ flex: 1, minWidth: 0 }}><b>{p.nombres}</b><br /><span className="note">{p.iglesia}</span></div>
              <span className={`estado ${cls}`}>{txt}</span>
            </Link>
          );
        })}
      </div>
      <p className="note" style={{ padding: '0 16px' }}>
        Los que tienen “Falta foto” se publican igual con las iniciales. Los que tienen “Falta mensaje” no se muestran al asistente hasta completarlos.
      </p>
    </Organizacion>
  );
}

const recortar = (t: string, n: number) => (t.length > n ? t.slice(0, Math.max(t.lastIndexOf(' ', n), n / 2)) + '…' : t);
