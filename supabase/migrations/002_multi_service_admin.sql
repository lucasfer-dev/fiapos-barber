-- Suporte a vários serviços por agendamento.
create table if not exists public.appointment_services (
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete restrict,
  price_snapshot numeric(10,2) not null check (price_snapshot >= 0),
  duration_snapshot int not null check (duration_snapshot > 0),
  primary key (appointment_id, service_id)
);
alter table public.appointment_services enable row level security;
create policy "admin manage appointment services" on public.appointment_services for all using(public.is_admin()) with check(public.is_admin());
create policy "client read own appointment services" on public.appointment_services for select using(
  exists(
    select 1 from public.appointments a
    join public.clients c on c.id = a.client_id
    where a.id = appointment_id and c.profile_id = auth.uid()
  )
);

-- service_id legado fica opcional para permitir migração gradual dos registros existentes.
alter table public.appointments alter column service_id drop not null;