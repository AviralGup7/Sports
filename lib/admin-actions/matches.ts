import { revalidatePath } from "next/cache";

import { canManageSport, requireAdminProfile } from "@/lib/auth";
import { SportSlug } from "@/lib/types-domain";

import {
  revalidateAdminShellPaths,
  revalidatePublicTournamentPaths,
  redirectWithMessage,
  slugify,
  toNullableString
} from "./shared";

export async function performUpsertMatch(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  const sportId = String(formData.get("sportId") ?? "") as SportSlug;

  if (!canManageSport(profile, sportId)) {
    redirectWithMessage("/admin/matches", "error", "You cannot edit that sport.");
  }

  const existingId = toNullableString(formData.get("id"));
  const round = String(formData.get("round") ?? "").trim();
  const day = String(formData.get("day") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const teamAId = toNullableString(formData.get("teamAId"));
  const teamBId = toNullableString(formData.get("teamBId"));
  const status = String(formData.get("status") ?? "scheduled");
  const nextMatchId = toNullableString(formData.get("nextMatchId"));
  const nextSlot = toNullableString(formData.get("nextSlot"));
  const matchId = existingId ?? `${sportId}-${slugify(round)}-${day}-${startTime.replace(":", "")}`;

  if (!round || !day || !startTime || !venue) {
    redirectWithMessage("/admin/matches", "error", "Round, day, time, and venue are required.");
  }

  const { error } = await supabase.from("matches").upsert({
    id: matchId,
    tournament_id: "iasl-2026",
    sport_id: sportId,
    round,
    day,
    start_time: startTime,
    venue,
    team_a_id: teamAId,
    team_b_id: teamBId,
    status,
    next_match_id: nextMatchId,
    next_slot: nextSlot
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
  const matchId = String(formData.get("matchId") ?? "");
  const sportId = String(formData.get("sportId") ?? "") as SportSlug;

  if (!canManageSport(profile, sportId)) {
    redirectWithMessage("/admin/matches", "error", "You cannot edit that sport.");
  }

  const status = String(formData.get("status") ?? "scheduled");
  const winnerTeamId = toNullableString(formData.get("winnerTeamId"));
  const scoreSummary = toNullableString(formData.get("scoreSummary"));
  const note = toNullableString(formData.get("note"));

  const { error: matchError } = await supabase.from("matches").update({ status }).eq("id", matchId);
  if (matchError) {
    redirectWithMessage("/admin/matches", "error", matchError.message);
  }

  const { error: resultError } = await supabase.from("match_results").upsert({
    match_id: matchId,
    winner_team_id: winnerTeamId,
    score_summary: scoreSummary,
    note,
    updated_by: profile.id,
    updated_at: new Date().toISOString()
  });

  if (resultError) {
    redirectWithMessage("/admin/matches", "error", resultError.message);
  }

  if (status === "completed" && winnerTeamId) {
    const { data: sourceMatch, error: sourceError } = await supabase
      .from("matches")
      .select("next_match_id, next_slot")
      .eq("id", matchId)
      .single<{ next_match_id: string | null; next_slot: "team_a" | "team_b" | null }>();

    if (sourceError) {
      redirectWithMessage("/admin/matches", "error", sourceError.message);
    }

    if (sourceMatch?.next_match_id && sourceMatch.next_slot) {
      const updatePayload =
        sourceMatch.next_slot === "team_a" ? { team_a_id: winnerTeamId } : { team_b_id: winnerTeamId };

      const { error: progressionError } = await supabase
        .from("matches")
        .update(updatePayload)
        .eq("id", sourceMatch.next_match_id);

      if (progressionError) {
        redirectWithMessage("/admin/matches", "error", progressionError.message);
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
