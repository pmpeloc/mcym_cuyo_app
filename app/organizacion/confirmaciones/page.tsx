import { COMIDAS, DIAS } from '@/lib/convencion';
import { db, ok } from '@/lib/db';
import { Refrescar } from '../../cliente';
import { Organizacion } from '../organizacion';

type Conf = { comida: string; va: boolean; nombre: string; personas: number };

export default async function Confirmaciones() {
  // Supabase devuelve hasta 1000 filas por consulta; ~200 celulares × 8 comidas = 1600, así que se pide en tandas.
  const s = db();
  const filas: Conf[] = [];
  for (let desde = 0; ; desde += 1000) {
    const r = ok(await s.from('confirmaciones').select('comida, va, nombre, personas').order('nombre').range(desde, desde + 999)) as Conf[];
    filas.push(...r);
    if (r.length < 1000) break;
  }
  // Se cuentan personas, no celulares: una familia que confirma por 5 suma 5.
  const suma = (l: Conf[]) => l.reduce((t, f) => t + f.personas, 0);
  const van = (c: string) => filas.filter((f) => f.comida === c && f.va);
  const noVan = (c: string) => suma(filas.filter((f) => f.comida === c && !f.va));
  const Nombres = ({ c, boton }: { c: string; boton?: boolean }) => {
    const l = van(c);
    return l.length > 0 && (
      <details className="nombres">
        <summary className={boton ? 'mini' : ''}>Ver nombres</summary>
        <ol>{l.map((f, k) => <li key={k}>{f.nombre}{f.personas > 1 && <b> · {f.personas} personas</b>}</li>)}</ol>
      </details>
    );
  };

  return (
    <Organizacion titulo="Confirmaciones de comida" tituloMovil="Confirmaciones">
      <Refrescar />
      <div className="card escritorio" style={{ padding: '8px 20px' }}>
        <table className="tabla">
          <thead><tr><th>Día</th><th>Comida</th><th>Van</th><th>No van</th><th /></tr></thead>
          <tbody>
            {DIAS.flatMap((d) => COMIDAS.filter((c) => c.dia === d.id).map((c, i) => (
              <tr key={c.id}>
                {i === 0 && <th scope="row" rowSpan={2}>{d.nombre} {d.texto.split(' ')[0]}</th>}
                <td>{c.nombre}</td>
                <td className="n">{suma(van(c.id))}</td>
                <td>{noVan(c.id)}</td>
                <td><Nombres c={c.id} boton /></td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      <div className="stack movil">
        {DIAS.map((d) => (
          <div className="card" key={d.id}>
            <div className="entre"><span className="lbl">{d.nombre} {d.texto.split(' ')[0]}</span></div>
            <div className="cols2" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              {COMIDAS.filter((c) => c.dia === d.id).map((c) => (
                <div key={c.id}><span className="note">{c.nombre}</span><div className="numero">{suma(van(c.id))}</div><Nombres c={c.id} /></div>
              ))}
            </div>
          </div>
        ))}
        <p className="note">Los números cuentan personas: una familia que confirma por 5 suma 5.</p>
      </div>
      <p className="note escritorio">Los números cuentan personas: una familia que confirma por 5 suma 5. No hay cierre, así que pueden cambiar hasta último momento. Si un nombre aparece dos veces, es la misma persona confirmando desde dos celulares.</p>
    </Organizacion>
  );
}
