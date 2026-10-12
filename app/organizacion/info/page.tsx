import { db, ok, type Perdido } from '@/lib/db';
import { EditorInfo } from './editor-info';

export default async function Info() {
  const s = db();
  const [wifi, perdidos] = await Promise.all([
    s.from('config').select('wifi_red, wifi_clave').eq('id', 1).maybeSingle().then(ok<{ wifi_red: string; wifi_clave: string } | null>),
    s.from('perdidos').select('*').order('creado', { ascending: false }).then(ok<Perdido[]>),
  ]);
  return (
    <>
      <h2>Wi‑Fi y objetos perdidos</h2>
      <EditorInfo red={wifi?.wifi_red ?? ''} clave={wifi?.wifi_clave ?? ''} perdidos={perdidos} />
    </>
  );
}
