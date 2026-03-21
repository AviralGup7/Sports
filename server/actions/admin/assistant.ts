import { revalidatePath } from "next/cache";

import type { MatchStatus, NextSlot } from "@/domain/matches/types";
import type { SportSlug } from "@/domain/sports/types";
import { canManageSport, requireAdminProfile } from "@/server/auth";

import {
  revalidateAdminShellPaths,
  revalidatePublicTournamentPaths,
  redirectWithMessage,
  slugify
} from "./shared";

type MatchRow = {
  id: string;
  sport_id: SportSlug;
  day: string;
  start_time: string;
  venue: string;
  status: MatchStatus;
  team_a_id: string | null;
  team_b_id: string | null;
  winner_to_match_id: string | null;
  winner_to_slot: NextSlot | null;
  loser_to_match_id: string | null;
  loser_to_slot: NextSlot | null;
  is_bye: boolean | null;
};

type TeamRow = {
  id: string;
  name: string;
};

type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  visibility: "public" | "admin";
  pinned: boolean;
  is_published: boolean;
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

function getRedirectPath(formData: FormData) {
  const value = String(formData.get("redirectTo") ?? "").trim();
  return value || "/admin/assistant";
}

async function getManagedMatch(matchId: string) {
  const { profile, supabase } = await requireAdminProfile();

  const { data: match, error } = await supabase
    .from("matches")
    .select("id, sport_id, day, start_time, venue, status, team_a_id, team_b_id, winner_to_match_id, winner_to_slot, loser_to_match_id, loser_to_slot, is_bye")
    .eq("id", matchId)
    .maybeSingle<MatchRow>();

  if (error || !match) {
    return {
      profile,
      supabase,
      match: null,
      errorMessage: error?.message ?? `Match "${matchId}" was not found.`
    };
  }

  if (!canManageSport(profile, match.sport_id)) {
    return {
      profile,
      supabase,
      match: null,
      errorMessage: "You cannot manage that sport."
    };
  }

  return {
    profile,
    supabase,
    match,
    errorMessage: null
  };
}

async function resolveWinnerTeamId(
  supabase: Awaited<ReturnType<typeof requireAdminProfile>>["supabase"],
  match: MatchRow,
  rawWinner: string
) {
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

  const { data: teams } = await supabase.from("teams").select("id, name").in("id", teamIds).returns<TeamRow[]>();
  const matches = (teams ?? []).filter((team) => {
    const normalizedName = normalizeText(team.name);
    return normalizedName === normalizedWinner || normalizedName.includes(normalizedWinner) || normalizedWinner.includes(normalizedName);
  });

  if (matches.length === 1) {
    return matches[0].id;
  }

  return null;
}

function revalidateAdminAssistantPaths(sportId?: SportSlug, matchId?: string) {
  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/assistant");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin/matches");

  if (sportId) {
    revalidatePath(`/sports/${sportId}`);
  }

  if (matchId) {
    revalidatePath(`/matches/${matchId}`);
  }
}

async function runAnnouncementCommand(command: string, redirectPath: string) {
  const { supabase } = await requireAdminProfile();
  const match = command.match(/^(?:announce|announcement|notice|post announcement|publish announcement|publish notice|write notice)\s+(.+?)\s*::\s*([\s\S]+)$/i);

  if (!match) {
    return redirectWithMessage(redirectPath, "error", "Use announcement commands like: post announcement pin Weather delay :: Cricket starts at 6:30 PM.");
  }

  const flagsAndTitle = match[1].trim();
  const body = match[2].trim();
  const pinned = /\bpin(?:ned)?\b/i.test(flagsAndTitle);
  const draft = /\bdraft\b/i.test(flagsAndTitle);
  const adminOnly = /\badmin(?:\s+only)?\b/i.test(flagsAndTitle);
  const title = flagsAndTitle
    .replace(/\bpin(?:ned)?\b/gi, "")
    .replace(/\bdraft\b/gi, "")
    .replace(/\badmin(?:\s+only)?\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!title || !body) {
    return redirectWithMessage(redirectPath, "error", "Announcement commands need both a title and body.");
  }

  const announcementId = `${slugify(title)}-${Date.now()}`;
  const { error } = await supabase.from("announcements").upsert({
    id: announcementId,
    title,
    body,
    visibility: adminOnly ? "admin" : "public",
    pinned,
    is_published: !draft,
    published_at: new Date().toISOString()
  });

  if (error) {
    return redirectWithMessage(redirectPath, "error", error.message);
  }

  revalidateAdminAssistantPaths();
  redirectWithMessage(redirectPath, "success", `Announcement "${title}" created.`);
}

