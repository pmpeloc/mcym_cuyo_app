import { COMIDAS, DIAS, abierta } from '@/lib/convencion';
import { db, ok } from '@/lib/db';
import { Refrescar } from '../../componentes';

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
  return (
    <>
      <Refrescar />
      <h2>Confirmaciones de comida</h2>
      <p className="note">Cada día se cierra el día anterior a las 20:00. Desde ahí el número queda fijo para organizar el comedor.</p>
      <div className="card conteo">
        <table>
          <thead><tr><th>Día</th><th>Comida</th><th>Van</th><th>No van</th><th>Estado</th></tr></thead>
          <tbody>
            {DIAS.flatMap((d) => COMIDAS.filter((c) => c.dia === d.id).map((c, i) => {
              const van = filas.filter((f) => f.comida === c.id && f.va);
              const no = filas.filter((f) => f.comida === c.id && !f.va).length;
              const ab = abierta(d.id);
              return (
                <tr key={c.id}>
                  {i === 0 && <th rowSpan={2} scope="row">{d.nombre} {d.texto.split(' ')[0]}</th>}
                  <td>
                    {c.nombre}
                    {van.length > 0 && (
                      <details><summary>Ver nombres</summary><ol>{van.map((f, k) => <li key={k}>{f.nombre}</li>)}</ol></details>
                    )}
                  </td>
                  <td className="n">{van.length}</td>
                  <td>{no}</td>
                  <td><span className={`estado ${ab ? 'abierta' : 'cerrada'}`}>{ab ? 'Abierta' : 'Cerrada'}</span></td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
      <p className="note">Cada celular cuenta como una persona. Si alguien confirmó desde dos celulares, aparece dos veces en la lista de nombres.</p>
    </>
  );
}
