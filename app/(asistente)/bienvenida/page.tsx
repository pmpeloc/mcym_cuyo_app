import { db, ok, type Pastor } from '@/lib/db';
import { iniciales } from '../../componentes';
import { Cabecera } from '../cabecera';

function TarjetaPastor({ p }: { p: Pastor }) {
  return (
    <article className="card pastor">
      <header>
        <div className="foto">{p.foto_url ? <img src={p.foto_url} alt={`Foto de ${p.nombres}`} /> : iniciales(p.nombres)}</div>
        <div><b>Pastores {p.nombres}</b><span>{p.iglesia}</span></div>
      </header>
      <p>{p.mensaje}</p>
    </article>
  );
}

export default async function Bienvenida() {
  const pastores = ok(await db().from('pastores').select('*').order('orden')) as Pastor[];
  // Solo se publican los que tienen nombres y mensaje; sin foto se muestran las iniciales.
  const visibles = pastores.filter((p) => p.nombres.trim() && p.mensaje.trim());
  return (
    <>
      <Cabecera titulo="Bienvenidos a Mendoza" sub="Los matrimonios pastorales de la zona" />
      <div className="verse">
        “¡Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía!”
        <small>Salmos 133:1 · RVR1960</small>
      </div>
      <div className="stack">{visibles.map((p) => <TarjetaPastor key={p.id} p={p} />)}</div>
      <div className="foot" />
    </>
  );
}
