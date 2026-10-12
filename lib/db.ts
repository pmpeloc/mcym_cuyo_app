import { createClient } from '@supabase/supabase-js';

// Solo el servidor habla con Supabase, con la clave secreta. La base tiene RLS activado y sin políticas,
// así que la clave pública no lee ni escribe nada. ponytail: sin login, el panel queda abierto a quien tenga el link.
export const db = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

export type MenuItem = { id: string; comida: string; tipo: string; valor: string; original: string | null; quitado: boolean; orden: number };
export type Pastor = { id: string; nombres: string; iglesia: string; mensaje: string; foto_url: string | null; orden: number };
export type Perdido = { id: string; que: string; donde: string; cuando: string };

// Falla visible en vez de mostrar datos vacíos sin aviso.
export function ok<T>(r: { data: T | null; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
}
