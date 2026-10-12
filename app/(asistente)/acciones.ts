'use server';
import { COMIDAS, MAX_PERSONAS } from '@/lib/convencion';
import { db, ok } from '@/lib/db';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function misConfirmaciones(dispositivo: string) {
  if (!UUID.test(dispositivo)) return [];
  return ok(await db().from('confirmaciones').select('comida, va').eq('dispositivo', dispositivo)) as { comida: string; va: boolean }[];
}

// Sin cierre: se puede confirmar o cambiar en cualquier momento (pedido de la organización).
export async function confirmar(dispositivo: string, nombre: string, personas: number, comida: string, va: boolean) {
  const c = COMIDAS.find((x) => x.id === comida);
  nombre = String(nombre).trim().slice(0, 80);
  if (!UUID.test(dispositivo) || !c || !nombre || typeof va !== 'boolean') return { error: 'Datos inválidos' };
  if (!Number.isInteger(personas) || personas < 1 || personas > MAX_PERSONAS) return { error: 'Datos inválidos' };
  const s = db();
  ok(await s.from('confirmaciones').upsert({ dispositivo, comida, va, nombre, personas, actualizado: new Date().toISOString() }));
  // Si cambió el nombre o la cantidad, que quede igual en todas sus respuestas.
  ok(await s.from('confirmaciones').update({ nombre, personas }).eq('dispositivo', dispositivo).neq('comida', comida));
  return { ok: true };
}
