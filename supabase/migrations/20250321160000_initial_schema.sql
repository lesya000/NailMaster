-- NailMaster: схема для мастера маникюра (клиенты, услуги, записи, портфолио)
-- Выполните в Supabase: SQL Editor → New query → вставьте и Run
-- либо: supabase db push (если проект связан с CLI)

-- Расширения
create extension if not exists "pgcrypto";

-- Типы
do $$ begin
  create type public.appointment_status as enum (
    'scheduled',
    'confirmed',
    'completed',
    'cancelled',
    'no_show'
  );
exception
  when duplicate_object then null;
end $$;

-- Профиль мастера (1:1 с auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  salon_name text,
  city text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Клиенты мастера
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  phone text,
  email text,
  notes text,
  allergy_notes text,
  instagram text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_master_id_idx on public.clients (master_id);
create index if not exists clients_phone_idx on public.clients (master_id, phone);

-- Услуги (маникюр, покрытие и т.д.)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'RUB',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_master_id_idx on public.services (master_id);
create index if not exists services_active_idx on public.services (master_id, is_active);

-- Записи
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  notes text,
  deposit_cents integer not null default 0 check (deposit_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_time_order check (ends_at > starts_at)
);

create index if not exists appointments_master_starts_idx on public.appointments (master_id, starts_at);
create index if not exists appointments_client_idx on public.appointments (client_id);

-- Услуги в записи (несколько услуг на один визит)
create table if not exists public.appointment_services (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  price_cents_at_booking integer not null default 0 check (price_cents_at_booking >= 0),
  created_at timestamptz not null default now(),
  unique (appointment_id, service_id)
);

create index if not exists appointment_services_appt_idx on public.appointment_services (appointment_id);

-- Портфолио (ссылки на файлы в Storage или внешние URL)
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  master_id uuid not null references public.profiles (id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists portfolio_master_idx on public.portfolio_items (master_id, sort_order);

-- updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists services_updated_at on public.services;
create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists appointments_updated_at on public.appointments;
create trigger appointments_updated_at
  before update on public.appointments
  for each row execute function public.set_updated_at();

-- Профиль при регистрации
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_services enable row level security;
alter table public.portfolio_items enable row level security;

-- Повторный запуск: снять старые политики
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "clients_all_own_master" on public.clients;
drop policy if exists "services_all_own_master" on public.services;
drop policy if exists "appointments_all_own_master" on public.appointments;
drop policy if exists "appointment_services_select" on public.appointment_services;
drop policy if exists "appointment_services_insert" on public.appointment_services;
drop policy if exists "appointment_services_update" on public.appointment_services;
drop policy if exists "appointment_services_delete" on public.appointment_services;
drop policy if exists "portfolio_all_own_master" on public.portfolio_items;

-- profiles: только свой ряд
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- clients
create policy "clients_all_own_master"
  on public.clients for all
  using (auth.uid() = master_id)
  with check (auth.uid() = master_id);

-- services
create policy "services_all_own_master"
  on public.services for all
  using (auth.uid() = master_id)
  with check (auth.uid() = master_id);

-- appointments
create policy "appointments_all_own_master"
  on public.appointments for all
  using (auth.uid() = master_id)
  with check (auth.uid() = master_id);

-- appointment_services: через запись, принадлежащую мастеру
create policy "appointment_services_select"
  on public.appointment_services for select
  using (
    exists (
      select 1 from public.appointments a
      where a.id = appointment_services.appointment_id
        and a.master_id = auth.uid()
    )
  );

create policy "appointment_services_insert"
  on public.appointment_services for insert
  with check (
    exists (
      select 1 from public.appointments a
      where a.id = appointment_services.appointment_id
        and a.master_id = auth.uid()
    )
  );

create policy "appointment_services_update"
  on public.appointment_services for update
  using (
    exists (
      select 1 from public.appointments a
      where a.id = appointment_services.appointment_id
        and a.master_id = auth.uid()
    )
  );

create policy "appointment_services_delete"
  on public.appointment_services for delete
  using (
    exists (
      select 1 from public.appointments a
      where a.id = appointment_services.appointment_id
        and a.master_id = auth.uid()
    )
  );

-- portfolio
create policy "portfolio_all_own_master"
  on public.portfolio_items for all
  using (auth.uid() = master_id)
  with check (auth.uid() = master_id);

-- Комментарии для UI / документации в БД
comment on table public.profiles is 'Профиль мастера, связан с auth.users';
comment on table public.clients is 'Клиенты мастера';
comment on table public.services is 'Прайс и длительность услуг';
comment on table public.appointments is 'Записи на приём';
comment on table public.appointment_services is 'Услуги в составе записи';
comment on table public.portfolio_items is 'Работы для портфолио';
