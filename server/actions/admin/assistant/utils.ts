import { revalidatePath } from "next/cache";

import type { SportSlug } from "@/domain/sports/types";

import { revalidateAdminShellPaths, revalidatePublicTournamentPaths } from "../shared";

export function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function normalizeTime(value: string) {
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

export function getLoserTeamId(teamAId: string | null, teamBId: string | null, winnerTeamId: string | null) {
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

export function getRedirectPath(formData: FormData) {
  const value = String(formData.get("redirectTo") ?? "").trim();
  return value || "/admin/assistant";
}

export function parseCommands(commandText: string) {
  return commandText
    .split(/\r?\n+/)
    .flatMap((line) => line.split(/\s*&&\s*/))
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseSportList(rawSports: string) {
  const sportIds = rawSports
    .split(/(?:,|\band\b|\s)+/i)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean) as SportSlug[];

  return Array.from(new Set(sportIds)).filter((sportId): sportId is SportSlug =>
    ["cricket", "football", "volleyball", "athletics"].includes(sportId)
  );
}

export function revalidateAdminAssistantPaths(sportIds: SportSlug[], matchIds: string[]) {
  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/assistant");
  revalidatePath("/admin/announcements");
  revalidatePath("/admin/matches");
  revalidatePath("/admin/teams");

  Array.from(new Set(sportIds)).forEach((sportId) => {
    revalidatePath(`/sports/${sportId}`);
  });

  Array.from(new Set(matchIds)).forEach((matchId) => {
    revalidatePath(`/matches/${matchId}`);
  });
}
