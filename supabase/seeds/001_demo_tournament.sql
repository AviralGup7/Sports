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
  ('capitol', 'CAPITOL', 'Capitol', 2, true),
  ('gurjari', 'GUJARAT TITANS', 'Gurjari', 3, true),
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
  ('cricket-r1-1', 'icl-2026', 'cricket', 'Round 1', '2026-04-02', '18:00', 'Main Cricket Ground', 'kairali', 'marudhara', 'scheduled', 'cricket-qf-4', 'team_a', 'cricket-knockout-stage', null, 1, 1, 'cricket-qf-4', 'team_a', null, null, false),
  ('cricket-r1-2', 'icl-2026', 'cricket', 'Round 1', '2026-04-02', '20:00', 'Main Cricket Ground', 'andhra-samithi', 'moruchhaya', 'scheduled', 'cricket-qf-4', 'team_b', 'cricket-knockout-stage', null, 1, 2, 'cricket-qf-4', 'team_b', null, null, false),
  ('cricket-r1-3', 'icl-2026', 'cricket', 'Round 1', '2026-04-02', '22:00', 'Main Cricket Ground', 'punjab-cultural', 'udgam', 'scheduled', 'cricket-qf-3', 'team_a', 'cricket-knockout-stage', null, 1, 3, 'cricket-qf-3', 'team_a', null, null, false),
  ('cricket-r1-4', 'icl-2026', 'cricket', 'Round 1', '2026-04-04', '22:00', 'Main Cricket Ground', 'haryana-cultural', 'maharashtra-mandal', 'scheduled', 'cricket-qf-3', 'team_b', 'cricket-knockout-stage', null, 1, 4, 'cricket-qf-3', 'team_b', null, null, false),
  ('cricket-r1-5', 'icl-2026', 'cricket', 'Round 1', '2026-04-05', '20:00', 'Main Cricket Ground', 'gurjari', 'maurya-vihar', 'scheduled', 'cricket-qf-2', 'team_b', 'cricket-knockout-stage', null, 1, 5, 'cricket-qf-2', 'team_b', null, null, false),
  ('cricket-r1-6', 'icl-2026', 'cricket', 'Round 1', '2026-04-05', '22:00', 'Main Cricket Ground', 'pilani-tamil-mandram', 'capitol', 'scheduled', 'cricket-qf-1', 'team_b', 'cricket-knockout-stage', null, 1, 6, 'cricket-qf-1', 'team_b', null, null, false),
  ('cricket-qf-1', 'icl-2026', 'cricket', 'Quarterfinals', '2026-04-05', '20:00', 'Overflow Cricket Slot A', 'kannada-vedike', null, 'scheduled', 'cricket-sf-1', 'team_a', 'cricket-knockout-stage', null, 2, 7, 'cricket-sf-1', 'team_a', null, null, false),
  ('cricket-qf-2', 'icl-2026', 'cricket', 'Quarterfinals', '2026-04-05', '20:00', 'Overflow Cricket Slot B', 'madhyansh', null, 'scheduled', 'cricket-sf-2', 'team_a', 'cricket-knockout-stage', null, 2, 8, 'cricket-sf-2', 'team_a', null, null, false),
  ('cricket-qf-3', 'icl-2026', 'cricket', 'Quarterfinals', '2026-04-05', '22:00', 'Overflow Cricket Slot A', null, null, 'scheduled', 'cricket-sf-1', 'team_b', 'cricket-knockout-stage', null, 2, 9, 'cricket-sf-1', 'team_b', null, null, false),
  ('cricket-qf-4', 'icl-2026', 'cricket', 'Quarterfinals', '2026-04-05', '22:00', 'Overflow Cricket Slot B', null, null, 'scheduled', 'cricket-sf-2', 'team_b', 'cricket-knockout-stage', null, 2, 10, 'cricket-sf-2', 'team_b', null, null, false),
  ('cricket-sf-1', 'icl-2026', 'cricket', 'Semifinals', '2026-04-05', '23:00', 'Overflow Cricket Semi Slot A', null, null, 'scheduled', 'cricket-final', 'team_a', 'cricket-knockout-stage', null, 3, 11, 'cricket-final', 'team_a', null, null, false),
  ('cricket-sf-2', 'icl-2026', 'cricket', 'Semifinals', '2026-04-05', '23:00', 'Overflow Cricket Semi Slot B', null, null, 'scheduled', 'cricket-final', 'team_b', 'cricket-knockout-stage', null, 3, 12, 'cricket-final', 'team_b', null, null, false),
  ('cricket-final', 'icl-2026', 'cricket', 'Final', '2026-04-05', '23:59', 'Overflow Cricket Final Slot', null, null, 'scheduled', null, null, 'cricket-knockout-stage', null, 4, 13, null, null, null, null, false),
  ('football-r1-1', 'icl-2026', 'football', 'Round 1', '2026-04-03', '20:00', 'Football Ground', 'haryana-cultural', 'gurjari', 'scheduled', 'football-qf-3', 'team_b', 'football-knockout-stage', null, 1, 1, 'football-qf-3', 'team_b', null, null, false),
  ('football-r1-2', 'icl-2026', 'football', 'Round 1', '2026-04-03', '21:00', 'Football Ground', 'pilani-tamil-mandram', 'capitol', 'scheduled', 'football-qf-1', 'team_b', 'football-knockout-stage', null, 1, 2, 'football-qf-1', 'team_b', null, null, false),
  ('football-r1-3', 'icl-2026', 'football', 'Round 1', '2026-04-03', '22:00', 'Football Ground', 'maharashtra-mandal', 'udgam', 'scheduled', 'football-qf-2', 'team_b', 'football-knockout-stage', null, 1, 3, 'football-qf-2', 'team_b', null, null, false),
  ('football-qf-1', 'icl-2026', 'football', 'Quarterfinals', '2026-04-03', '23:00', 'Football Ground', 'kannada-vedike', null, 'scheduled', 'football-sf-1', 'team_a', 'football-knockout-stage', null, 2, 4, 'football-sf-1', 'team_a', null, null, false),
  ('football-qf-2', 'icl-2026', 'football', 'Quarterfinals', '2026-04-04', '20:00', 'Football Ground', 'madhyansh', null, 'scheduled', 'football-sf-2', 'team_a', 'football-knockout-stage', null, 2, 5, 'football-sf-2', 'team_a', null, null, false),
  ('football-qf-3', 'icl-2026', 'football', 'Quarterfinals', '2026-04-04', '21:00', 'Football Ground', 'kairali', null, 'scheduled', 'football-sf-1', 'team_b', 'football-knockout-stage', null, 2, 6, 'football-sf-1', 'team_b', null, null, false),
  ('football-qf-4', 'icl-2026', 'football', 'Quarterfinals', '2026-04-04', '22:00', 'Football Ground', 'andhra-samithi', 'punjab-cultural', 'scheduled', 'football-sf-2', 'team_b', 'football-knockout-stage', null, 2, 7, 'football-sf-2', 'team_b', null, null, false),
  ('football-sf-1', 'icl-2026', 'football', 'Semifinals', '2026-04-05', '20:00', 'Football Ground', null, null, 'scheduled', 'football-final', 'team_a', 'football-knockout-stage', null, 3, 8, 'football-final', 'team_a', null, null, false),
  ('football-sf-2', 'icl-2026', 'football', 'Semifinals', '2026-04-05', '21:00', 'Football Ground', null, null, 'scheduled', 'football-final', 'team_b', 'football-knockout-stage', null, 3, 9, 'football-final', 'team_b', null, null, false),
  ('football-final', 'icl-2026', 'football', 'Final', '2026-04-05', '22:00', 'Football Ground', null, null, 'scheduled', null, null, 'football-knockout-stage', null, 4, 10, null, null, null, null, false),
  ('volleyball-r1-1', 'icl-2026', 'volleyball', 'Round 1', '2026-04-03', '18:00', 'Volleyball Court', 'gurjari', 'marudhara', 'scheduled', 'volleyball-qf-1', 'team_b', 'volleyball-knockout-stage', null, 1, 1, 'volleyball-qf-1', 'team_b', null, null, false),
  ('volleyball-qf-1', 'icl-2026', 'volleyball', 'Quarterfinals', '2026-04-03', '19:00', 'Volleyball Court', 'kannada-vedike', null, 'scheduled', 'volleyball-sf-1', 'team_a', 'volleyball-knockout-stage', null, 2, 3, 'volleyball-sf-1', 'team_a', null, null, false),
  ('volleyball-r1-2', 'icl-2026', 'volleyball', 'Round 1', '2026-04-04', '18:00', 'Volleyball Court', 'maharashtra-mandal', 'udgam', 'scheduled', 'volleyball-qf-2', 'team_b', 'volleyball-knockout-stage', null, 1, 2, 'volleyball-qf-2', 'team_b', null, null, false),
  ('volleyball-qf-2', 'icl-2026', 'volleyball', 'Quarterfinals', '2026-04-04', '19:00', 'Volleyball Court', 'madhyansh', null, 'scheduled', 'volleyball-sf-2', 'team_a', 'volleyball-knockout-stage', null, 2, 4, 'volleyball-sf-2', 'team_a', null, null, false),
  ('volleyball-qf-3', 'icl-2026', 'volleyball', 'Quarterfinals', '2026-04-05', '18:00', 'Volleyball Court', 'kairali', 'punjab-cultural', 'scheduled', 'volleyball-sf-1', 'team_b', 'volleyball-knockout-stage', null, 2, 5, 'volleyball-sf-1', 'team_b', null, null, false),
  ('volleyball-qf-4', 'icl-2026', 'volleyball', 'Quarterfinals', '2026-04-05', '19:00', 'Volleyball Court', 'andhra-samithi', 'haryana-cultural', 'scheduled', 'volleyball-sf-2', 'team_b', 'volleyball-knockout-stage', null, 2, 6, 'volleyball-sf-2', 'team_b', null, null, false),
  ('volleyball-sf-1', 'icl-2026', 'volleyball', 'Semifinals', '2026-04-05', '20:00', 'Overflow Volleyball Court Required', null, null, 'scheduled', 'volleyball-final', 'team_a', 'volleyball-knockout-stage', null, 3, 7, 'volleyball-final', 'team_a', null, null, false),
  ('volleyball-sf-2', 'icl-2026', 'volleyball', 'Semifinals', '2026-04-05', '21:00', 'Overflow Volleyball Court Required', null, null, 'scheduled', 'volleyball-final', 'team_b', 'volleyball-knockout-stage', null, 3, 8, 'volleyball-final', 'team_b', null, null, false),
  ('volleyball-final', 'icl-2026', 'volleyball', 'Final', '2026-04-05', '22:00', 'Overflow Volleyball Court Required', null, null, 'scheduled', null, null, 'volleyball-knockout-stage', null, 4, 9, null, null, null, null, false),
  ('athletics-heat-a', 'icl-2026', 'athletics', 'Heat A (Royal Challengers KV, Tigers of M.P, Abrahaminde Sandhadhikal, Andhra Samithi, PCA, HCA, GUJARAT TITANS, PTM | top 4 advance)', '2026-04-03', '18:00', 'Athletics Track', 'kannada-vedike', 'pilani-tamil-mandram', 'scheduled', null, null, 'athletics-results-stage', null, 1, 1, null, null, null, null, false),
  ('athletics-heat-b', 'icl-2026', 'athletics', 'Heat B (CAPITOL, MV7, Maharashtra Mandal, Ambulance club, Marudhara, Sangam | top 4 advance)', '2026-04-04', '18:00', 'Athletics Track', 'capitol', 'sangam', 'scheduled', null, null, 'athletics-results-stage', null, 1, 2, null, null, null, null, false),
  ('athletics-final-round', 'icl-2026', 'athletics', 'Final Round (8 qualifiers to top 4)', '2026-04-05', '18:00', 'Athletics Track', null, null, 'scheduled', null, null, 'athletics-results-stage', null, 2, 3, null, null, null, null, false),
  ('athletics-top-4', 'icl-2026', 'athletics', 'Top 4 Round (4 qualifiers to top 2)', '2026-04-05', '19:00', 'Athletics Track', null, null, 'scheduled', null, null, 'athletics-results-stage', null, 3, 4, null, null, null, null, false),
  ('athletics-top-2', 'icl-2026', 'athletics', 'Top 2 Decider', '2026-04-05', '20:00', 'Athletics Track', null, null, 'scheduled', null, null, 'athletics-results-stage', null, 4, 5, null, null, null, null, false)
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
  ('notice-brackets-apr-1', 'Updated knockout brackets published', 'Association overlap is allowed in this version. The scheduling check now only avoids the same player being forced into two live matches at the same time. Cricket, football, volleyball, and athletics have been rebuilt on that basis using the exact registered association list.', 'public', true, '2026-04-01T18:30:00.000Z', true),
  ('notice-timing-apr-1', 'Best-fit timing plan for 2 April to 5 April', '2 April: Cricket Matches 1 to 3 run from 6 PM to midnight. 3 April: Athletics Heat A and Volleyball Match 1 run from 6 PM to 8 PM, then Football Matches 1 to 4 run from 8 PM to midnight. 4 April: Athletics Heat B and Volleyball Match 2 run from 6 PM to 8 PM, then Football Matches 5 to 7 plus Cricket Match 4 run from 8 PM to midnight. 5 April: Athletics final ladder and Volleyball Matches 3 to 4 run from 6 PM to 8 PM, then Football semis and final plus Cricket Matches 5 to 7 fill the 8 PM to midnight block.', 'public', false, '2026-04-01T18:35:00.000Z', true),
  ('notice-capacity-apr-1', 'Capacity warning remains active', 'Football fits the current evening window, and athletics fits as heats. Cricket is still short by 1 slot if only one ground is used. Volleyball is still short by 3 slots if only one court is used. Overflow placeholders on the site mark the exact places where an extra cricket slot, three extra volleyball slots, or a second court are still required.', 'public', true, '2026-04-01T18:40:00.000Z', true)
on conflict (id) do update
set title = excluded.title,
    body = excluded.body,
    visibility = excluded.visibility,
    pinned = excluded.pinned,
    published_at = excluded.published_at,
    is_published = excluded.is_published;
