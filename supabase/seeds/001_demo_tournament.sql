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
  '[
    {"id":"contact-1","name":"Moksh Goel","phone":"+91-9876543210","role":"Tournament Lead"},
    {"id":"contact-2","name":"Aarav Sharma","phone":"+91-9876501234","role":"Fixtures"},
    {"id":"contact-3","name":"Nisha Verma","phone":"+91-9876505678","role":"Operations"}
  ]'::jsonb
)
on conflict (tournament_id) do update
set logo_asset_path = excluded.logo_asset_path,
    contacts_json = excluded.contacts_json;

insert into public.sports (id, name, color, rules_summary, format)
values
  ('cricket', 'Cricket', '#f59e0b', '14-team knockout with two byes into the quarter-finals and a venue-tight closeout that still needs one extra cricket slot.', '14 teams, Round 1 plus quarter-finals, semis, and final'),
  ('football', 'Football', '#22c55e', '11-team cup bracket with five byes into the quarter-finals and a full finals-night finish that fits the evening plan.', '11 teams, Round 1 plus quarter-finals, semis, and final'),
  ('volleyball', 'Volleyball', '#38bdf8', '10-team ladder with six byes into the quarter-finals; the bracket is exact, but three extra court slots or a second court are still required.', '10 teams, Round 1 plus quarter-finals, semis, and final'),
  ('athletics', 'Athletics', '#fb7185', 'Two heat cards feed an 8-association final round, then top 4, top 2, and the final winner run.', '14 entries, 2 heats into a three-step final ladder')
on conflict (id) do update
set name = excluded.name,
    color = excluded.color,
    rules_summary = excluded.rules_summary,
    format = excluded.format;

insert into public.teams (id, name, association, seed, is_active)
values
  ('andhra-samithi', 'Andhra Samithi', 'Andhra Samithi', 1, true),
  ('capitol', 'Capitol', 'Capitol', 2, true),
  ('gurjari', 'GUJARAT TITANS', 'Gurjari', 3, true),
  ('haryana-cultural', 'HCA', 'Haryana Cultural Association', 4, true),
  ('punjab-cultural', 'PCA', 'Punjab Cultural Association', 5, true),
  ('udgam', 'Ambulance club', 'Udgam', 6, true),
  ('sangam', 'Sangam', 'Sangam', 7, true),
  ('kairali', 'Abrahaminde Sandhadhikal', 'Kairali', 8, true),
  ('kannada-vedike', 'Royal Challengers KV', 'Kannada Vedike', 9, true),
  ('pilani-tamil-mandram', 'PTM', 'Pilani Tamil Mandram', 10, true),
  ('madhyansh', 'Tigers of MP', 'Madhyansh', 11, true),
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
  ('cricket-knockout-stage', 'cricket', 'knockout', 'Knockout Bracket', 1, 1, true),
  ('football-knockout-stage', 'football', 'knockout', 'Cup Bracket', 1, 1, true),
  ('volleyball-knockout-stage', 'volleyball', 'knockout', 'Championship Ladder', 1, 1, true),
  ('athletics-results-stage', 'athletics', 'group', 'Heat and Finals Cards', 1, 0, true)
on conflict (id) do update
set sport_id = excluded.sport_id,
    type = excluded.type,
    label = excluded.label,
    order_index = excluded.order_index,
    advances_count = excluded.advances_count,
    is_active = excluded.is_active;

insert into public.matches (
  id, tournament_id, sport_id, round, day, start_time, venue, team_a_id, team_b_id, status,
  next_match_id, next_slot, stage_id, group_id, round_index, match_number,
  winner_to_match_id, winner_to_slot, loser_to_match_id, loser_to_slot, is_bye
)
values
  ('cricket-r1-1', 'icl-2026', 'cricket', 'Round 1', '2026-04-02', '18:00', 'Main Cricket Ground', 'haryana-cultural', 'marudhara', 'scheduled', null, null, 'cricket-knockout-stage', null, 1, 1, null, null, null, null, false),
  ('cricket-r1-2', 'icl-2026', 'cricket', 'Round 1', '2026-04-02', '19:30', 'Main Cricket Ground', 'madhyansh', 'maurya-vihar', 'scheduled', null, null, 'cricket-knockout-stage', null, 1, 2, null, null, null, null, false),
  ('cricket-r1-3', 'icl-2026', 'cricket', 'Round 1', '2026-04-02', '21:00', 'Main Cricket Ground', 'maharashtra-mandal', 'sangam', 'scheduled', null, null, 'cricket-knockout-stage', null, 1, 3, null, null, null, null, false),
  ('cricket-r1-4', 'icl-2026', 'cricket', 'Round 1', '2026-04-02', '22:30', 'Main Cricket Ground', 'andhra-samithi', 'capitol', 'scheduled', null, null, 'cricket-knockout-stage', null, 1, 4, null, null, null, null, false)
on conflict (id) do update
set tournament_id = excluded.tournament_id,
    sport_id = excluded.sport_id,
    round = excluded.round,
    day = excluded.day,
    start_time = excluded.start_time,
    venue = excluded.venue,
    team_a_id = excluded.team_a_id,
    team_b_id = excluded.team_b_id,
    status = excluded.status,
    next_match_id = excluded.next_match_id,
    next_slot = excluded.next_slot,
    stage_id = excluded.stage_id,
    group_id = excluded.group_id,
    round_index = excluded.round_index,
    match_number = excluded.match_number,
    winner_to_match_id = excluded.winner_to_match_id,
    winner_to_slot = excluded.winner_to_slot,
    loser_to_match_id = excluded.loser_to_match_id,
    loser_to_slot = excluded.loser_to_slot,
    is_bye = excluded.is_bye;

insert into public.announcements (id, title, body, visibility, pinned, published_at, is_published)
values
  ('notice-fixtures-apr-2', '2 April fixtures', '6:00 PM to 7:30 PM: HCA vs Marudhara. 7:30 PM to 9:00 PM: Tigers of MP vs MV7. 9:00 PM to 10:30 PM: Maharashtra Mandal vs Sangam. 10:30 PM to 12:00 AM: Andhra Samithi vs Capitol.', 'public', true, '2026-04-01T18:30:00.000Z', true)
on conflict (id) do update
set title = excluded.title,
    body = excluded.body,
    visibility = excluded.visibility,
    pinned = excluded.pinned,
    published_at = excluded.published_at,
    is_published = excluded.is_published;
