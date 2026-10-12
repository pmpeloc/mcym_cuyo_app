'use server';
import { revalidatePath } from 'next/cache';
import { COMIDAS, DIAS, MAX_MENSAJE } from '@/lib/convencion';
import { db, ok } from '@/lib/db';

// Qué campos se pueden editar desde el panel, por tabla.
const EDITABLE: Record<string, string[]> = {
  menu_items: ['tipo', 'valor'],
  perdidos: ['que', 'donde', 'cuando'],
};
const listo = () => revalidatePath('/', 'layout');

// El "Actualizado a las…" que ve el asistente.
async function tocarMenu(comida: string) {
  const dia = COMIDAS.find((c) => c.id === comida)?.dia;
  if (dia) ok(await db().from('dias').upsert({ id: dia, actualizado: new Date().toISOString() }));
}

export async function editar(tabla: string, id: string, campo: string, valor: string) {
  if (!EDITABLE[tabla]?.includes(campo)) throw new Error('Campo no editable');
  valor = String(valor).slice(0, campo === 'mensaje' ? MAX_MENSAJE : 200);
  const r = ok(await db().from(tabla).update({ [campo]: valor }).eq('id', id).select('*').single()) as { comida?: string };
  if (tabla === 'menu_items' && r.comida) await tocarMenu(r.comida);
  listo();
}

// ---------- Menú ----------
export async function guardarAviso(dia: string, aviso: string) {
  if (!DIAS.some((d) => d.id === dia)) throw new Error('Día inválido');
  ok(await db().from('dias').upsert({ id: dia, aviso: String(aviso).slice(0, 300), actualizado: new Date().toISOString() }));
  listo();
}

export async function agregarItem(comida: string) {
  if (!COMIDAS.some((c) => c.id === comida)) throw new Error('Comida inválida');
  ok(await db().from('menu_items').insert({ comida, tipo: 'Extra', valor: '', original: null, orden: Date.now() / 1000 | 0 }));
  await tocarMenu(comida);
  listo();
}

// Un ítem del menú original se marca "Hoy no hay"; uno agregado en el día se borra.
export async function quitarItem(id: string) {
  const s = db();
  const i = ok(await s.from('menu_items').select('comida, original').eq('id', id).single()) as { comida: string; original: string | null };
  ok(await (i.original === null ? s.from('menu_items').delete() : s.from('menu_items').update({ quitado: true })).eq('id', id));
  await tocarMenu(i.comida);
  listo();
}

export async function volverItem(id: string) {
  const s = db();
  const i = ok(await s.from('menu_items').select('comida, original').eq('id', id).single()) as { comida: string; original: string };
  ok(await s.from('menu_items').update({ valor: i.original, quitado: false }).eq('id', id));
  await tocarMenu(i.comida);
  listo();
}

// "Restaurar menú original del día": borra lo agregado y deshace cambios y "Hoy no hay".
export async function restaurarDia(dia: string) {
  const comidas = COMIDAS.filter((c) => c.dia === dia).map((c) => c.id);
  if (!comidas.length) throw new Error('Día inválido');
  const s = db();
  ok(await s.from('menu_items').delete().in('comida', comidas).is('original', null));
  const items = ok(await s.from('menu_items').select('id, original').in('comida', comidas)) as { id: string; original: string }[];
  await Promise.all(items.map((i) => s.from('menu_items').update({ valor: i.original, quitado: false }).eq('id', i.id).then(ok)));
  ok(await s.from('dias').upsert({ id: dia, actualizado: new Date().toISOString() }));
  listo();
}

// ---------- Wi‑Fi y objetos perdidos ----------
export async function guardarWifi(campo: 'wifi_red' | 'wifi_clave', valor: string) {
  if (campo !== 'wifi_red' && campo !== 'wifi_clave') throw new Error('Campo inválido');
  ok(await db().from('config').upsert({ id: 1, [campo]: String(valor).slice(0, 100) }));
  listo();
}

export async function agregarPerdido(cuando: string) {
  ok(await db().from('perdidos').insert({ cuando: String(cuando).slice(0, 60) }));
  listo();
}

export async function entregarPerdido(id: string) {
  ok(await db().from('perdidos').delete().eq('id', id));
  listo();
}

// ---------- Bienvenidas ----------
// Formulario "Guardar y publicar": crea o actualiza y devuelve el id (para subir la foto después).
export async function guardarPastor(id: string | null, c: { nombres: string; iglesia: string; mensaje: string }) {
  const datos = {
    nombres: String(c.nombres).trim().slice(0, 120),
    iglesia: String(c.iglesia).trim().slice(0, 120),
    mensaje: String(c.mensaje).trim().slice(0, MAX_MENSAJE),
  };
  if (!datos.nombres || !datos.iglesia) throw new Error('Faltan nombres o iglesia');
  const s = db();
  const r = id
    ? ok(await s.from('pastores').update(datos).eq('id', id).select('id').single())
    : ok(await s.from('pastores').insert({ ...datos, orden: (Date.now() / 1000) | 0 }).select('id').single());
  listo();
  return (r as unknown as { id: string }).id;
}

export async function eliminarPastor(id: string) {
  ok(await db().from('pastores').delete().eq('id', id));
  listo();
}

// Intercambia el orden con el vecino de arriba o de abajo.
export async function moverPastor(id: string, dir: -1 | 1) {
  const s = db();
  const L = ok(await s.from('pastores').select('id, orden').order('orden')) as { id: string; orden: number }[];
  const i = L.findIndex((p) => p.id === id), j = i + dir;
  if (i < 0 || !L[j]) return;
  // Reasigna 1..n para que no queden órdenes repetidos.
  [L[i], L[j]] = [L[j], L[i]];
  await Promise.all(L.map((p, k) => s.from('pastores').update({ orden: k + 1 }).eq('id', p.id).then(ok)));
  listo();
}

// La foto llega ya recortada a 600×600 JPEG desde el navegador.
export async function subirFoto(id: string, form: FormData) {
  const f = form.get('foto');
  if (!(f instanceof File) || f.type !== 'image/jpeg' || f.size > 1_000_000) throw new Error('Foto inválida');
  const s = db();
  // ponytail: la foto anterior queda en el bucket (son ~80 KB); borrar a mano si hiciera falta.
  const path = `${id}-${Date.now()}.jpg`;
  ok(await s.storage.from('pastores').upload(path, f, { contentType: 'image/jpeg' }));
  const url = s.storage.from('pastores').getPublicUrl(path).data.publicUrl;
  ok(await s.from('pastores').update({ foto_url: url }).eq('id', id));
  listo();
}

export async function quitarFoto(id: string) {
  ok(await db().from('pastores').update({ foto_url: null }).eq('id', id));
  listo();
}
