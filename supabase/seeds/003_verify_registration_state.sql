-- Verification queries for latest registration import.
-- Run this in Supabase SQL Editor after seeding/cleanup.

-- 1) Active teams and mapped sports
select
  t.id,
  t.name,
  t.association,
  t.is_active,
  coalesce(string_agg(ts.sport_id, ', ' order by ts.sport_id), '') as sports
from public.teams t
left join public.team_sports ts on ts.team_id = t.id
group by t.id, t.name, t.association, t.is_active
order by t.is_active desc, t.seed asc, t.id asc;

-- 2) Quick check for key updated team names
select id, name, association
from public.teams
where id in (
  'kannada-vedike',
  'madhyansh',
  'kairali',
  'pilani-tamil-mandram',
  'gurjari',
  'udgam',
  'haryana-cultural',
  'punjab-cultural',
  'maurya-vihar'
)
order by id;

-- 3) Count active teams expected from latest batch
select count(*) as active_team_count
from public.teams
where is_active = true;

-- 4) Live score health check (admin updates should appear here)
select
  m.id,
  m.status,
  m.sport_id,
  m.round,
  m.team_a_id,
  m.team_b_id,
  mr.score_summary,
  mr.team_a_score,
  mr.team_b_score,
  mr.updated_at
from public.matches m
left join public.match_results mr on mr.match_id = m.id
where m.status in ('live', 'completed')
order by m.day desc, m.start_time desc
limit 20;

-- 5) April 2 fixture check (requested update)
select
  m.id,
  m.day,
  m.start_time,
  m.round,
  ta.name as team_a,
  tb.name as team_b,
  m.status,
  m.venue
from public.matches m
left join public.teams ta on ta.id = m.team_a_id
left join public.teams tb on tb.id = m.team_b_id
where m.day = '2026-04-02'
  and m.sport_id = 'cricket'
  and m.start_time in ('06:00', '07:30', '09:00', '10:30')
order by m.start_time;
