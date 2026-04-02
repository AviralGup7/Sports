import type { MatchStatus } from "@/domain/matches/types";
import type { Sport, SportSlug } from "@/domain/sports/types";

export function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

export function formatDateRangeLabel(startDate: string, endDate: string) {
  const format = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric"
  });

  return `${format.format(new Date(startDate))} - ${format.format(new Date(endDate))}`;
}

export function formatTimeLabel(timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const date = new Date("2026-01-01T00:00:00");
  date.setHours(Number(hours), Number(minutes));
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function formatDateTime(dateString: string, timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const date = new Date(dateString);
  date.setHours(Number(hours), Number(minutes));
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
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

