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
