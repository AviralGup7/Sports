delete from public.match_results;
delete from public.matches;
delete from public.competition_groups;
delete from public.competition_stages;

delete from public.team_sports;

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
    {"id":"moksh-goel","name":"Moksh Goel","phone":"+91-9971019074","role":"Tournament Coordinator"},
    {"id":"partho-kumar-das","name":"Partho Kumar Das","phone":"+91-7985898426","role":"Operations Coordinator"},
    {"id":"aarav-saxena","name":"Aarav Saxena","phone":"+91-9818650379","role":"Venue Coordinator"}
  ]'::jsonb
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
  ('maharashtra-mandal', 'Maharashtra Mandal', 'Maharashtra Mandal', 15, true),
  ('utkal-samaj', 'Utkal Samaj', 'P Block', 16, true)
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
  ('maharashtra-mandal', 'cricket'), ('maharashtra-mandal', 'football'), ('maharashtra-mandal', 'volleyball'), ('maharashtra-mandal', 'athletics'),
  ('utkal-samaj', 'cricket'), ('utkal-samaj', 'athletics')
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

insert into public.matches (
  id, tournament_id, sport_id, round, day, start_time, venue,
  team_a_id, team_b_id, status, next_match_id, next_slot,
  stage_id, group_id, round_index, match_number,
  winner_to_match_id, winner_to_slot, loser_to_match_id, loser_to_slot, is_bye
)
values
  ('cricket-ga-1', 'icl-2026', 'cricket', 'Group A Match 1', '2026-04-02', '10:00', 'Main Ground', 'andhra-samithi', 'capitol', 'completed', null, null, 'cricket-group-stage', 'cricket-group-a', 1, 1, null, null, null, null, false),
  ('cricket-ga-2', 'icl-2026', 'cricket', 'Group A Match 2', '2026-04-02', '13:00', 'Main Ground', 'gurjari', 'haryana-cultural', 'completed', null, null, 'cricket-group-stage', 'cricket-group-a', 1, 2, null, null, null, null, false),
  ('cricket-ga-3', 'icl-2026', 'cricket', 'Group A Match 3', '2026-04-03', '09:30', 'Main Ground', 'andhra-samithi', 'gurjari', 'completed', null, null, 'cricket-group-stage', 'cricket-group-a', 1, 3, null, null, null, null, false),
  ('cricket-ga-4', 'icl-2026', 'cricket', 'Group A Match 4', '2026-04-03', '13:00', 'Main Ground', 'capitol', 'haryana-cultural', 'completed', null, null, 'cricket-group-stage', 'cricket-group-a', 1, 4, null, null, null, null, false),
  ('cricket-gb-1', 'icl-2026', 'cricket', 'Group B Match 1', '2026-04-02', '16:00', 'Practice Oval', 'punjab-cultural', 'udgam', 'completed', null, null, 'cricket-group-stage', 'cricket-group-b', 1, 1, null, null, null, null, false),
  ('cricket-gb-2', 'icl-2026', 'cricket', 'Group B Match 2', '2026-04-02', '19:00', 'Practice Oval', 'kairali', 'madhyansh', 'completed', null, null, 'cricket-group-stage', 'cricket-group-b', 1, 2, null, null, null, null, false),
  ('cricket-gb-3', 'icl-2026', 'cricket', 'Group B Match 3', '2026-04-03', '16:00', 'Practice Oval', 'punjab-cultural', 'kairali', 'live', null, null, 'cricket-group-stage', 'cricket-group-b', 1, 3, null, null, null, null, false),
  ('cricket-gb-4', 'icl-2026', 'cricket', 'Group B Match 4', '2026-04-03', '20:00', 'Practice Oval', 'udgam', 'madhyansh', 'scheduled', null, null, 'cricket-group-stage', 'cricket-group-b', 1, 4, null, null, null, null, false),
  ('cricket-sf-1', 'icl-2026', 'cricket', 'Semi Final 1', '2026-04-04', '18:00', 'Main Ground', 'andhra-samithi', 'madhyansh', 'scheduled', 'cricket-final', 'team_a', 'cricket-knockout-stage', null, 2, 1, 'cricket-final', 'team_a', 'cricket-third', 'team_a', false),
  ('cricket-sf-2', 'icl-2026', 'cricket', 'Semi Final 2', '2026-04-04', '21:00', 'Main Ground', 'gurjari', 'udgam', 'scheduled', 'cricket-final', 'team_b', 'cricket-knockout-stage', null, 2, 2, 'cricket-final', 'team_b', 'cricket-third', 'team_b', false),
  ('cricket-third', 'icl-2026', 'cricket', 'Third Place', '2026-04-05', '16:00', 'Main Ground', null, null, 'scheduled', null, null, 'cricket-placement-stage', null, 3, 1, null, null, null, null, false),
  ('cricket-final', 'icl-2026', 'cricket', 'Grand Final', '2026-04-05', '20:00', 'Main Ground', null, null, 'scheduled', null, null, 'cricket-knockout-stage', null, 3, 1, null, null, null, null, false),
  ('football-qf-1', 'icl-2026', 'football', 'Quarter Final 1', '2026-04-03', '15:00', 'Football Turf', 'punjab-cultural', 'kannada-vedike', 'completed', 'football-sf-1', 'team_a', 'football-knockout-stage', null, 1, 1, 'football-sf-1', 'team_a', null, null, false),
  ('football-qf-2', 'icl-2026', 'football', 'Quarter Final 2', '2026-04-03', '16:15', 'Football Turf', 'pilani-tamil-mandram', 'maharashtra-mandal', 'live', 'football-sf-1', 'team_b', 'football-knockout-stage', null, 1, 2, 'football-sf-1', 'team_b', null, null, false),
  ('football-qf-3', 'icl-2026', 'football', 'Quarter Final 3', '2026-04-03', '17:30', 'Football Turf', 'andhra-samithi', 'capitol', 'completed', 'football-sf-2', 'team_a', 'football-knockout-stage', null, 1, 3, 'football-sf-2', 'team_a', null, null, false),
  ('football-qf-4', 'icl-2026', 'football', 'Quarter Final 4', '2026-04-03', '18:45', 'Football Turf', 'maurya-vihar', 'sangam', 'scheduled', 'football-sf-2', 'team_b', 'football-knockout-stage', null, 1, 4, 'football-sf-2', 'team_b', null, null, false),
  ('football-sf-1', 'icl-2026', 'football', 'Semi Final 1', '2026-04-04', '16:00', 'Football Turf', 'kannada-vedike', null, 'scheduled', 'football-final', 'team_a', 'football-knockout-stage', null, 2, 1, 'football-final', 'team_a', 'football-third', 'team_a', false),
  ('football-sf-2', 'icl-2026', 'football', 'Semi Final 2', '2026-04-04', '18:00', 'Football Turf', 'andhra-samithi', null, 'scheduled', 'football-final', 'team_b', 'football-knockout-stage', null, 2, 2, 'football-final', 'team_b', 'football-third', 'team_b', false),
  ('football-third', 'icl-2026', 'football', 'Third Place', '2026-04-05', '15:30', 'Football Turf', null, null, 'scheduled', null, null, 'football-placement-stage', null, 3, 1, null, null, null, null, false),
  ('football-final', 'icl-2026', 'football', 'Grand Final', '2026-04-05', '18:30', 'Football Turf', null, null, 'scheduled', null, null, 'football-knockout-stage', null, 3, 1, null, null, null, null, false),
  ('volleyball-qf-1', 'icl-2026', 'volleyball', 'Quarter Final 1', '2026-04-03', '11:00', 'Indoor Arena', 'sangam', null, 'completed', 'volleyball-sf-1', 'team_a', 'volleyball-knockout-stage', null, 1, 1, 'volleyball-sf-1', 'team_a', null, null, true),
  ('volleyball-qf-2', 'icl-2026', 'volleyball', 'Quarter Final 2', '2026-04-03', '12:30', 'Indoor Arena', 'udgam', 'gurjari', 'completed', 'volleyball-sf-1', 'team_b', 'volleyball-knockout-stage', null, 1, 2, 'volleyball-sf-1', 'team_b', null, null, false),
  ('volleyball-qf-3', 'icl-2026', 'volleyball', 'Quarter Final 3', '2026-04-03', '14:00', 'Indoor Arena', 'marudhara', 'andhra-samithi', 'scheduled', 'volleyball-sf-2', 'team_a', 'volleyball-knockout-stage', null, 1, 3, 'volleyball-sf-2', 'team_a', null, null, false),
  ('volleyball-qf-4', 'icl-2026', 'volleyball', 'Quarter Final 4', '2026-04-03', '15:30', 'Indoor Arena', 'kannada-vedike', 'maharashtra-mandal', 'postponed', 'volleyball-sf-2', 'team_b', 'volleyball-knockout-stage', null, 1, 4, 'volleyball-sf-2', 'team_b', null, null, false),
  ('volleyball-sf-1', 'icl-2026', 'volleyball', 'Semi Final 1', '2026-04-04', '16:30', 'Indoor Arena', 'sangam', 'udgam', 'completed', 'volleyball-final', 'team_a', 'volleyball-knockout-stage', null, 2, 1, 'volleyball-final', 'team_a', 'volleyball-third', 'team_a', false),
  ('volleyball-sf-2', 'icl-2026', 'volleyball', 'Semi Final 2', '2026-04-04', '18:00', 'Indoor Arena', null, null, 'postponed', 'volleyball-final', 'team_b', 'volleyball-knockout-stage', null, 2, 2, 'volleyball-final', 'team_b', 'volleyball-third', 'team_b', false),
  ('volleyball-third', 'icl-2026', 'volleyball', 'Third Place', '2026-04-05', '14:30', 'Indoor Arena', 'udgam', null, 'scheduled', null, null, 'volleyball-placement-stage', null, 3, 1, null, null, null, null, false),
  ('volleyball-final', 'icl-2026', 'volleyball', 'Grand Final', '2026-04-05', '17:00', 'Indoor Arena', 'sangam', null, 'scheduled', null, null, 'volleyball-knockout-stage', null, 3, 1, null, null, null, null, false),
  ('athletics-heat-1', 'icl-2026', 'athletics', '100m Heat 1', '2026-04-03', '16:15', 'Track Oval', 'punjab-cultural', 'pilani-tamil-mandram', 'completed', 'athletics-final', 'team_a', 'athletics-results-stage', null, 1, 1, null, null, null, null, false),
  ('athletics-heat-2', 'icl-2026', 'athletics', '100m Heat 2', '2026-04-03', '16:30', 'Track Oval', 'gurjari', 'utkal-samaj', 'completed', 'athletics-final', 'team_b', 'athletics-results-stage', null, 1, 2, null, null, null, null, false),
  ('athletics-final', 'icl-2026', 'athletics', '100m Final', '2026-04-05', '16:45', 'Track Oval', 'pilani-tamil-mandram', 'utkal-samaj', 'scheduled', null, null, 'athletics-results-stage', null, 2, 1, null, null, null, null, false)
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

