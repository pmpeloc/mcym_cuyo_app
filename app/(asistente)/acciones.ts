'use server';
import { COMIDAS, abierta } from '@/lib/convencion';
import { db, ok } from '@/lib/db';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function misConfirmaciones(dispositivo: string) {
  if (!UUID.test(dispositivo)) return [];
  return ok(await db().from('confirmaciones').select('comida, va').eq('dispositivo', dispositivo)) as { comida: string; va: boolean }[];
}

// El cierre se controla acá (servidor), no en la pantalla.
export async function confirmar(dispositivo: string, nombre: string, comida: string, va: boolean) {
  const c = COMIDAS.find((x) => x.id === comida);
  nombre = String(nombre).trim().slice(0, 80);
  if (!UUID.test(dispositivo) || !c || !nombre || typeof va !== 'boolean') return { error: 'Datos inválidos' };
  if (!abierta(c.dia)) return { error: 'Ese día ya cerró' };
  const s = db();
  ok(await s.from('confirmaciones').upsert({ dispositivo, comida, va, nombre, actualizado: new Date().toISOString() }));
  // Si cambió el nombre, que quede igual en todas sus respuestas.
  ok(await s.from('confirmaciones').update({ nombre }).eq('dispositivo', dispositivo).neq('nombre', nombre));
  return { ok: true };
}
