import { db, ok, type Perdido } from '@/lib/db';
import { Copiar } from '../../cliente';
import { Asistente } from '../asistente';

export const metadata = { title: 'Wi‑Fi y avisos' };

export default async function Info() {
  const s = db();
  const [wifi, perdidos] = await Promise.all([
    s.from('config').select('wifi_red, wifi_clave').eq('id', 1).maybeSingle().then(ok<{ wifi_red: string; wifi_clave: string } | null>),
    s.from('perdidos').select('*').neq('que', '').order('creado', { ascending: false }).then(ok<Perdido[]>),
  ]);
  return (
    <Asistente titulo="Wi‑Fi y avisos">
      <div className="stack">
        <div className="cols2">
          <div className="card">
            <span className="lbl">Wi‑Fi</span>
            <dl className="wifi">
              <dt>Red</dt><dd>{wifi?.wifi_red}</dd><span />
              <dt>Clave</dt><dd>{wifi?.wifi_clave}</dd>{wifi?.wifi_clave ? <Copiar texto={wifi.wifi_clave} /> : <span />}
            </dl>
          </div>
          <div className="card">
            <span className="lbl">Objetos perdidos</span>
            {perdidos.length
              ? perdidos.map((p) => <div className="perdido" key={p.id}><b>{p.que}</b><small>{[p.donde, p.cuando].filter(Boolean).join(' · ')}</small></div>)
              : <p className="note">No hay objetos perdidos por ahora.</p>}
            {perdidos.length > 0 && <p className="note">Se retiran en la mesa de recepción. Si perdiste algo, avisá ahí.</p>}
          </div>
        </div>
      </div>
    </Asistente>
  );
}
