import { COMIDAS, DIAS, abierta, textoCierre } from '@/lib/convencion';
import { db, ok } from '@/lib/db';
import { Refrescar } from '../../cliente';
import { Organizacion } from '../organizacion';

type Conf = { comida: string; va: boolean; nombre: string };

export default async function Confirmaciones() {
  // Supabase devuelve hasta 1000 filas por consulta; ~200 personas × 8 comidas = 1600, así que se pide en tandas.
  const s = db();
  const filas: Conf[] = [];
  for (let desde = 0; ; desde += 1000) {
    const r = ok(await s.from('confirmaciones').select('comida, va, nombre').order('nombre').range(desde, desde + 999)) as Conf[];
    filas.push(...r);
    if (r.length < 1000) break;
  }
  const van = (c: string) => filas.filter((f) => f.comida === c && f.va);
  const noVan = (c: string) => filas.filter((f) => f.comida === c && !f.va).length;
  const Estado = ({ dia }: { dia: (typeof DIAS)[number]['id'] }) =>
    abierta(dia) ? <span className="estado abierta">Abierta</span> : <span className="estado cerrada">Cerrada</span>;
  const Nombres = ({ c, boton }: { c: string; boton?: boolean }) => {
    const l = van(c);
    return l.length > 0 && (
      <details className="nombres">
        <summary className={boton ? 'mini' : ''}>Ver nombres</summary>
        <ol>{l.map((f, k) => <li key={k}>{f.nombre}</li>)}</ol>
      </details>
    );
  };

  return (
    <Organizacion titulo="Confirmaciones de comida" tituloMovil="Confirmaciones" derecha={<span className="note">{textoCierre()}</span>}>
      <Refrescar />
      <div className="card escritorio" style={{ padding: '8px 20px' }}>
        <table className="tabla">
          <thead><tr><th>Día</th><th>Comida</th><th>Van</th><th>No van</th><th>Estado</th><th /></tr></thead>
          <tbody>
            {DIAS.flatMap((d) => COMIDAS.filter((c) => c.dia === d.id).map((c, i) => (
              <tr key={c.id}>
                {i === 0 && <th scope="row" rowSpan={2}>{d.nombre} {d.texto.split(' ')[0]}</th>}
                <td>{c.nombre}</td>
                <td className="n">{van(c.id).length}</td>
                <td>{noVan(c.id)}</td>
                <td><Estado dia={d.id} /></td>
                <td><Nombres c={c.id} boton /></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <div className="stack movil">
        {DIAS.map((d) => (
          <div className="card" key={d.id}>
            <div className="entre"><span className="lbl">{d.nombre} {d.texto.split(' ')[0]}</span><Estado dia={d.id} /></div>
            <div className="cols2" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              {COMIDAS.filter((c) => c.dia === d.id).map((c) => (
                <div key={c.id}><span className="note">{c.nombre}</span><div className="numero">{van(c.id).length}</div><Nombres c={c.id} /></div>
              ))}
            </div>
          </div>
        ))}
        <p className="note">Cierra el día anterior a las 20:00.</p>
      </div>
      <p className="note escritorio">Cada día cierra a las 20:00 del día anterior y desde ahí el número queda fijo. Si un nombre aparece dos veces, es la misma persona confirmando desde dos celulares.</p>
    </Organizacion>
  );
}
