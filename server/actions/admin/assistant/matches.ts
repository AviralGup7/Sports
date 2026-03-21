import { canManageSport } from "@/server/auth";

import type { CommandContext, CommandResult, MatchRow, TeamRow } from "./types";
import { getLoserTeamId, normalizeText, normalizeTime } from "./utils";

async function getManagedMatch(context: CommandContext, matchId: string) {
  const { profile, supabase } = context;

  const { data: match, error } = await supabase
    .from("matches")
    .select("id, sport_id, day, start_time, venue, status, team_a_id, team_b_id, winner_to_match_id, winner_to_slot, loser_to_match_id, loser_to_slot, is_bye")
    .eq("id", matchId)
    .maybeSingle<MatchRow>();

  if (error || !match) {
    throw new Error(error?.message ?? `Match "${matchId}" was not found.`);
  }

  if (!canManageSport(profile, match.sport_id)) {
    throw new Error("You cannot manage that sport.");
  }

  return match;
}

async function resolveWinnerTeamId(context: CommandContext, match: MatchRow, rawWinner: string) {
  const normalizedWinner = normalizeText(rawWinner);

  if (!normalizedWinner) {
    return null;
  }

  if (["team a", "home", "home team"].includes(normalizedWinner)) {
    return match.team_a_id;
  }

  if (["team b", "away", "away team"].includes(normalizedWinner)) {
    return match.team_b_id;
  }

  if (rawWinner === match.team_a_id || rawWinner === match.team_b_id) {
    return rawWinner;
  }

  const teamIds = [match.team_a_id, match.team_b_id].filter((value): value is string => Boolean(value));
  if (teamIds.length === 0) {
    return null;
  }

  const { data: teams } = await context.supabase.from("teams").select("id, name").in("id", teamIds).returns<TeamRow[]>();
  const matchingTeams = (teams ?? []).filter((team) => {
    const normalizedName = normalizeText(team.name);
    return normalizedName === normalizedWinner || normalizedName.includes(normalizedWinner) || normalizedWinner.includes(normalizedName);
  });

  if (matchingTeams.length === 1) {
    return matchingTeams[0].id;
  }

  return null;
}

export async function runRescheduleCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^(?:move|reschedule|change time for|change match)\s+(?:match\s+)?([a-z0-9-]+)\s+(?:to|for)\s+(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})(?:\s+at\s+(.+))?$/i);

  if (!match) {
    throw new Error("Use reschedule commands like: move cricket-final to 2026-04-05 18:30 at Main Ground.");
  }

  const [, matchId, day, rawTime, venue] = match;
  const normalizedTime = normalizeTime(rawTime);

  if (!normalizedTime) {
    throw new Error("Use a valid 24-hour time like 18:30.");
  }

  const sourceMatch = await getManagedMatch(context, matchId);
  const payload = venue?.trim()
    ? { day, start_time: normalizedTime, venue: venue.trim() }
    : { day, start_time: normalizedTime };

  const { error } = await context.supabase.from("matches").update(payload).eq("id", sourceMatch.id);
  if (error) {
    throw new Error(error.message);
  }

  return {
    message: `Match "${sourceMatch.id}" moved to ${day} ${normalizedTime}.`,
    sportIds: [sourceMatch.sport_id],
    matchId: sourceMatch.id
  };
}

export async function runStatusCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^(?:status|set status|mark|update status)\s+(?:match\s+)?([a-z0-9-]+)\s+(?:to\s+)?(scheduled|live|completed|postponed|cancelled)$/i);

  if (!match) {
    throw new Error("Use status commands like: status football-qf-2 live.");
  }

  const [, matchId, nextStatus] = match;
  const sourceMatch = await getManagedMatch(context, matchId);

  const { error } = await context.supabase.from("matches").update({ status: nextStatus.toLowerCase() as MatchRow["status"] }).eq("id", sourceMatch.id);
  if (error) {
    throw new Error(error.message);
  }

  return {
    message: `Match "${sourceMatch.id}" marked ${nextStatus.toLowerCase()}.`,
    sportIds: [sourceMatch.sport_id],
    matchId: sourceMatch.id
  };
}

export async function runResultCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^(?:result|score|update result)\s+(?:match\s+)?([a-z0-9-]+)\s+(?:winner\s+)?(.+?)\s+score\s+(\d+)\s*[-:]\s*(\d+)(?:\s+note\s+([\s\S]+))?$/i);

  if (!match) {
    throw new Error("Use result commands like: result football-qf-2 winner Pilani Tamil Mandram score 2-1 note Late winner.");
  }

  const [, matchId, rawWinner, rawScoreA, rawScoreB, note] = match;
  const sourceMatch = await getManagedMatch(context, matchId);
  const winnerTeamId = await resolveWinnerTeamId(context, sourceMatch, rawWinner.trim());

  if (!winnerTeamId) {
    throw new Error(`Could not match "${rawWinner.trim()}" to one of the teams on ${sourceMatch.id}.`);
  }

  const teamAScore = Number(rawScoreA);
  const teamBScore = Number(rawScoreB);

  const { error: matchError } = await context.supabase.from("matches").update({ status: "completed" }).eq("id", sourceMatch.id);
  if (matchError) {
    throw new Error(matchError.message);
  }

  const { profile } = context;
  const { error: resultError } = await context.supabase.from("match_results").upsert({
    match_id: sourceMatch.id,
    winner_team_id: winnerTeamId,
    team_a_score: teamAScore,
    team_b_score: teamBScore,
    decision_type: "normal",
    score_summary: `${teamAScore} - ${teamBScore}`,
    note: note?.trim() ?? null,
    updated_by: profile.id,
    updated_at: new Date().toISOString()
  });

  if (resultError) {
    throw new Error(resultError.message);
  }

  const loserTeamId = getLoserTeamId(sourceMatch.team_a_id, sourceMatch.team_b_id, winnerTeamId);

  if (sourceMatch.winner_to_match_id && sourceMatch.winner_to_slot) {
    const winnerPayload = sourceMatch.winner_to_slot === "team_a" ? { team_a_id: winnerTeamId } : { team_b_id: winnerTeamId };
    const { error: winnerError } = await context.supabase.from("matches").update(winnerPayload).eq("id", sourceMatch.winner_to_match_id);
    if (winnerError) {
      throw new Error(winnerError.message);
    }
  }

  if (loserTeamId && sourceMatch.loser_to_match_id && sourceMatch.loser_to_slot) {
    const loserPayload = sourceMatch.loser_to_slot === "team_a" ? { team_a_id: loserTeamId } : { team_b_id: loserTeamId };
    const { error: loserError } = await context.supabase.from("matches").update(loserPayload).eq("id", sourceMatch.loser_to_match_id);
    if (loserError) {
      throw new Error(loserError.message);
    }
  }

  return {
    message: `Result saved for "${sourceMatch.id}".`,
    sportIds: [sourceMatch.sport_id],
    matchId: sourceMatch.id
  };
}
