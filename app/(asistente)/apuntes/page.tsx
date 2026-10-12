import Link from 'next/link';
import { DIAS, hoy } from '@/lib/convencion';
import { Candado } from '../../pantalla';
import { Asistente } from '../asistente';
import { Apuntes } from './apuntes';

export const metadata = { title: 'Mis apuntes' };

export default async function Page({ searchParams }: { searchParams: Promise<{ dia?: string }> }) {
  const { dia: q } = await searchParams;
  const dia = (DIAS.find((d) => d.id === q) ?? DIAS.find((d) => d.id === hoy()) ?? DIAS[0]).id;
  const dias = (clase: string, pill?: boolean) => (
    <div className={`days ${clase}`}>
      {DIAS.map((d) => (
        <Link key={d.id} href={`/apuntes?dia=${d.id}`} replace className={`${pill ? 'pill' : ''}${d.id === dia ? ' on' : ''}`}>{d.nombre}</Link>
      ))}
    </div>
  );
  return (
    <Asistente titulo="Mis apuntes" derecha={dias('')}>
      <div className="stack apuntes">
        <div className="candado">
          <Candado />
          <span className="movil">Tus apuntes se guardan <b>solo en este celular</b>. Nadie más los ve, ni los organizadores. Si borrás los datos del navegador o cambiás de celular, se pierden.</span>
          <span className="escritorio">Tus apuntes se guardan <b>solo en este dispositivo</b>. Nadie más los ve, ni los organizadores. Si borrás los datos del navegador, se pierden.</span>
        </div>
        {dias('movil', true)}
        <Apuntes dia={dia} nombre={DIAS.find((d) => d.id === dia)!.nombre.toLowerCase()} />
      </div>
    </Asistente>
  );
}
