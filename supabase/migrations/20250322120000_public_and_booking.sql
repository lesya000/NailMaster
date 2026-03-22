-- Публичный доступ для лендинга (anon) и заявки на запись

-- Заявки с сайта (до подтверждения мастером)
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  preferred_start timestamptz,
  service_id uuid references public.services (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

comment on table public.booking_requests is 'Заявки на запись с публичной страницы';

alter table public.booking_requests enable row level security;

drop policy if exists "anon_insert_booking_requests" on public.booking_requests;
create policy "anon_insert_booking_requests"
  on public.booking_requests for insert to anon
  with check (true);

drop policy if exists "authenticated_select_booking_requests" on public.booking_requests;
create policy "authenticated_select_booking_requests"
  on public.booking_requests for select to authenticated
  using (true);

-- Публичное чтение для гостей сайта
drop policy if exists "anon_select_profiles_public" on public.profiles;
create policy "anon_select_profiles_public"
  on public.profiles for select to anon
  using (true);

drop policy if exists "anon_select_active_services" on public.services;
create policy "anon_select_active_services"
  on public.services for select to anon
  using (is_active = true);

drop policy if exists "anon_select_portfolio_items" on public.portfolio_items;
create policy "anon_select_portfolio_items"
  on public.portfolio_items for select to anon
  using (true);
