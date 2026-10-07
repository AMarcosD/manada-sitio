-- Ejecutar una sola vez en Supabase: Project > SQL Editor > New query > Run.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,        -- 'maintenance' | 'consumidores_cta' | 'proveedores' | 'contacto'
  nombre text,
  email text not null,
  telefono text,
  empresa text,
  motivo text,
  mensaje text,
  page_url text
);

alter table public.leads enable row level security;

-- El sitio público solo puede INSERTAR. Nadie puede leer, editar ni borrar
-- con la publishable key: eso lo hacés vos desde el Table Editor de Supabase.
-- "to public" (no "to anon") porque los proyectos nuevos de Supabase resuelven
-- la publishable key a un rol que no siempre es exactamente "anon".
create policy "Cualquiera puede registrar un lead"
  on public.leads
  for insert
  to public
  with check (true);
