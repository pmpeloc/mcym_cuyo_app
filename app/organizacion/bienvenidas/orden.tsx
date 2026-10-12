'use client';
import { moverPastor } from '../acciones';
import { correr } from '../campo';

export function Orden({ id, primero, ultimo }: { id: string; primero: boolean; ultimo: boolean }) {
  return (
    <>
      <button className="mini" type="button" aria-label="Subir" disabled={primero} onClick={() => correr(() => moverPastor(id, -1), 'Orden guardado')}>↑</button>
      <button className="mini" type="button" aria-label="Bajar" disabled={ultimo} onClick={() => correr(() => moverPastor(id, 1), 'Orden guardado')}>↓</button>
    </>
  );
}
