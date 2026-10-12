'use client';
import { toast } from '../cliente';

// Guarda al salir del campo, solo si cambió. key={valor}: si otro organizador lo cambia, se ve al refrescar.
type Props = { valor: string; guardar: (v: string) => Promise<unknown> } &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'onBlur'>;

export function Campo({ valor, guardar, className = '', ...props }: Props) {
  return (
    <input key={valor} defaultValue={valor} className={`input ${className}`} {...props}
      onBlur={(e) => e.target.value !== valor && correr(() => guardar(e.target.value), 'Guardado. Los asistentes ya lo ven.')} />
  );
}

export async function correr(fn: () => Promise<unknown>, msg: string) {
  try { await fn(); toast(msg); return true } catch { toast('No se pudo guardar. Revisá la conexión y probá de nuevo.'); return false }
}
