import { MatchStatus, Sport, SportSlug } from "@/lib/types";

export function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
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

export function getStatusTone(status: MatchStatus) {
  if (status === "completed") {
    return "complete";
  }

  if (status === "live") {
    return "live";
  }

  return "scheduled";
}

export function getSportBySlugFromCollection(sports: Sport[], sportId?: SportSlug) {
  return sports.find((sport) => sport.id === sportId);
}
