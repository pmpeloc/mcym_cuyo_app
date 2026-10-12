import Link from 'next/link';
import { COMIDAS, DIAS, hoy, hora } from '@/lib/convencion';
import { db, ok, type MenuItem } from '@/lib/db';
import { EditorMenu } from './editor-menu';

export default async function Menu({ searchParams }: { searchParams: Promise<{ dia?: string }> }) {
  const h = hoy();
  const { dia: q } = await searchParams;
  const dia = DIAS.find((d) => d.id === q) ?? DIAS.find((d) => d.id === h) ?? DIAS[0];
  const comidas = COMIDAS.filter((c) => c.dia === dia.id);
  const s = db();
  const [items, info] = await Promise.all([
    s.from('menu_items').select('*').in('comida', comidas.map((c) => c.id)).order('orden').then(ok<MenuItem[]>),
    s.from('dias').select('aviso, actualizado').eq('id', dia.id).maybeSingle().then(ok<{ aviso: string; actualizado: string | null } | null>),
  ]);
  return (
    <>
      <div className="acts">
        <h2>Editar menú</h2>
        <div className="chips">
          {DIAS.map((d) => (
            <Link key={d.id} href={`/organizacion?dia=${d.id}`} aria-current={d.id === dia.id ? 'page' : undefined}>
              {d.nombre}{d.id === h ? ' · hoy' : ''}
            </Link>
          ))}
        </div>
      </div>
      <EditorMenu dia={dia.id} aviso={info?.aviso ?? ''} comidas={comidas} items={items} />
      <p className="note">
        {info?.actualizado ? `Última modificación: ${hora(info.actualizado)} h. ` : ''}
        Se guarda al salir de cada campo. {dia.id === h ? 'Los asistentes ya lo ven.' : `Se verá el ${dia.nombre.toLowerCase()}.`}
      </p>
    </>
  );
}
