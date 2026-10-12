import { db, ok } from '@/lib/db';

// Cron diario de Vercel (vercel.json): una consulta liviana para que Supabase Free no pause el proyecto.
export const dynamic = 'force-dynamic';

export async function GET() {
  ok(await db().from('config').select('id').limit(1));
  return Response.json({ ok: true });
}
