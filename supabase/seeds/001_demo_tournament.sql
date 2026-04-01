delete from public.match_results;
delete from public.matches;
delete from public.competition_groups;
delete from public.competition_stages;
delete from public.announcements;

delete from public.team_sports;

create table if not exists public.tournament_settings (
  tournament_id text primary key references public.tournaments(id) on delete cascade,
  logo_asset_path text not null default '/branding/icasl-logo.png',
  contacts_json jsonb not null default '[]'::jsonb
);

insert into public.tournaments (id, name, start_date, end_date, venue)
values ('icl-2026', 'Inter-Assoc Cultural Sports League', '2026-04-02', '2026-04-05', 'GYMG & MedC Grounds')
on conflict (id) do update
set name = excluded.name,
    start_date = excluded.start_date,
    end_date = excluded.end_date,
    venue = excluded.venue;

insert into public.tournament_settings (tournament_id, logo_asset_path, contacts_json)
values (
  'icl-2026',
  '/branding/icasl-logo.png',
  '[]'::jsonb
)
on conflict (tournament_id) do update
set logo_asset_path = excluded.logo_asset_path,
    contacts_json = excluded.contacts_json;

insert into public.sports (id, name, color, rules_summary, format)
values
  ('cricket', 'Cricket', '#f59e0b', 'T20 pool play narrows into knockout nights with a third-place board and seeded crossovers.', '8 teams, 2 groups, knockout plus bronze'),
  ('football', 'Football', '#22c55e', 'Campus cup knockout with a third-place playoff and explicit penalty/late-change result handling.', '8 teams, knockout plus bronze'),
  ('volleyball', 'Volleyball', '#38bdf8', 'Indoor bracket with byes, compact quarter-finals, and a live finals path.', '7 teams, bye-aware knockout plus bronze'),
  ('athletics', 'Athletics', '#fb7185', 'Association result cards for heats and medal rounds, kept separate from bracket generation.', 'Track heats plus medal rounds')
on conflict (id) do update
set name = excluded.name,
    color = excluded.color,
    rules_summary = excluded.rules_summary,
    format = excluded.format;

insert into public.teams (id, name, association, seed, is_active)
values
  ('andhra-samithi', 'Andhra Samithi', 'Andhra Samithi', 1, true),
  ('capitol', 'Capitol', 'Capitol', 2, true),
  ('gurjari', 'Gujarat Titans', 'Gurjari', 3, true),
  ('haryana-cultural', 'HCA', 'Haryana Cultural Association', 4, true),
  ('punjab-cultural', 'PCA', 'Punjab Cultural Association', 5, true),
  ('udgam', 'Ambulance club', 'Udgam', 6, true),
  ('sangam', 'Sangam', 'Sangam', 7, true),
  ('kairali', 'Abrahaminde Sandhadhikal', 'Kairali', 8, true),
  ('kannada-vedike', 'Royal Challengers KV', 'Kannada Vedike', 9, true),
  ('pilani-tamil-mandram', 'PTM', 'Pilani Tamil Mandram', 10, true),
  ('madhyansh', 'Tigers of M.P', 'Madhyansh', 11, true),
  ('maurya-vihar', 'MV7', 'Maurya Vihar', 12, true),
  ('marudhara', 'Marudhara', 'Marudhara', 13, true),
  ('moruchhaya', 'Moruchhaya', 'Moruchhaya', 14, true),
  ('maharashtra-mandal', 'Maharashtra Mandal', 'Maharashtra Mandal', 15, true)
on conflict (id) do update
set name = excluded.name,
    association = excluded.association,
    seed = excluded.seed,
    is_active = excluded.is_active;

insert into public.team_sports (team_id, sport_id)
values
  ('andhra-samithi', 'cricket'), ('andhra-samithi', 'football'), ('andhra-samithi', 'volleyball'), ('andhra-samithi', 'athletics'),
  ('capitol', 'cricket'), ('capitol', 'football'), ('capitol', 'athletics'),
  ('gurjari', 'cricket'), ('gurjari', 'football'), ('gurjari', 'volleyball'), ('gurjari', 'athletics'),
  ('haryana-cultural', 'cricket'), ('haryana-cultural', 'football'), ('haryana-cultural', 'volleyball'), ('haryana-cultural', 'athletics'),
  ('punjab-cultural', 'cricket'), ('punjab-cultural', 'football'), ('punjab-cultural', 'volleyball'), ('punjab-cultural', 'athletics'),
  ('udgam', 'cricket'), ('udgam', 'football'), ('udgam', 'volleyball'), ('udgam', 'athletics'),
  ('sangam', 'athletics'),
  ('kairali', 'cricket'), ('kairali', 'football'), ('kairali', 'volleyball'), ('kairali', 'athletics'),
  ('kannada-vedike', 'cricket'), ('kannada-vedike', 'football'), ('kannada-vedike', 'volleyball'),
  ('pilani-tamil-mandram', 'cricket'), ('pilani-tamil-mandram', 'football'), ('pilani-tamil-mandram', 'athletics'),
  ('madhyansh', 'cricket'), ('madhyansh', 'football'), ('madhyansh', 'volleyball'), ('madhyansh', 'athletics'),
  ('maurya-vihar', 'cricket'), ('maurya-vihar', 'athletics'),
  ('marudhara', 'cricket'), ('marudhara', 'volleyball'), ('marudhara', 'athletics'),
  ('moruchhaya', 'cricket'),
  ('maharashtra-mandal', 'cricket'), ('maharashtra-mandal', 'football'), ('maharashtra-mandal', 'volleyball'), ('maharashtra-mandal', 'athletics')
on conflict do nothing;

insert into public.competition_stages (id, sport_id, type, label, order_index, advances_count, is_active)
values
  ('cricket-group-stage', 'cricket', 'group', 'Pool Stage', 1, 2, true),
  ('cricket-knockout-stage', 'cricket', 'knockout', 'Championship Bracket', 2, 1, true),
  ('cricket-placement-stage', 'cricket', 'placement', 'Bronze Match', 3, 0, true),
  ('football-knockout-stage', 'football', 'knockout', 'Cup Bracket', 1, 1, true),
  ('football-placement-stage', 'football', 'placement', 'Third Place', 2, 0, true),
  ('volleyball-knockout-stage', 'volleyball', 'knockout', 'Championship Ladder', 1, 1, true),
  ('volleyball-placement-stage', 'volleyball', 'placement', 'Bronze Match', 2, 0, true),
  ('athletics-results-stage', 'athletics', 'group', 'Results Cards', 1, 0, true)
on conflict (id) do update
set sport_id = excluded.sport_id,
    type = excluded.type,
    label = excluded.label,
    order_index = excluded.order_index,
    advances_count = excluded.advances_count,
    is_active = excluded.is_active;

insert into public.competition_groups (id, stage_id, sport_id, code, order_index)
values
  ('cricket-group-a', 'cricket-group-stage', 'cricket', 'Group A', 1),
  ('cricket-group-b', 'cricket-group-stage', 'cricket', 'Group B', 2)
on conflict (id) do update
set stage_id = excluded.stage_id,
    sport_id = excluded.sport_id,
    code = excluded.code,
    order_index = excluded.order_index;
