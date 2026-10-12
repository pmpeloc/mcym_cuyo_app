-- Convención Regional Cuyo 2026. Pegar en Supabase > SQL Editor y ejecutar una vez.
-- Días y comidas son fijos y viven en lib/convencion.ts (ids: 'jue', 'jue-almuerzo', ...).

create table dias (
  id text primary key,
  aviso text not null default '',
  actualizado timestamptz
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  comida text not null,
  tipo text not null default '',
  valor text not null default '',
  original text,                -- null = agregado en el día ("Nuevo")
  quitado boolean not null default false,
  orden int not null default 0
);
create index on menu_items (comida, orden);

create table config (
  id int primary key default 1 check (id = 1),
  wifi_red text not null default '',
  wifi_clave text not null default ''
);

create table perdidos (
  id uuid primary key default gen_random_uuid(),
  que text not null default '',
  donde text not null default '',
  cuando text not null default '',
  creado timestamptz not null default now()
);

create table pastores (
  id uuid primary key default gen_random_uuid(),
  nombres text not null default '',
  iglesia text not null default '',
  mensaje text not null default '' check (char_length(mensaje) <= 400),
  foto_url text,
  orden int not null default 0
);

-- Un celular = un dispositivo (uuid guardado en el navegador). Una respuesta por comida.
create table confirmaciones (
  dispositivo uuid not null,
  comida text not null,
  va boolean not null,
  nombre text not null,
  actualizado timestamptz not null default now(),
  primary key (dispositivo, comida)
);

-- RLS sin políticas: nadie entra con la clave pública. Solo el servidor de Vercel (clave secreta).
alter table dias enable row level security;
alter table menu_items enable row level security;
alter table config enable row level security;
alter table perdidos enable row level security;
alter table pastores enable row level security;
alter table confirmaciones enable row level security;

-- Los proyectos nuevos de Supabase no dan permisos automáticos: solo el rol del servidor accede.
grant select, insert, update, delete on all tables in schema public to service_role;

-- Fotos de los pastores: lectura pública por URL, escritura solo desde el servidor.
insert into storage.buckets (id, name, public) values ('pastores', 'pastores', true);
