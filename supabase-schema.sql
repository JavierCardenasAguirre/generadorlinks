-- Ejecutar en Supabase SQL Editor
create extension if not exists "uuid-ossp";

create table if not exists public.usuarios (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  email text not null unique,
  password_hash text not null,
  slug text not null unique,
  role text not null default 'user' check (role in ('admin','user')),
  approved boolean not null default false,
  template text not null default 'aurora',
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_sessions (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.enlaces (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  titulo text not null,
  url text not null,
  tipo text not null default 'web',
  estado boolean not null default true,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suscripciones (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid not null unique references public.usuarios(id) on delete cascade,
  status text not null default 'trial' check (status in ('trial','active','past_due','canceled')),
  monthly_price_usd numeric(10,2) not null default 3,
  trial_ends_at timestamptz,
  current_period_starts_at timestamptz,
  current_period_ends_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.click_stats (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  enlace_id uuid not null references public.enlaces(id) on delete cascade,
  ip text,
  user_agent text,
  clicked_at timestamptz not null default now()
);

create index if not exists idx_usuarios_slug on public.usuarios(slug);
create index if not exists idx_enlaces_usuario on public.enlaces(usuario_id);
create index if not exists idx_clicks_usuario on public.click_stats(usuario_id);
create index if not exists idx_clicks_enlace on public.click_stats(enlace_id);

-- RLS opcional (si se usa service role en backend, puede mantenerse deshabilitado)
alter table public.usuarios enable row level security;
alter table public.user_sessions enable row level security;
alter table public.enlaces enable row level security;
alter table public.suscripciones enable row level security;
alter table public.click_stats enable row level security;

-- Políticas mínimas para usuarios autenticados de Supabase Auth (opcionales)
-- Si no usas Supabase Auth directamente para sesiones, puedes omitir estas políticas.