insert into public.match_results (
  match_id, winner_team_id, team_a_score, team_b_score, decision_type, score_summary, note, updated_at
)
values
  ('cricket-ga-1', 'andhra-samithi', 148, 142, 'normal', '148/4 vs 142/7', 'Andhra defended tightly at the death.', '2026-04-02T12:10:00+05:30'),
  ('cricket-ga-2', 'gurjari', 151, 144, 'normal', '151/5 vs 144/8', 'Gurjari closed on top after a late batting burst.', '2026-04-02T15:35:00+05:30'),
  ('cricket-ga-3', 'andhra-samithi', 133, 129, 'normal', '133/7 vs 129/9', 'A low-scoring win keeps Andhra top of Group A.', '2026-04-03T11:45:00+05:30'),
  ('cricket-ga-4', 'capitol', 155, 153, 'normal', '155/6 vs 153/7', 'Capitol stayed alive with a chase in the final over.', '2026-04-03T15:10:00+05:30'),
  ('cricket-gb-1', 'udgam', 139, 141, 'normal', '139/8 vs 141/4', 'Udgam paced the chase expertly.', '2026-04-02T17:40:00+05:30'),
  ('cricket-gb-2', 'madhyansh', 121, 126, 'normal', '121/9 vs 126/5', 'Madhyansh earned the cleaner net run-rate start.', '2026-04-02T20:50:00+05:30'),
  ('cricket-gb-3', null, 67, 66, 'normal', '67/1 vs 66/3', 'Powerplay underway with Punjab narrowly ahead.', '2026-04-03T16:35:00+05:30'),
  ('football-qf-1', 'kannada-vedike', 1, 1, 'penalties', '1 - 1 (4-3 pens)', 'Kannada Vedike survived a penalty shootout.', '2026-04-03T15:55:00+05:30'),
  ('football-qf-2', null, 1, 1, 'normal', '1 - 1', 'Second half in progress.', '2026-04-03T16:55:00+05:30'),
  ('football-qf-3', 'andhra-samithi', 2, 0, 'normal', '2 - 0', 'A composed defensive display secured the shutout.', '2026-04-03T18:15:00+05:30'),
  ('volleyball-qf-1', 'sangam', 1, 0, 'walkover', 'Bye to semi-final', 'Top seed Sangam advances on a bracket bye.', '2026-04-03T11:05:00+05:30'),
  ('volleyball-qf-2', 'udgam', 2, 1, 'normal', '25-21, 18-25, 15-12', 'Udgam held firm in the decider.', '2026-04-03T13:25:00+05:30'),
  ('volleyball-sf-1', 'sangam', 3, 1, 'normal', '25-19, 22-25, 25-17, 25-20', 'Sangam reaches the final with a balanced attack.', '2026-04-04T17:40:00+05:30'),
  ('athletics-heat-1', 'pilani-tamil-mandram', 12, 11, 'normal', '11.8s vs 12.1s', 'Pilani Tamil Mandram topped Heat 1.', '2026-04-03T16:22:00+05:30'),
  ('athletics-heat-2', 'utkal-samaj', 12, 11, 'normal', '11.9s vs 12.0s', 'Photo finish separated the field in Heat 2.', '2026-04-03T16:35:00+05:30')
