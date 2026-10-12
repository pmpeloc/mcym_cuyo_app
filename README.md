# MCyM · Convención Regional Cuyo 2026

App para los asistentes de la convención (12 al 15 de noviembre de 2026, Godoy Cruz, Mendoza), a la que se entra por QR.
Next.js en Vercel + Supabase (Postgres + Storage). No tiene login.

| Ruta | Para quién | Qué hace |
|---|---|---|
| `/` | Asistentes | Menú del día en curso, con cambios, aviso del día y refresco cada minuto |
| `/comidas` | Asistentes | Voy / No voy a los 4 almuerzos y las 4 cenas. Cierra a las 20:00 del día anterior |
| `/bienvenida` | Asistentes | Mensajes de los matrimonios pastorales |
| `/info` | Asistentes | Wi‑Fi y objetos perdidos |
| `/apuntes` | Asistentes | Apuntes privados: solo en el celular, nunca van al servidor |
| `/organizacion` | Cocina y organización | Menú, confirmaciones, Wi‑Fi y objetos, bienvenidas |

## Puesta en marcha

1. **Supabase** → SQL Editor: ejecutar `supabase/schema.sql` y después `supabase/seed.sql` (datos ficticios).
2. **Variables** (Supabase → Project Settings → API Keys): copiar `.env.example` a `.env.local` y completar
   `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (la clave **secreta**).
3. Local: `npm install` y `npm run dev` → http://localhost:3000
4. **Vercel**: importar el repo, cargar las mismas dos variables y hacer el deploy. El cron de `vercel.json`
   consulta la base una vez por día para que Supabase Free no pause el proyecto.
5. Para probar como si fuera un día de la convención: variable `AHORA_SIMULADO=2026-11-13T12:00:00-03:00`.
   Sacarla antes del evento.

## Decisiones

- **Sin login.** Cada celular se identifica con un id al azar guardado en el navegador. El panel `/organizacion`
  no tiene clave: cualquiera con el link puede editar. No se publica en ningún lado y está marcado `noindex`.
- **La base solo se usa desde el servidor**, con la clave secreta. RLS está activado sin políticas, así que la
  clave pública no sirve para leer ni escribir.
- Días, comidas y horarios están en `lib/convencion.ts`.
- Chequeo de la lógica de cierre: `node scripts/check-cierre.ts`.
- La fuente Tan Meringue (`app/TanMeringue.woff2`) es paga y la proveyó la organización. No conviene que este
  repo sea público.
