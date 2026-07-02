create extension if not exists "pgcrypto";

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  service text not null,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  note text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

create unique index if not exists appointments_active_slot_unique
on public.appointments (appointment_date, start_time)
where status in ('pending', 'confirmed');

alter table public.appointments enable row level security;

drop policy if exists "appointments_service_role_all" on public.appointments;
create policy "appointments_service_role_all"
on public.appointments
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
