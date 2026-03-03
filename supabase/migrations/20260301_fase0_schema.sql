-- KIFIT — Fase 0: Schema base
-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/gzrmmorihdvwbhjnwiav/sql

-- Profiles (extiende auth.users de Supabase)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text check (role in ('coach', 'athlete')) not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Coaches
create table coaches (
  id uuid references profiles on delete cascade primary key,
  invite_code char(6) unique not null
);

-- Athletes
create table athletes (
  id uuid references profiles on delete cascade primary key,
  coach_id uuid references coaches not null,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  birth_date date
);

-- Row Level Security
alter table profiles enable row level security;
alter table coaches enable row level security;
alter table athletes enable row level security;

create policy "usuario ve su propio perfil"
  on profiles for all using (auth.uid() = id);

create policy "coach ve sus atletas"
  on athletes for all using (auth.uid() = coach_id);

create policy "atleta ve su propio registro"
  on athletes for all using (auth.uid() = id);

create policy "coach ve su propio registro"
  on coaches for all using (auth.uid() = id);
