# MCyM · Convención Regional Cuyo 2026

App para los asistentes de la convención (12 al 15 de noviembre de 2026, Godoy Cruz, Mendoza), a la que se entra por QR.
Next.js en Vercel + Supabase (Postgres + Storage). No tiene login.

| Ruta | Para quién | Qué hace |
|---|---|---|
| `/` | Asistentes | Menú del día en curso, con cambios, aviso del día y refresco cada minuto |
| `/comidas` | Asistentes | Voy / No voy a los 4 almuerzos y las 4 cenas, para una persona o una familia. Sin cierre |
| `/bienvenida` | Asistentes | Mensajes de los matrimonios pastorales |
| `/info` | Asistentes | Wi‑Fi y objetos perdidos |
| `/apuntes` | Asistentes | Apuntes privados: solo en el celular, nunca van al servidor |
| `/organizacion` | Cocina y organización | Menú, confirmaciones, Wi‑Fi y objetos, bienvenidas |

## Cómo usar

### Asistentes (entran por el QR)

- **Menú de hoy**: muestra solo el menú del día en curso. Antes del jueves 12 dice "Todavía no empezó" y después del domingo 15, "¡Gracias por venir!". Si cocina cambia algo, el asistente ve directamente el menú nuevo, sin marcas de qué cambió, y la página se actualiza sola cada minuto.
- **Confirmar comidas**: escribir una vez el nombre y la iglesia, elegir cuántas personas son (una familia confirma una sola vez por todos) y marcar **Voy** o **No voy** en cada almuerzo y cena. No hay cierre: se puede cambiar en cualquier momento. La respuesta queda asociada al celular: si confirman desde otro celular, cuentan como otra persona.
- **Bienvenida**: los mensajes de los pastores de Mendoza.
- **Wi‑Fi y avisos**: red y clave (botón "Copiar") y objetos perdidos, que se retiran en recepción.
- **Mis apuntes**: un apunte por día. Se guardan **solo en ese celular**: nadie más los ve. Si se borran los datos del navegador o cambian de celular, se pierden, así que conviene usar **"Compartir mis apuntes"** para mandárselos por WhatsApp o mail.

### Cocina y organización (`/organizacion`)

El link del panel se pasa solo a quienes lo usan. No tiene clave: no hay que compartirlo en grupos grandes ni en el QR.

En Menú y Wi‑Fi, cada campo **se guarda al salir de él** (al tocar otro campo o fuera del cuadro). Abajo aparece un aviso de "Guardado".

- **Menú**
  - Elegir el día arriba; el de hoy dice "· hoy".
  - Para cambiar un plato, escribir encima. Queda marcado en ámbar en el panel; el asistente solo ve el plato nuevo. **Volver al original** lo deshace.
  - **Restaurar menú original del día** deshace todos los cambios del día (pide un segundo toque).
  - **Quitar hoy** saca un plato del menú del asistente sin borrarlo (en el panel se ve tachado).
  - **+ Agregar algo** crea un ítem: escribir el tipo (ej. "Extra") y qué es. Mientras esté vacío no lo ve nadie. **Borrar** lo elimina.
  - **Aviso del día**: texto opcional que aparece arriba del menú (ej. cambio de salón).
- **Confirmaciones**
  - Muestra cuántas personas van y cuántas no van a cada comida (una familia que confirma por 5 suma 5). "Ver nombres" despliega la lista.
  - No hay cierre: el número puede cambiar hasta último momento. La organización avisa para que confirmen a tiempo.
  - Si un nombre aparece dos veces, es la misma persona confirmando desde dos celulares.
- **Wi‑Fi y objetos perdidos**
  - Red y clave se editan directamente.
  - **+ Cargar objeto encontrado** agrega uno con el día y la hora actuales. Completar qué es y dónde estaba.
  - **Entregado** lo saca de la lista de los asistentes.
- **Bienvenidas**
  - La lista muestra cada matrimonio con su estado: **Publicado**, **Falta foto** (se publica con las iniciales) o **Falta mensaje** (no se muestra hasta completarlo).
  - **Editar** o **+ Agregar matrimonio** abre el formulario: foto (en el celular, “Sacar foto” o “Elegir de la galería”; en la computadora se puede arrastrar), nombres, iglesia y mensaje de hasta 400 caracteres. A la derecha se ve la tarjeta tal como la verá el asistente.
  - **Guardar y publicar** guarda todo junto. Nombres e iglesia son obligatorios. **Eliminar matrimonio** pide un segundo toque.
  - En la computadora, ↑ y ↓ cambian el orden en que aparecen.

### Antes del evento

- [ ] Reemplazar los datos ficticios: menús, Wi‑Fi, objetos perdidos y los 18 pastores con sus fotos.
- [ ] Borrar la variable `AHORA_SIMULADO` en Vercel (si se usó para probar) y volver a desplegar.
- [ ] Generar el QR con el link definitivo de Vercel (sin `/organizacion`).
- [ ] Pasar el link del panel solo al equipo de cocina y organización.

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
- Chequeo del "día de hoy": `node scripts/check-hoy.ts`.
- La fuente Tan Meringue (`app/TanMeringue.woff2`) es paga y la proveyó la organización. No conviene que este
  repo sea público.
