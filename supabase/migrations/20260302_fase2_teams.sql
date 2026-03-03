-- KIFIT — Fase 2: Schema de equipos
-- Reemplaza coaches/athletes con un modelo basado en equipos.
--
-- Un "team" puede ser un coach individual o un gimnasio.
-- Los coaches son miembros del team. Los atletas pertenecen al team.
--
-- ⚠️  Ejecutar en Supabase SQL Editor DESPUÉS de la migración de Fase 0.
--     Elimina las tablas coaches y athletes antiguas (solo desarrollo).

-- ============================================
-- 1. Eliminar tablas y policies antiguas
-- ============================================
drop policy if exists "coach ve sus atletas" on athletes;
drop policy if exists "atleta ve su propio registro" on athletes;
drop policy if exists "coach ve su propio registro" on coaches;
drop table if exists athletes;
drop table if exists coaches;

-- ============================================
-- 2. Nuevas tablas
-- ============================================

create table teams (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text check (type in ('individual', 'gym')) not null default 'individual',
  owner_id uuid references profiles on delete cascade not null,
  invite_code char(6) unique not null,
  created_at timestamptz default now() not null
);

create table team_members (
  team_id uuid references teams on delete cascade,
  profile_id uuid references profiles on delete cascade,
  role text check (role in ('owner', 'coach')) not null default 'coach',
  joined_at timestamptz default now() not null,
  primary key (team_id, profile_id)
);

create table team_athletes (
  team_id uuid references teams on delete cascade,
  athlete_id uuid references profiles on delete cascade,
  joined_at timestamptz default now() not null,
  primary key (team_id, athlete_id)
);

create table athlete_profiles (
  id uuid references profiles on delete cascade primary key,
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  birth_date date,
  updated_at timestamptz default now() not null
);

-- ============================================
-- 3. Row Level Security
-- ============================================
alter table teams enable row level security;
alter table team_members enable row level security;
alter table team_athletes enable row level security;
alter table athlete_profiles enable row level security;

-- Profiles: reemplazar policy anterior para que coach vea perfiles de atletas
drop policy if exists "usuario ve su propio perfil" on profiles;

create policy "gestionar perfil propio"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "coach ve perfiles de sus atletas"
  on profiles for select using (
    id in (
      select ta.athlete_id
      from team_athletes ta
      join team_members tm on tm.team_id = ta.team_id
      where tm.profile_id = auth.uid()
    )
  );

-- Teams
create policy "miembro ve sus equipos"
  on teams for select using (
    id in (select team_id from team_members where profile_id = auth.uid())
  );

create policy "usuario crea equipo"
  on teams for insert with check (owner_id = auth.uid());

create policy "owner administra equipo"
  on teams for update using (owner_id = auth.uid());

-- Team members
create policy "miembro ve miembros del equipo"
  on team_members for select using (
    team_id in (select team_id from team_members where profile_id = auth.uid())
  );

create policy "owner agrega miembros"
  on team_members for insert with check (
    team_id in (select id from teams where owner_id = auth.uid())
  );

-- Team athletes
create policy "coach ve atletas del equipo"
  on team_athletes for select using (
    team_id in (select team_id from team_members where profile_id = auth.uid())
  );

create policy "coach agrega atletas"
  on team_athletes for insert with check (
    team_id in (select team_id from team_members where profile_id = auth.uid())
  );

-- Athlete profiles
create policy "ver datos fisicos propios"
  on athlete_profiles for select using (auth.uid() = id);

create policy "coach ve datos fisicos de atletas"
  on athlete_profiles for select using (
    id in (
      select ta.athlete_id
      from team_athletes ta
      join team_members tm on tm.team_id = ta.team_id
      where tm.profile_id = auth.uid()
    )
  );

create policy "atleta gestiona sus datos fisicos"
  on athlete_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================
-- 4. Funciones RPC
-- ============================================

-- Crear equipo para un coach (atómico: crea team + agrega como owner)
create or replace function setup_coach_team(
  coach_id uuid,
  team_name text,
  team_invite_code char(6)
)
returns uuid as $$
declare
  new_team_id uuid;
begin
  insert into teams (name, type, owner_id, invite_code)
  values (team_name, 'individual', coach_id, team_invite_code)
  returning id into new_team_id;

  insert into team_members (team_id, profile_id, role)
  values (new_team_id, coach_id, 'owner');

  return new_team_id;
end;
$$ language plpgsql security definer;

-- Invitar atleta por email (busca el perfil, lo agrega al equipo)
create or replace function invite_athlete_by_email(
  team_id_input uuid,
  athlete_email text
)
returns json as $$
declare
  athlete_record profiles%rowtype;
  caller_is_member boolean;
begin
  select exists(
    select 1 from team_members
    where team_id = team_id_input and profile_id = auth.uid()
  ) into caller_is_member;

  if not caller_is_member then
    return json_build_object('error', 'No tienes permiso para invitar atletas a este equipo.');
  end if;

  select * into athlete_record from profiles
  where email = athlete_email and role = 'athlete';

  if athlete_record is null then
    return json_build_object('error', 'No se encontró un atleta con ese correo. Debe crear su cuenta primero.');
  end if;

  if exists (
    select 1 from team_athletes
    where team_id = team_id_input and athlete_id = athlete_record.id
  ) then
    return json_build_object('error', 'Este atleta ya está en tu equipo.');
  end if;

  insert into team_athletes (team_id, athlete_id)
  values (team_id_input, athlete_record.id);

  insert into athlete_profiles (id)
  values (athlete_record.id)
  on conflict (id) do nothing;

  return json_build_object(
    'success', true,
    'athlete', json_build_object(
      'id', athlete_record.id,
      'full_name', athlete_record.full_name,
      'email', athlete_record.email
    )
  );
end;
$$ language plpgsql security definer;
