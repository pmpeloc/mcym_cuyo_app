import Link from 'next/link';
import { COMIDAS, DIAS, hoy, hora } from '@/lib/convencion';
import { db, ok, type MenuItem } from '@/lib/db';
import { EditorMenu } from './editor-menu';
import { Organizacion } from './organizacion';

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
  const dias = (corto: boolean, clase: string) => (
    <div className={`days ${clase}`}>
      {DIAS.map((d) => (
        <Link key={d.id} href={`/organizacion?dia=${d.id}`} replace className={d.id === dia.id ? 'on' : ''}>
          {corto ? d.nombre.slice(0, 3) : d.nombre}{d.id === h ? ' · hoy' : ''}
        </Link>
      ))}
    </div>
  );
  const pie = `${info?.actualizado ? `Guardado ${hora(info.actualizado)} h. ` : ''}${dia.id === h ? 'Los asistentes ya lo ven.' : `Se verá el ${dia.nombre.toLowerCase()}.`}`;
  return (
    <Organizacion titulo="Editar menú" derecha={dias(false, '')}>
      <div className="stack">
        {dias(true, 'movil')}
        <EditorMenu dia={dia.id} aviso={info?.aviso ?? ''} comidas={comidas} items={items} pie={pie} />
      </div>
    </Organizacion>
  );
}
