create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (role in ('super_admin', 'sport_admin'))
);

create table if not exists public.sports (
  id text primary key,
  name text not null unique,
  color text not null,
  rules_summary text not null,
  format text not null
);

create table if not exists public.teams (
  id text primary key,
  name text not null unique,
  association text not null,
  seed integer not null,
  is_active boolean not null default true
);

create table if not exists public.team_sports (
  team_id text not null references public.teams(id) on delete cascade,
  sport_id text not null references public.sports(id) on delete cascade,
  primary key (team_id, sport_id)
);

create table if not exists public.tournaments (
  id text primary key,
  name text not null,
  start_date date not null,
  end_date date not null,
  venue text not null
);

create table if not exists public.matches (
  id text primary key,
  tournament_id text not null references public.tournaments(id) on delete cascade,
  sport_id text not null references public.sports(id) on delete cascade,
  round text not null,
  day date not null,
  start_time time not null,
  venue text not null,
  team_a_id text references public.teams(id) on delete set null,
  team_b_id text references public.teams(id) on delete set null,
  status text not null check (status in ('scheduled', 'live', 'completed')),
  next_match_id text references public.matches(id) on delete set null,
  next_slot text check (next_slot in ('team_a', 'team_b'))
);

create table if not exists public.match_results (
  match_id text primary key references public.matches(id) on delete cascade,
  winner_team_id text references public.teams(id) on delete set null,
  score_summary text,
  note text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.announcements (
  id text primary key,
  title text not null,
  body text not null,
  visibility text not null check (visibility in ('public', 'admin')),
  pinned boolean not null default false,
  published_at timestamptz not null default timezone('utc', now()),
  is_published boolean not null default false
);

create table if not exists public.admin_sports (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  sport_id text not null references public.sports(id) on delete cascade,
  primary key (profile_id, sport_id)
);

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid()
$$;

create or replace function public.can_manage_sport(target_sport_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role = 'super_admin'
    )
    or exists (
      select 1
      from public.admin_sports
      join public.profiles on public.profiles.id = public.admin_sports.profile_id
      where public.admin_sports.profile_id = auth.uid()
        and public.admin_sports.sport_id = target_sport_id
        and public.profiles.role = 'sport_admin'
    )
$$;

alter table public.profiles enable row level security;
alter table public.sports enable row level security;
alter table public.teams enable row level security;
alter table public.team_sports enable row level security;
alter table public.tournaments enable row level security;
alter table public.matches enable row level security;
alter table public.match_results enable row level security;
alter table public.announcements enable row level security;
alter table public.admin_sports enable row level security;

drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "sports public read" on public.sports;
drop policy if exists "sports admin write" on public.sports;
drop policy if exists "teams public read" on public.teams;
drop policy if exists "teams admin write" on public.teams;
drop policy if exists "team_sports public read" on public.team_sports;
drop policy if exists "team_sports admin write" on public.team_sports;
drop policy if exists "tournaments public read" on public.tournaments;
drop policy if exists "tournaments super admin write" on public.tournaments;
drop policy if exists "matches public read" on public.matches;
drop policy if exists "matches admin write" on public.matches;
drop policy if exists "match_results public read" on public.match_results;
drop policy if exists "match_results admin write" on public.match_results;
drop policy if exists "announcements public read" on public.announcements;
drop policy if exists "announcements admin write" on public.announcements;
drop policy if exists "admin_sports self read" on public.admin_sports;
drop policy if exists "admin_sports super admin write" on public.admin_sports;

create policy "profiles self read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles self update" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);

create policy "sports public read" on public.sports
for select using (true);

create policy "sports admin write" on public.sports
for all using (public.current_app_role() = 'super_admin')
with check (public.current_app_role() = 'super_admin');

create policy "teams public read" on public.teams
for select using (is_active = true or public.current_app_role() in ('super_admin', 'sport_admin'));

create policy "teams admin write" on public.teams
for all using (public.current_app_role() in ('super_admin', 'sport_admin'))
with check (public.current_app_role() in ('super_admin', 'sport_admin'));

create policy "team_sports public read" on public.team_sports
for select using (true);

create policy "team_sports admin write" on public.team_sports
for all using (public.current_app_role() in ('super_admin', 'sport_admin'))
with check (public.current_app_role() in ('super_admin', 'sport_admin'));

create policy "tournaments public read" on public.tournaments
for select using (true);

create policy "tournaments super admin write" on public.tournaments
for all using (public.current_app_role() = 'super_admin')
with check (public.current_app_role() = 'super_admin');

create policy "matches public read" on public.matches
for select using (true);

create policy "matches admin write" on public.matches
for all using (public.can_manage_sport(sport_id))
with check (public.can_manage_sport(sport_id));

create policy "match_results public read" on public.match_results
for select using (true);

create policy "match_results admin write" on public.match_results
for all using (
  exists (
    select 1 from public.matches
    where public.matches.id = public.match_results.match_id
      and public.can_manage_sport(public.matches.sport_id)
  )
)
with check (
  exists (
    select 1 from public.matches
    where public.matches.id = public.match_results.match_id
      and public.can_manage_sport(public.matches.sport_id)
  )
);

create policy "announcements public read" on public.announcements
for select using (
  (visibility = 'public' and is_published = true)
  or public.current_app_role() in ('super_admin', 'sport_admin')
);

create policy "announcements admin write" on public.announcements
for all using (public.current_app_role() in ('super_admin', 'sport_admin'))
with check (public.current_app_role() in ('super_admin', 'sport_admin'));

create policy "admin_sports self read" on public.admin_sports
for select using (profile_id = auth.uid() or public.current_app_role() = 'super_admin');

create policy "admin_sports super admin write" on public.admin_sports
for all using (public.current_app_role() = 'super_admin')
with check (public.current_app_role() = 'super_admin');
