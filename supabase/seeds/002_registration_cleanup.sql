-- One-time cleanup after importing the latest registration batch.
-- Purpose:
-- 1) Keep only the teams present in the submitted form active.
-- 2) Remove team_sports mappings for teams that are no longer active.

begin;

with latest_registration(team_id) as (
  values
    ('andhra-samithi'::text),
    ('capitol'::text),
    ('gurjari'::text),
    ('haryana-cultural'::text),
    ('punjab-cultural'::text),
    ('udgam'::text),
    ('sangam'::text),
    ('kairali'::text),
    ('kannada-vedike'::text),
    ('pilani-tamil-mandram'::text),
    ('madhyansh'::text),
    ('maurya-vihar'::text),
    ('marudhara'::text),
    ('moruchhaya'::text),
    ('maharashtra-mandal'::text)
)
update public.teams t
set is_active = exists (
  select 1
  from latest_registration r
  where r.team_id = t.id
);

with latest_registration(team_id) as (
  values
    ('andhra-samithi'::text),
    ('capitol'::text),
    ('gurjari'::text),
    ('haryana-cultural'::text),
    ('punjab-cultural'::text),
    ('udgam'::text),
    ('sangam'::text),
    ('kairali'::text),
    ('kannada-vedike'::text),
    ('pilani-tamil-mandram'::text),
    ('madhyansh'::text),
    ('maurya-vihar'::text),
    ('marudhara'::text),
    ('moruchhaya'::text),
    ('maharashtra-mandal'::text)
)
delete from public.team_sports ts
where not exists (
  select 1
  from latest_registration r
  where r.team_id = ts.team_id
);

commit;
