"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { canManageSport, requireAdminProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SportSlug } from "@/lib/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNullableString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function redirectWithMessage(path: string, tone: "success" | "error", message: string) {
  const encodedMessage = encodeURIComponent(message);
  redirect(`${path}?status=${tone}&message=${encodedMessage}`);
}

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectWithMessage("/admin/login", "error", error.message);
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOutAdminAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login?status=success&message=Signed%20out.");
}

export async function upsertTeamAction(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  const name = String(formData.get("name") ?? "").trim();
  const association = String(formData.get("association") ?? "").trim();
  const seed = Number(formData.get("seed") ?? 0);
  const sportIds = formData.getAll("sportIds").map((value) => String(value) as SportSlug);
  const existingId = toNullableString(formData.get("id"));
  const teamId = existingId ?? slugify(name);

  if (!name || !association || !seed || sportIds.length === 0) {
    redirectWithMessage("/admin/teams", "error", "Team name, association, seed, and at least one sport are required.");
  }

  if (profile.role !== "super_admin" && sportIds.some((sportId) => !profile.sportIds.includes(sportId))) {
    redirectWithMessage("/admin/teams", "error", "You can only assign teams to sports you manage.");
  }

  const { error: teamError } = await supabase.from("teams").upsert({
    id: teamId,
    name,
    association,
    seed,
    is_active: true
  });

  if (teamError) {
    redirectWithMessage("/admin/teams", "error", teamError.message);
  }

  const { error: deleteError } = await supabase.from("team_sports").delete().eq("team_id", teamId);
  if (deleteError) {
    redirectWithMessage("/admin/teams", "error", deleteError.message);
  }

  const { error: relationError } = await supabase.from("team_sports").insert(
    sportIds.map((sportId) => ({
      team_id: teamId,
      sport_id: sportId
    }))
  );

  if (relationError) {
    redirectWithMessage("/admin/teams", "error", relationError.message);
  }

  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/teams");
  sportIds.forEach((sportId) => revalidatePath(`/sports/${sportId}`));

  redirectWithMessage("/admin/teams", "success", existingId ? "Team updated." : "Team created.");
}

export async function archiveTeamAction(formData: FormData) {
  const { supabase } = await requireAdminProfile();
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("teams").update({ is_active: false }).eq("id", id);

  if (error) {
    redirectWithMessage("/admin/teams", "error", error.message);
  }

  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/teams");
  redirectWithMessage("/admin/teams", "success", "Team archived.");
}

export async function upsertMatchAction(formData: FormData) {
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

  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin");
  revalidatePath("/admin/matches");
  revalidatePath(`/sports/${sportId}`);

  redirectWithMessage("/admin/matches", "success", existingId ? "Match updated." : "Match created.");
}

export async function submitResultAction(formData: FormData) {
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

  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin");
  revalidatePath("/admin/matches");
  revalidatePath(`/sports/${sportId}`);
  revalidatePath(`/matches/${matchId}`);

  redirectWithMessage("/admin/matches", "success", "Result saved.");
}

export async function upsertAnnouncementAction(formData: FormData) {
  await requireAdminProfile();
  const supabase = await createSupabaseServerClient();

  const existingId = toNullableString(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "public");
  const pinned = formData.get("pinned") === "on";
  const isPublished = formData.get("isPublished") === "on";
  const announcementId = existingId ?? `${slugify(title)}-${Date.now()}`;

  if (!title || !body) {
    redirectWithMessage("/admin/announcements", "error", "Announcement title and body are required.");
  }

  const { error } = await supabase.from("announcements").upsert({
    id: announcementId,
    title,
    body,
    visibility,
    pinned,
    is_published: isPublished,
    published_at: new Date().toISOString()
  });

  if (error) {
    redirectWithMessage("/admin/announcements", "error", error.message);
  }

  revalidatePath("/");
  revalidatePath("/announcements");
  revalidatePath("/admin");
  revalidatePath("/admin/announcements");

  redirectWithMessage("/admin/announcements", "success", existingId ? "Announcement updated." : "Announcement created.");
}
