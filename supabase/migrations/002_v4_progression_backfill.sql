update public.matches
set
  winner_to_match_id = coalesce(winner_to_match_id, next_match_id),
  winner_to_slot = coalesce(winner_to_slot, next_slot)
where next_match_id is not null;
