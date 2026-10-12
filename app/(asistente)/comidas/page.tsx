import { COMIDAS, DIAS, abierta } from '@/lib/convencion';
import { Cabecera } from '../cabecera';
import { Confirmar } from './confirmar';

export default function Comidas() {
  const dias = DIAS.map((d) => ({
    id: d.id,
    titulo: `${d.nombre} ${d.texto.split(' ')[0]}`,
    abierto: abierta(d.id),
    comidas: COMIDAS.filter((c) => c.dia === d.id),
  }));
  return (
    <>
      <Cabecera titulo="¿Venís a comer?" sub="Almuerzos y cenas de la convención" />
      <div className="aviso">
        <b>Confirmá con anticipación</b>
        Así cocina sabe cuántos platos preparar y puede organizar el comedor. Cada día se confirma hasta el día anterior a las 20:00.
      </div>
      <Confirmar dias={dias} />
      <div className="foot">Tu respuesta le llega al equipo de cocina</div>
    </>
  );
}
