insert into public.tournaments (id, name, start_date, end_date, venue)
values ('iasl-2026', 'Inter Association Sports League', '2026-04-02', '2026-04-05', 'Central College Grounds')
on conflict (id) do update
set name = excluded.name,
    start_date = excluded.start_date,
    end_date = excluded.end_date,
    venue = excluded.venue;

insert into public.sports (id, name, color, rules_summary, format)
values
  ('cricket', 'Cricket', '#f59e0b', 'T20 knockout lanes with quick turnaround between evening fixtures.', '16 teams, knockout bracket, evening slots'),
  ('football', 'Football', '#22c55e', 'Short-format campus football with rolling substitutions and same-day updates.', '8 teams, knockout to final'),
  ('volleyball', 'Volleyball', '#38bdf8', 'Best-of-three sets through semis, best-of-five for the championship.', '8 teams, indoor court rotation'),
  ('athletics', 'Athletics', '#fb7185', 'Association-level heats feed finals after results are entered.', 'Track heats plus medal rounds')
on conflict (id) do update
set name = excluded.name,
    color = excluded.color,
    rules_summary = excluded.rules_summary,
    format = excluded.format;

insert into public.teams (id, name, association, seed, is_active)
values
  ('andhra-samithi', 'Andhra Samithi', 'A Block', 1, true),
  ('capitol', 'Capitol', 'B Block', 2, true),
  ('gurjari', 'Gurjari', 'C Block', 3, true),
  ('haryana-cultural', 'Haryana Cultural Association', 'D Block', 4, true),
  ('punjab-cultural', 'Punjab Cultural Association', 'E Block', 5, true),
  ('udgam', 'Udgam', 'F Block', 6, true),
  ('sangam', 'Sangam', 'G Block', 7, true),
  ('kairali', 'Kairali', 'H Block', 8, true),
  ('kannada-vedike', 'Kannada Vedike', 'I Block', 9, true),
  ('pilani-tamil-mandram', 'Pilani Tamil Mandram', 'J Block', 10, true),
  ('madhyansh', 'Madhyansh', 'K Block', 11, true),
  ('maurya-vihar', 'Maurya Vihar', 'L Block', 12, true),
  ('marudhara', 'Marudhara', 'M Block', 13, true),
  ('moruchhaya', 'Moruchhaya', 'N Block', 14, true),
  ('maharashtra-mandal', 'Maharashtra Mandal', 'O Block', 15, true),
  ('utkal-samaj', 'Utkal Samaj', 'P Block', 16, true)
on conflict (id) do update
set name = excluded.name,
    association = excluded.association,
    seed = excluded.seed,
    is_active = excluded.is_active;

delete from public.team_sports;
insert into public.team_sports (team_id, sport_id)
values
  ('andhra-samithi', 'cricket'), ('andhra-samithi', 'football'), ('andhra-samithi', 'volleyball'),
  ('capitol', 'cricket'), ('capitol', 'football'),
  ('gurjari', 'cricket'), ('gurjari', 'volleyball'), ('gurjari', 'athletics'),
  ('haryana-cultural', 'cricket'), ('haryana-cultural', 'athletics'),
  ('punjab-cultural', 'cricket'), ('punjab-cultural', 'football'), ('punjab-cultural', 'athletics'),
  ('udgam', 'cricket'), ('udgam', 'volleyball'),
  ('sangam', 'football'), ('sangam', 'volleyball'), ('sangam', 'athletics'),
  ('kairali', 'cricket'), ('kairali', 'athletics'),
  ('kannada-vedike', 'football'), ('kannada-vedike', 'volleyball'),
  ('pilani-tamil-mandram', 'football'), ('pilani-tamil-mandram', 'volleyball'), ('pilani-tamil-mandram', 'athletics'),
  ('madhyansh', 'cricket'), ('madhyansh', 'athletics'),
  ('maurya-vihar', 'cricket'), ('maurya-vihar', 'football'),
  ('marudhara', 'cricket'), ('marudhara', 'volleyball'),
  ('moruchhaya', 'cricket'), ('moruchhaya', 'athletics'),
  ('maharashtra-mandal', 'football'), ('maharashtra-mandal', 'volleyball'),
  ('utkal-samaj', 'cricket'), ('utkal-samaj', 'athletics');

