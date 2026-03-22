import { revalidatePath } from "next/cache";

import { generateCompetitionStructure, type NextSlot } from "@/domain/matches";
import type { SportSlug } from "@/domain/sports/types";
import { canManageSport, requireAdminProfile } from "@/server/auth";

import { ActionValidationError, getEnumField, getRequiredString } from "./form-validation";
import {
  revalidateAdminShellPaths,
  revalidatePublicTournamentPaths,
  redirectWithMessage,
  slugify,
  toNullableString
} from "./shared";

function toNullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getLoserTeamId(teamAId: string | null, teamBId: string | null, winnerTeamId: string | null) {
  if (!winnerTeamId) {
    return null;
  }

  if (winnerTeamId === teamAId) {
    return teamBId;
  }

  if (winnerTeamId === teamBId) {
    return teamAId;
  }

  return null;
}

export async function performGenerateStructure(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  const sportId = String(formData.get("sportId") ?? "") as SportSlug;
  const format = String(formData.get("format") ?? "knockout") as "knockout" | "group-knockout";
  const groupsCount = toNullableNumber(formData.get("groupsCount")) ?? 2;
  const knockoutSize = toNullableNumber(formData.get("knockoutSize")) ?? 4;

  if (!canManageSport(profile, sportId)) {
    redirectWithMessage("/admin/matches?mode=builder", "error", "You cannot build fixtures for that sport.");
  }

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id, name, association, seed, is_active, team_sports!inner(sport_id)")
    .eq("team_sports.sport_id", sportId)
    .eq("is_active", true)
    .order("seed", { ascending: true });

  if (teamsError) {
    redirectWithMessage("/admin/matches?mode=builder", "error", teamsError.message);
  }

  const seededTeams = (teams ?? []).map((team) => ({
    id: team.id,
    name: team.name,
    association: team.association,
    sportIds: [sportId],
    seed: team.seed,
    isActive: team.is_active
  }));

  const generated = generateCompetitionStructure(seededTeams, sportId, {
    format,
    groupsCount,
    knockoutSize
  });

  const stageIds = generated.stages.map((stage) => stage.id);
  const groupIds = generated.groups.map((group) => group.id);
  const matchIds = generated.matches.map((match) => match.id);

  if (matchIds.length > 0) {
    await supabase.from("match_results").delete().in("match_id", matchIds);
    await supabase.from("matches").delete().in("id", matchIds);
  }

  if (groupIds.length > 0) {
    await supabase.from("competition_groups").delete().in("id", groupIds);
  }

  if (stageIds.length > 0) {
    await supabase.from("competition_stages").delete().in("id", stageIds);
  }

  const stageRows = generated.stages.map((stage) => ({
    id: stage.id,
    sport_id: stage.sportId,
    type: stage.type,
    label: stage.label,
    order_index: stage.orderIndex,
    advances_count: stage.advancesCount,
    is_active: stage.isActive
  }));

  const { error: stageError } = await supabase.from("competition_stages").upsert(stageRows);
  if (stageError) {
    redirectWithMessage("/admin/matches?mode=builder", "error", stageError.message);
  }

  if (generated.groups.length > 0) {
    const groupRows = generated.groups.map((group) => ({
      id: group.id,
      stage_id: group.stageId,
      sport_id: group.sportId,
      code: group.code,
      order_index: group.orderIndex
    }));
    const { error: groupError } = await supabase.from("competition_groups").upsert(groupRows);
    if (groupError) {
      redirectWithMessage("/admin/matches?mode=builder", "error", groupError.message);
    }
  }

  const generatedMatches = generated.matches.map((match) => ({
    id: match.id,
    tournament_id: "iasl-2026",
    sport_id: sportId,
    round: match.round,
    day: match.day,
    start_time: match.startTime,
    venue: match.venue,
    stage_id: match.stageId,
    group_id: match.groupId,
    round_index: match.roundIndex,
    match_number: match.matchNumber,
    team_a_id: match.teamAId,
    team_b_id: match.teamBId,
    status: match.status,
    winner_to_match_id: match.winnerToMatchId,
    winner_to_slot: match.winnerToSlot,
    loser_to_match_id: match.loserToMatchId,
    loser_to_slot: match.loserToSlot,
    next_match_id: match.winnerToMatchId,
    next_slot: match.winnerToSlot,
    is_bye: match.isBye
  }));

  const { error: matchError } = await supabase.from("matches").upsert(generatedMatches);
  if (matchError) {
    redirectWithMessage("/admin/matches?mode=builder", "error", matchError.message);
  }

  const byeResults = generated.matches
    .filter((match) => match.isBye && match.result?.winnerTeamId)
    .map((match) => ({
      match_id: match.id,
      winner_team_id: match.result?.winnerTeamId ?? null,
      team_a_score: match.result?.teamAScore ?? null,
      team_b_score: match.result?.teamBScore ?? null,
      decision_type: match.result?.decisionType ?? "walkover",
      score_summary: match.result?.scoreSummary ?? "Bye to next round",
      note: match.result?.note ?? "Auto-advanced through bracket bye.",
      updated_by: profile.id,
      updated_at: new Date().toISOString()
    }));

  if (byeResults.length > 0) {
    const { error: resultError } = await supabase.from("match_results").upsert(byeResults);
    if (resultError) {
      redirectWithMessage("/admin/matches?mode=builder", "error", resultError.message);
    }
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/matches");
  revalidatePath(`/sports/${sportId}`);

  redirectWithMessage("/admin/matches?mode=builder", "success", "Generated fixture structure.");
}

export async function performUpsertMatch(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  let sportId = "" as SportSlug;

  try {
    sportId = getRequiredString(formData, "sportId", "Sport") as SportSlug;
  } catch (error) {
    if (error instanceof ActionValidationError) {
      redirectWithMessage("/admin/matches", "error", error.message);
    }

    throw error;
  }

  if (!canManageSport(profile, sportId)) {
    redirectWithMessage("/admin/matches", "error", "You cannot edit that sport.");
  }

  const existingId = toNullableString(formData.get("id"));
  const round = getRequiredString(formData, "round", "Round");
  const day = getRequiredString(formData, "day", "Day");
  const startTime = getRequiredString(formData, "startTime", "Start time");
  const venue = getRequiredString(formData, "venue", "Venue");
  const teamAId = toNullableString(formData.get("teamAId"));
  const teamBId = toNullableString(formData.get("teamBId"));
  const stageId = toNullableString(formData.get("stageId"));
  const groupId = toNullableString(formData.get("groupId"));
  const status = getEnumField(formData, "status", ["scheduled", "live", "completed", "postponed", "cancelled"] as const, "Status", "scheduled");
  const roundIndex = toNullableNumber(formData.get("roundIndex")) ?? 1;
  const matchNumber = toNullableNumber(formData.get("matchNumber")) ?? 1;
  const winnerToMatchId = toNullableString(formData.get("winnerToMatchId"));
  const winnerToSlot = toNullableString(formData.get("winnerToSlot")) as NextSlot | null;
  const loserToMatchId = toNullableString(formData.get("loserToMatchId"));
  const loserToSlot = toNullableString(formData.get("loserToSlot")) as NextSlot | null;
  const isBye = formData.get("isBye") === "on";
  const matchId = existingId ?? `${sportId}-${slugify(round)}-${day}-${startTime.replace(":", "")}`;

  if (teamAId && teamBId && teamAId === teamBId) {
    redirectWithMessage("/admin/matches", "error", "A match cannot assign the same team to both sides.");
  }

  if (!isBye && ["live", "completed"].includes(status) && (!teamAId || !teamBId)) {
    redirectWithMessage("/admin/matches", "error", "Live or completed matches need both teams assigned.");
  }

  const { data: duplicateMatches, error: duplicateError } = await supabase
    .from("matches")
    .select("id")
    .eq("sport_id", sportId)
    .eq("day", day)
    .eq("start_time", startTime)
    .eq("venue", venue);

  if (duplicateError) {
    redirectWithMessage("/admin/matches", "error", duplicateError.message);
  }

  if ((duplicateMatches ?? []).some((match) => match.id !== existingId)) {
    redirectWithMessage("/admin/matches", "error", "Another fixture already exists for that sport, day, time, and venue.");
  }

  const { error } = await supabase.from("matches").upsert({
    id: matchId,
    tournament_id: "iasl-2026",
    sport_id: sportId,
    round,
    day,
    start_time: startTime,
    venue,
    stage_id: stageId,
    group_id: groupId,
    round_index: roundIndex,
    match_number: matchNumber,
    team_a_id: teamAId,
    team_b_id: teamBId,
    status,
    winner_to_match_id: winnerToMatchId,
    winner_to_slot: winnerToSlot,
    loser_to_match_id: loserToMatchId,
    loser_to_slot: loserToSlot,
    next_match_id: winnerToMatchId,
    next_slot: winnerToSlot,
    is_bye: isBye
  });

  if (error) {
    redirectWithMessage("/admin/matches", "error", error.message);
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/matches");
  revalidatePath(`/sports/${sportId}`);

  redirectWithMessage("/admin/matches", "success", existingId ? "Match updated." : "Match created.");
}

export async function performSubmitResult(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  let matchId = "";
  let sportId = "" as SportSlug;

  try {
    matchId = getRequiredString(formData, "matchId", "Match");
    sportId = getRequiredString(formData, "sportId", "Sport") as SportSlug;
  } catch (error) {
    if (error instanceof ActionValidationError) {
      redirectWithMessage("/admin/matches", "error", error.message);
    }

    throw error;
  }

  if (!canManageSport(profile, sportId)) {
    redirectWithMessage("/admin/matches", "error", "You cannot edit that sport.");
  }

  const status = getEnumField(formData, "status", ["scheduled", "live", "completed", "postponed", "cancelled"] as const, "Status", "scheduled");
  const selectedWinnerTeamId = toNullableString(formData.get("winnerTeamId"));
  const teamAScore = toNullableNumber(formData.get("teamAScore"));
  const teamBScore = toNullableNumber(formData.get("teamBScore"));
  const scoreSummary = toNullableString(formData.get("scoreSummary"));
  const note = toNullableString(formData.get("note"));
  const decisionType = getEnumField(formData, "decisionType", ["normal", "walkover", "penalties", "retired"] as const, "Decision type", "normal");

  const { data: sourceMatch, error: sourceError } = await supabase
    .from("matches")
    .select("id, sport_id, stage_id, team_a_id, team_b_id, winner_to_match_id, winner_to_slot, loser_to_match_id, loser_to_slot, is_bye")
    .eq("id", matchId)
    .single<{
      id: string;
      sport_id: string;
      stage_id: string | null;
      team_a_id: string | null;
      team_b_id: string | null;
      winner_to_match_id: string | null;
      winner_to_slot: NextSlot | null;
      loser_to_match_id: string | null;
      loser_to_slot: NextSlot | null;
      is_bye: boolean | null;
    }>();

  if (sourceError || !sourceMatch) {
    redirectWithMessage("/admin/matches", "error", sourceError?.message ?? "Match not found.");
  }

  const baseMatch = sourceMatch!;

  const inferredWinner =
    baseMatch.is_bye && !selectedWinnerTeamId ? baseMatch.team_a_id ?? baseMatch.team_b_id : selectedWinnerTeamId;

  if (
    status === "completed" &&
    !inferredWinner &&
    !["cancelled"].includes(status)
  ) {
    redirectWithMessage("/admin/matches", "error", "Completed results must choose a winner.");
  }

  if (
    inferredWinner &&
    inferredWinner !== baseMatch.team_a_id &&
    inferredWinner !== baseMatch.team_b_id
  ) {
    redirectWithMessage("/admin/matches", "error", "Winner must be one of the assigned teams.");
  }

  if (status === "completed" && decisionType === "normal" && teamAScore !== null && teamBScore !== null && teamAScore === teamBScore) {
    redirectWithMessage("/admin/matches", "error", "Normal results cannot finish level. Use penalties or another decision type.");
  }

  const { error: matchError } = await supabase.from("matches").update({ status }).eq("id", matchId);
  if (matchError) {
    redirectWithMessage("/admin/matches", "error", matchError.message);
  }

  const { error: resultError } = await supabase.from("match_results").upsert({
    match_id: matchId,
    winner_team_id: inferredWinner,
    team_a_score: teamAScore,
    team_b_score: teamBScore,
    decision_type: decisionType,
    score_summary: scoreSummary,
    note,
    updated_by: profile.id,
    updated_at: new Date().toISOString()
  });

  if (resultError) {
    redirectWithMessage("/admin/matches", "error", resultError.message);
  }

  if (status === "completed" && inferredWinner) {
    const loserTeamId = getLoserTeamId(baseMatch.team_a_id, baseMatch.team_b_id, inferredWinner);

    if (baseMatch.winner_to_match_id && baseMatch.winner_to_slot) {
      const winnerPayload =
        baseMatch.winner_to_slot === "team_a" ? { team_a_id: inferredWinner } : { team_b_id: inferredWinner };

      const { error: winnerProgressionError } = await supabase
        .from("matches")
        .update(winnerPayload)
        .eq("id", baseMatch.winner_to_match_id);

      if (winnerProgressionError) {
        redirectWithMessage("/admin/matches", "error", winnerProgressionError.message);
      }
    }

    if (loserTeamId && baseMatch.loser_to_match_id && baseMatch.loser_to_slot) {
      const loserPayload =
        baseMatch.loser_to_slot === "team_a" ? { team_a_id: loserTeamId } : { team_b_id: loserTeamId };

      const { error: loserProgressionError } = await supabase
        .from("matches")
        .update(loserPayload)
        .eq("id", baseMatch.loser_to_match_id);

      if (loserProgressionError) {
        redirectWithMessage("/admin/matches", "error", loserProgressionError.message);
      }
    }
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/matches");
  revalidatePath(`/sports/${sportId}`);
  revalidatePath(`/matches/${matchId}`);

  redirectWithMessage("/admin/matches", "success", "Result saved.");
}






