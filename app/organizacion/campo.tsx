'use client';
import { toast } from '../componentes';

// Guarda al salir del campo, solo si cambió. key={valor}: si otro organizador lo cambia, se ve al refrescar.
type Props = { valor: string; guardar: (v: string) => Promise<unknown>; multilinea?: boolean } &
  Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'defaultValue' | 'onBlur'>;

export function Campo({ valor, guardar, multilinea, ...props }: Props) {
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value !== valor) correr(() => guardar(e.target.value), 'Guardado. Los asistentes ya lo ven.');
  };
  return multilinea
    ? <textarea key={valor} defaultValue={valor} onBlur={onBlur} {...props} />
    : <input key={valor} defaultValue={valor} onBlur={onBlur} {...props} />;
}

export async function correr(fn: () => Promise<unknown>, msg: string) {
  try { await fn(); toast(msg) } catch { toast('No se pudo guardar. Revisá la conexión y probá de nuevo.') }
}
