create table if not exists public.tournament_settings (
  tournament_id text primary key references public.tournaments(id) on delete cascade,
  logo_asset_path text not null default '/branding/icasl-logo.png',
  contacts_json jsonb not null default '[]'::jsonb
);

alter table public.tournament_settings enable row level security;

drop policy if exists "tournament settings public read" on public.tournament_settings;
drop policy if exists "tournament settings super admin write" on public.tournament_settings;

create policy "tournament settings public read" on public.tournament_settings
for select using (true);

create policy "tournament settings super admin write" on public.tournament_settings
for all using (public.current_app_role() = 'super_admin')
with check (public.current_app_role() = 'super_admin');
