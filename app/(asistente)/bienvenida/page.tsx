import { db, ok, type Pastor } from '@/lib/db';
import { TarjetaPastor } from '../../pantalla';
import { Asistente } from '../asistente';

export const metadata = { title: 'Bienvenida de los pastores' };

export default async function Bienvenida() {
  const pastores = ok(await db().from('pastores').select('*').order('orden')) as Pastor[];
  // Solo se publican los que tienen nombres y mensaje; sin foto se muestran las iniciales.
  const visibles = pastores.filter((p) => p.nombres.trim() && p.mensaje.trim());
  return (
    <Asistente titulo="Bienvenidos a Mendoza" sub="Los matrimonios pastorales de la zona" lbl="Los matrimonios pastorales de la zona">
      <p className="verse">
        “¡Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía!”
        <small>Salmos 133:1 · RVR1960</small>
      </p>
      <div className="stack">
        <div className="pastores">{visibles.map((p) => <TarjetaPastor key={p.id} p={p} />)}</div>
      </div>
    </Asistente>
  );
}