on conflict (match_id) do update
set winner_team_id = excluded.winner_team_id,
    team_a_score = excluded.team_a_score,
    team_b_score = excluded.team_b_score,
    decision_type = excluded.decision_type,
    score_summary = excluded.score_summary,
    note = excluded.note,
    updated_at = excluded.updated_at;

insert into public.announcements (id, title, body, visibility, pinned, published_at, is_published)
values
  ('announce-1', 'Volunteer briefing moved to 3:15 PM', 'All venue volunteers should report at the media desk 15 minutes earlier than planned for access badge pickup.', 'public', true, '2026-04-02T09:00:00+05:30', true),
  ('announce-2', 'Football quarter-final now in extra time', 'The second football quarter-final remains level and may move to penalties. Crowd access remains restricted near the benches.', 'public', false, '2026-04-03T16:50:00+05:30', true),
  ('announce-3', 'Volleyball semi-final lane updated', 'One indoor court match has been postponed after a power reset. Builder mode shows the integrity warning until the slot is rescheduled.', 'admin', false, '2026-04-03T17:10:00+05:30', true)
on conflict (id) do update
set title = excluded.title,
    body = excluded.body,
    visibility = excluded.visibility,
    pinned = excluded.pinned,
    published_at = excluded.published_at,
    is_published = excluded.is_published;