async function runAnnouncementUpdateCommand(command: string, redirectPath: string) {
  const { supabase } = await requireAdminProfile();
  const match = command.match(/^(?:update|edit)\s+announcement\s+([a-z0-9-]+)\s+(.+?)\s*::\s*([\s\S]+)$/i);

  if (!match) {
    return redirectWithMessage(
      redirectPath,
      "error",
      "Use update commands like: update announcement weather-delay publish pin Weather delay :: Cricket starts at 6:30 PM."
    );
  }

  const [, announcementId, flagsAndTitle, body] = match;
  const { data: existingAnnouncement, error: existingError } = await supabase
    .from("announcements")
    .select("id, title, body, visibility, pinned, is_published")
    .eq("id", announcementId)
    .maybeSingle<AnnouncementRow>();

  if (existingError || !existingAnnouncement) {
    return redirectWithMessage(redirectPath, "error", existingError?.message ?? `Announcement "${announcementId}" was not found.`);
  }

  const normalizedFlags = flagsAndTitle.trim();
  const title = normalizedFlags
    .replace(/\bpin(?:ned)?\b/gi, "")
    .replace(/\bunpin\b/gi, "")
    .replace(/\bdraft\b/gi, "")
    .replace(/\bpublish(?:ed)?\b/gi, "")
    .replace(/\badmin(?:\s+only)?\b/gi, "")
    .replace(/\bpublic\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const pinned = /\bunpin\b/i.test(normalizedFlags) ? false : /\bpin(?:ned)?\b/i.test(normalizedFlags) ? true : existingAnnouncement.pinned;
  const isPublished = /\bdraft\b/i.test(normalizedFlags) ? false : /\bpublish(?:ed)?\b/i.test(normalizedFlags) ? true : existingAnnouncement.is_published;
  const visibility = /\badmin(?:\s+only)?\b/i.test(normalizedFlags)
    ? "admin"
    : /\bpublic\b/i.test(normalizedFlags)
      ? "public"
      : existingAnnouncement.visibility;

  const { error } = await supabase.from("announcements").upsert({
    id: existingAnnouncement.id,
    title: title || existingAnnouncement.title,
    body: body.trim() || existingAnnouncement.body,
    visibility,
    pinned,
    is_published: isPublished,
    published_at: new Date().toISOString()
  });

  if (error) {
    return redirectWithMessage(redirectPath, "error", error.message);
  }

  revalidateAdminAssistantPaths();
  redirectWithMessage(redirectPath, "success", `Announcement "${existingAnnouncement.id}" updated.`);
}

async function runRescheduleCommand(command: string, redirectPath: string) {
  const match = command.match(/^(?:move|reschedule|change time for|change match)\s+(?:match\s+)?([a-z0-9-]+)\s+(?:to|for)\s+(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2})(?:\s+at\s+(.+))?$/i);

  if (!match) {
    return redirectWithMessage(redirectPath, "error", "Use reschedule commands like: move cricket-final to 2026-04-05 18:30 at Main Ground.");
  }

  const [, matchId, day, rawTime, venue] = match;
  const normalizedTime = normalizeTime(rawTime);

  if (!normalizedTime) {
    return redirectWithMessage(redirectPath, "error", "Use a valid 24-hour time like 18:30.");
  }

  const { supabase, match: sourceMatch, errorMessage } = await getManagedMatch(matchId);
  if (!sourceMatch) {
    return redirectWithMessage(redirectPath, "error", errorMessage ?? "Match not found.");
  }

  const payload = venue?.trim()
    ? { day, start_time: normalizedTime, venue: venue.trim() }
    : { day, start_time: normalizedTime };

  const { error } = await supabase.from("matches").update(payload).eq("id", sourceMatch.id);
  if (error) {
    return redirectWithMessage(redirectPath, "error", error.message);
  }

  revalidateAdminAssistantPaths(sourceMatch.sport_id, sourceMatch.id);
  redirectWithMessage(redirectPath, "success", `Match "${sourceMatch.id}" moved to ${day} ${normalizedTime}.`);
}

async function runStatusCommand(command: string, redirectPath: string) {
  const match = command.match(/^(?:status|set status|mark|update status)\s+(?:match\s+)?([a-z0-9-]+)\s+(?:to\s+)?(scheduled|live|completed|postponed|cancelled)$/i);

  if (!match) {
    return redirectWithMessage(redirectPath, "error", "Use status commands like: status football-qf-2 live.");
  }

  const [, matchId, nextStatus] = match;
  const { supabase, match: sourceMatch, errorMessage } = await getManagedMatch(matchId);
  if (!sourceMatch) {
    return redirectWithMessage(redirectPath, "error", errorMessage ?? "Match not found.");
  }

  const { error } = await supabase.from("matches").update({ status: nextStatus.toLowerCase() as MatchStatus }).eq("id", sourceMatch.id);
  if (error) {
    return redirectWithMessage(redirectPath, "error", error.message);
  }

  revalidateAdminAssistantPaths(sourceMatch.sport_id, sourceMatch.id);
  redirectWithMessage(redirectPath, "success", `Match "${sourceMatch.id}" marked ${nextStatus.toLowerCase()}.`);
}

