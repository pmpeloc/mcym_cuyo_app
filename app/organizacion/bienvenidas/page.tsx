import { db, ok, type Pastor } from '@/lib/db';
import { EditorBienvenidas } from './editor-bienvenidas';

export default async function Bienvenidas() {
  const pastores = ok(await db().from('pastores').select('*').order('orden')) as Pastor[];
  const completos = pastores.filter((p) => p.nombres.trim() && p.mensaje.trim() && p.foto_url).length;
  return (
    <>
      <div className="acts">
        <h2>Bienvenidas de los pastores</h2>
        <span className="note">{completos} de {pastores.length} completos con foto y mensaje</span>
      </div>
      <EditorBienvenidas pastores={pastores} />
    </>
  );
}