insert into public.matches (id, tournament_id, sport_id, round, day, start_time, venue, team_a_id, team_b_id, status, next_match_id, next_slot)
values
  ('cricket-qf-1', 'iasl-2026', 'cricket', 'Quarter-Final', '2026-04-02', '18:00', 'Main Ground', 'andhra-samithi', 'capitol', 'completed', 'cricket-sf-1', 'team_a'),
  ('cricket-qf-2', 'iasl-2026', 'cricket', 'Quarter-Final', '2026-04-02', '20:30', 'Main Ground', 'gurjari', 'haryana-cultural', 'completed', 'cricket-sf-1', 'team_b'),
  ('cricket-sf-1', 'iasl-2026', 'cricket', 'Semi-Final', '2026-04-04', '19:00', 'Main Ground', 'andhra-samithi', 'gurjari', 'scheduled', 'cricket-final', 'team_a'),
  ('cricket-final', 'iasl-2026', 'cricket', 'Final', '2026-04-05', '21:00', 'Main Ground', null, null, 'scheduled', null, null),
  ('football-qf-1', 'iasl-2026', 'football', 'Quarter-Final', '2026-04-03', '16:00', 'Football Turf', 'punjab-cultural', 'kannada-vedike', 'completed', 'football-final', 'team_a'),
  ('football-qf-2', 'iasl-2026', 'football', 'Quarter-Final', '2026-04-03', '17:15', 'Football Turf', 'pilani-tamil-mandram', 'maharashtra-mandal', 'live', 'football-final', 'team_b'),
  ('football-final', 'iasl-2026', 'football', 'Final', '2026-04-05', '18:30', 'Football Turf', 'kannada-vedike', null, 'scheduled', null, null),
  ('volleyball-sf-1', 'iasl-2026', 'volleyball', 'Semi-Final', '2026-04-03', '16:30', 'Indoor Arena', 'udgam', 'sangam', 'completed', 'volleyball-final', 'team_a'),
  ('volleyball-sf-2', 'iasl-2026', 'volleyball', 'Semi-Final', '2026-04-03', '18:00', 'Indoor Arena', 'gurjari', 'marudhara', 'scheduled', 'volleyball-final', 'team_b'),
  ('volleyball-final', 'iasl-2026', 'volleyball', 'Final', '2026-04-05', '17:00', 'Indoor Arena', 'sangam', null, 'scheduled', null, null),
  ('athletics-heat-1', 'iasl-2026', 'athletics', '100m Heat', '2026-04-03', '16:15', 'Track Oval', 'punjab-cultural', 'pilani-tamil-mandram', 'completed', 'athletics-final', 'team_a'),
  ('athletics-heat-2', 'iasl-2026', 'athletics', '100m Heat', '2026-04-03', '16:30', 'Track Oval', 'gurjari', 'utkal-samaj', 'completed', 'athletics-final', 'team_b'),
  ('athletics-final', 'iasl-2026', 'athletics', '100m Final', '2026-04-05', '16:45', 'Track Oval', 'pilani-tamil-mandram', 'utkal-samaj', 'scheduled', null, null)
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
    next_slot = excluded.next_slot;

insert into public.match_results (match_id, winner_team_id, score_summary, note, updated_at)
values
  ('cricket-qf-1', 'andhra-samithi', '146/6 vs 142/8', 'A tight finish decided in the final over.', '2026-04-02T21:40:00+05:30'),
  ('cricket-qf-2', 'gurjari', '151/5 vs 118 all out', 'Gurjari controlled the chase after the powerplay.', '2026-04-02T23:10:00+05:30'),
  ('football-qf-1', 'kannada-vedike', '2 - 1', 'Late counterattack sealed the fixture.', '2026-04-03T17:00:00+05:30'),
  ('football-qf-2', null, '1 - 1', 'Second half in progress.', '2026-04-03T17:40:00+05:30'),
  ('volleyball-sf-1', 'sangam', '25-19, 18-25, 15-11', 'Sangam recovered after dropping the second set.', '2026-04-03T18:10:00+05:30'),
  ('athletics-heat-1', 'pilani-tamil-mandram', '11.8s vs 12.1s', 'Top two qualified for the finals pool.', '2026-04-03T16:20:00+05:30'),
  ('athletics-heat-2', 'utkal-samaj', '11.9s vs 12.0s', 'Photo finish separated the field.', '2026-04-03T16:35:00+05:30')
on conflict (match_id) do update
set winner_team_id = excluded.winner_team_id,
    score_summary = excluded.score_summary,
    note = excluded.note,
    updated_at = excluded.updated_at;

insert into public.announcements (id, title, body, visibility, pinned, published_at, is_published)
values
  ('announce-1', 'Volunteer briefing moved to 3:15 PM', 'All venue volunteers should report at the media desk 15 minutes earlier than planned for access badge pickup.', 'public', true, '2026-04-02T09:00:00+05:30', true),
  ('announce-2', 'Football turf access restricted', 'Only players, coaches, and registered photographers will be allowed near the touchline during knockout fixtures.', 'public', false, '2026-04-03T12:15:00+05:30', true),
  ('announce-3', 'Admin data export check', 'Organizers should verify the evening JSON export after result entry so the backup remains current.', 'admin', false, '2026-04-03T13:00:00+05:30', true)
on conflict (id) do update
set title = excluded.title,
    body = excluded.body,
    visibility = excluded.visibility,
    pinned = excluded.pinned,
    published_at = excluded.published_at,
    is_published = excluded.is_published;
