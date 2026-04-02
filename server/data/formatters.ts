import type { Match, MatchStatus } from "@/domain/matches/types";
import type { Sport, SportSlug } from "@/domain/sports/types";

export const IST_TIME_ZONE = "Asia/Kolkata";
const IST_OFFSET = "+05:30";
const DEFAULT_LIVE_WINDOW_MINUTES = 90;

export function supportsLiveScoring(sportId: SportSlug) {
  return sportId === "cricket";
}

function toIstDate(day: string, time = "00:00") {
  return new Date(`${day}T${time}:00${IST_OFFSET}`);
}

export function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(toIstDate(dateString));
}

export function formatDateRangeLabel(startDate: string, endDate: string) {
  const format = new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIME_ZONE,
    month: "short",
    day: "numeric"
  });

  return `${format.format(toIstDate(startDate))} - ${format.format(toIstDate(endDate))}`;
}

export function formatTimeLabel(timeString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(toIstDate("2026-01-01", timeString));
}

export function formatDateTime(dateString: string, timeString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  }).format(toIstDate(dateString, timeString));
}

export function formatStatusLabel(status: string) {
  if (!status) {
    return "";
  }

  return status
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function formatRoundLabel(round: string) {
  const normalized = round.trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  if (normalized === "opening fixtures") {
    return "Opening Fixture";
  }

  if (normalized.includes("bronze") || normalized.includes("third")) {
    return "Bronze Match";
  }

  if (normalized.includes("placement")) {
    return "Placement Match";
  }

  return round;
}

function toMatchDateTime(day: string, time: string) {
  return toIstDate(day, time);
}

export function isMatchCompleteForDisplay(match: Match, now: Date = new Date()) {
  void now;
  return Boolean(match.isBye || match.result?.winnerTeamId || match.status === "completed");
}

export function isMatchLiveForDisplay(match: Match, now: Date = new Date()) {
  if (!supportsLiveScoring(match.sportId)) {
    return false;
  }

  if (isMatchCompleteForDisplay(match, now) || match.status === "cancelled" || match.status === "postponed") {
    return false;
  }

  const start = toMatchDateTime(match.day, match.startTime);
  const end = new Date(start.getTime() + DEFAULT_LIVE_WINDOW_MINUTES * 60 * 1000);
  return now >= start && now < end;
}

export function getMatchDisplayLabel(match: Match, now: Date = new Date()) {
  if (match.status === "cancelled") {
    return "Cancelled";
  }

  if (match.status === "postponed") {
    return "Rescheduled";
  }

  if (isMatchCompleteForDisplay(match, now)) {
    return "Result In";
  }

  if (isMatchLiveForDisplay(match, now)) {
    return "Live Now";
  }

  return toMatchDateTime(match.day, match.startTime).getTime() < now.getTime() ? "Awaiting Result" : "Scheduled";
}

export function getStatusTone(status: MatchStatus) {
  if (status === "completed") {
    return "complete";
  }

  if (status === "live") {
    return "live";
  }

  if (status === "postponed" || status === "cancelled") {
    return "alert";
  }

  return "scheduled";
}

export function getSportBySlugFromCollection(sports: Sport[], sportId?: SportSlug) {
  return sports.find((sport) => sport.id === sportId);
}

