-- Creates one smoke-test live match + score so you can confirm admin/public live score wiring.
-- Safe to run multiple times due deterministic IDs and upsert.

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
values (
  'smoke-live-1',
  'icl-2026',
  'football',
  'Live Smoke Test',
  current_date,
  '18:00',
  'Football Turf',
  'punjab-cultural',
  'kannada-vedike',
  'live',
  'football-knockout-stage',
  null,
  1,
  999,
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

insert into public.match_results (
  match_id,
  winner_team_id,
  team_a_score,
  team_b_score,
  decision_type,
  score_summary,
  note,
  updated_at
)
values (
  'smoke-live-1',
  null,
  1,
  0,
  'normal',
  '1 - 0 (Live)',
  'Smoke test row for live-score validation.',
  timezone('utc', now())
)
on conflict (match_id) do update
set winner_team_id = excluded.winner_team_id,
    team_a_score = excluded.team_a_score,
    team_b_score = excluded.team_b_score,
    decision_type = excluded.decision_type,
    score_summary = excluded.score_summary,
    note = excluded.note,
    updated_at = excluded.updated_at;