async function runResultCommand(command: string, redirectPath: string) {
  const match = command.match(/^(?:result|score|update result)\s+(?:match\s+)?([a-z0-9-]+)\s+winner\s+(.+?)\s+score\s+(\d+)\s*[-:]\s*(\d+)(?:\s+note\s+([\s\S]+))?$/i);

  if (!match) {
    return redirectWithMessage(redirectPath, "error", "Use result commands like: result football-qf-2 winner Pilani Tamil Mandram score 2-1 note Late winner.");
  }

  const [, matchId, rawWinner, rawScoreA, rawScoreB, note] = match;
  const { profile, supabase, match: sourceMatch, errorMessage } = await getManagedMatch(matchId);
  if (!sourceMatch) {
    return redirectWithMessage(redirectPath, "error", errorMessage ?? "Match not found.");
  }

  const winnerTeamId = await resolveWinnerTeamId(supabase, sourceMatch, rawWinner.trim());
  if (!winnerTeamId) {
    return redirectWithMessage(redirectPath, "error", `Could not match "${rawWinner.trim()}" to one of the teams on ${sourceMatch.id}.`);
  }

  const teamAScore = Number(rawScoreA);
  const teamBScore = Number(rawScoreB);

  const { error: matchError } = await supabase.from("matches").update({ status: "completed" }).eq("id", sourceMatch.id);
  if (matchError) {
    return redirectWithMessage(redirectPath, "error", matchError.message);
  }

  const { error: resultError } = await supabase.from("match_results").upsert({
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
    return redirectWithMessage(redirectPath, "error", resultError.message);
  }

  const loserTeamId = getLoserTeamId(sourceMatch.team_a_id, sourceMatch.team_b_id, winnerTeamId);

  if (sourceMatch.winner_to_match_id && sourceMatch.winner_to_slot) {
    const winnerPayload = sourceMatch.winner_to_slot === "team_a" ? { team_a_id: winnerTeamId } : { team_b_id: winnerTeamId };
    const { error: winnerError } = await supabase.from("matches").update(winnerPayload).eq("id", sourceMatch.winner_to_match_id);
    if (winnerError) {
      return redirectWithMessage(redirectPath, "error", winnerError.message);
    }
  }

  if (loserTeamId && sourceMatch.loser_to_match_id && sourceMatch.loser_to_slot) {
    const loserPayload = sourceMatch.loser_to_slot === "team_a" ? { team_a_id: loserTeamId } : { team_b_id: loserTeamId };
    const { error: loserError } = await supabase.from("matches").update(loserPayload).eq("id", sourceMatch.loser_to_match_id);
    if (loserError) {
      return redirectWithMessage(redirectPath, "error", loserError.message);
    }
  }

  revalidateAdminAssistantPaths(sourceMatch.sport_id, sourceMatch.id);
  redirectWithMessage(redirectPath, "success", `Result saved for "${sourceMatch.id}".`);
}

export async function performRunAdminAssistant(formData: FormData) {
  const command = String(formData.get("command") ?? "").trim();
  const redirectPath = getRedirectPath(formData);

  if (!command) {
    return redirectWithMessage(redirectPath, "error", "Write a command first.");
  }

  const normalizedCommand = command.toLowerCase();

  if (/^(announce|announcement|notice|post announcement|publish announcement|publish notice|write notice)\b/.test(normalizedCommand)) {
    await runAnnouncementCommand(command, redirectPath);
  }

  if (/^(update|edit)\s+announcement\b/.test(normalizedCommand)) {
    await runAnnouncementUpdateCommand(command, redirectPath);
  }

  if (/^(move|reschedule|change time for|change match)\b/.test(normalizedCommand)) {
    await runRescheduleCommand(command, redirectPath);
  }

  if (/^(status|set status|mark|update status)\b/.test(normalizedCommand)) {
    await runStatusCommand(command, redirectPath);
  }

  if (/^(result|score|update result)\b/.test(normalizedCommand)) {
    await runResultCommand(command, redirectPath);
  }

  redirectWithMessage(
    redirectPath,
    "error",
    "Command not recognized. Try an announcement, move, status, or result command."
  );
}
