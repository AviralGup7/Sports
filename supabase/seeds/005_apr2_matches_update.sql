-- April 2 fixture update (requested slots)
-- Teams mapped:
-- HCA -> haryana-cultural
-- Marudhara -> marudhara
-- Tigers of MP -> madhyansh
-- MV7 -> maurya-vihar
-- Maharashtra Mandal -> maharashtra-mandal
-- Sangam -> sangam
-- Andhra Samithi -> andhra-samithi
-- Capitol -> capitol

begin;

-- Remove any existing cricket fixtures in the same day/time slots to avoid duplicates.
delete from public.matches
where sport_id = 'cricket'
  and day = '2026-04-02'
  and start_time in ('06:00', '07:30', '09:00', '10:30');

insert into public.matches (
  id,
  tournament_id,
  sport_id,
  round,
  day,
  start_time,
  venue,
  team_a_id,
  team_b_id,
  status,
  stage_id,
  group_id,
  round_index,
  match_number,
  winner_to_match_id,
  winner_to_slot,
  loser_to_match_id,
  loser_to_slot,
  next_match_id,
  next_slot,
  is_bye
)
values
  (
    'cricket-apr2-0600-hca-vs-marudhara',
    'icl-2026',
    'cricket',
    'April 2 Match 1',
    '2026-04-02',
    '06:00',
    'Main Ground',
    'haryana-cultural',
    'marudhara',
    'scheduled',
    null,
    null,
    1,
    1,
    null,
    null,
    null,
    null,
    null,
    null,
    false
  ),
  (
    'cricket-apr2-0730-madhyansh-vs-maurya-vihar',
    'icl-2026',
    'cricket',
    'April 2 Match 2',
    '2026-04-02',
    '07:30',
    'Main Ground',
    'madhyansh',
    'maurya-vihar',
    'scheduled',
    null,
    null,
    1,
    2,
    null,
    null,
    null,
    null,
    null,
    null,
    false
  ),
  (
    'cricket-apr2-0900-maharashtra-mandal-vs-sangam',
    'icl-2026',
    'cricket',
    'April 2 Match 3',
    '2026-04-02',
    '09:00',
    'Main Ground',
    'maharashtra-mandal',
    'sangam',
    'scheduled',
    null,
    null,
    1,
    3,
    null,
    null,
    null,
    null,
    null,
    null,
    false
  ),
  (
    'cricket-apr2-1030-andhra-samithi-vs-capitol',
    'icl-2026',
    'cricket',
    'April 2 Match 4',
    '2026-04-02',
    '10:30',
    'Main Ground',
    'andhra-samithi',
    'capitol',
    'scheduled',
    null,
    null,
    1,
    4,
    null,
    null,
    null,
    null,
    null,
    null,
    false
  )
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
    stage_id = excluded.stage_id,
    group_id = excluded.group_id,
    round_index = excluded.round_index,
    match_number = excluded.match_number,
    winner_to_match_id = excluded.winner_to_match_id,
    winner_to_slot = excluded.winner_to_slot,
    loser_to_match_id = excluded.loser_to_match_id,
    loser_to_slot = excluded.loser_to_slot,
    next_match_id = excluded.next_match_id,
    next_slot = excluded.next_slot,
    is_bye = excluded.is_bye;

commit;
