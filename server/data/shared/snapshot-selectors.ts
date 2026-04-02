import type { CompetitionStage, Match, SportSlug } from "@/domain";
import type { RepositorySnapshot } from "@/server/data/snapshot";

import type { DayNote, TournamentStats } from "@/server/data/public/types";
import { formatDateLabel, supportsLiveScoring } from "@/server/data/formatters";

const tournamentDayNotes: Record<string, Omit<DayNote, "id">> = {
  "2026-04-02": {
    title: "Opening day",
    detail: "Cricket runs from 7:30 PM to midnight with three 90-minute knockout slots after the 6:00 PM fixture cancellation.",
    tone: "info"
  },
  "2026-04-03": {
    title: "Knockout crossover night",
    detail: "Cricket, football, volleyball, and athletics all start overlapping, but the schedule is staggered to reduce same-association clashes.",
    tone: "alert"
  },
  "2026-04-04": {
    title: "Quarterfinal pressure",
    detail: "Cricket and football quarterfinals stack into the late window while athletics and volleyball keep advancing the elimination ladder.",
    tone: "alert"
  },
  "2026-04-05": {
    title: "Finals day",
    detail: "Athletics closes first, then the late knockout slate pushes cricket, football, and volleyball toward their championship finish.",
    tone: "success"
  }
};

const IST_OFFSET = "+05:30";
const DEFAULT_LIVE_WINDOW_MINUTES = 90;

function toMatchDateTime(day: string, time: string) {
  return new Date(`${day}T${time}:00${IST_OFFSET}`);
}

export function isMatchCancelled(match: Match) {
  return match.status === "cancelled";
}

export function isMatchPostponed(match: Match) {
  return match.status === "postponed";
}

export function isMatchCompleted(match: Match) {
  return Boolean(match.isBye || match.result?.winnerTeamId || match.status === "completed");
}

function isLiveNow(match: Match, now: Date) {
  if (!supportsLiveScoring(match.sportId)) {
    return false;
  }

  if (isMatchCompleted(match) || isMatchCancelled(match) || isMatchPostponed(match)) {
    return false;
  }

  const start = toMatchDateTime(match.day, match.startTime);
  const end = new Date(start.getTime() + DEFAULT_LIVE_WINDOW_MINUTES * 60 * 1000);
  return now >= start && now < end;
}

export function getPublicAnnouncements(snapshot: RepositorySnapshot) {
  return snapshot.announcements.filter((announcement) => announcement.visibility === "public" && announcement.isPublished);
}

export function isMatchLiveNow(match: Match, now: Date = new Date()) {
  return isLiveNow(match, now);
}

export function isMatchUpcoming(match: Match, now: Date = new Date()) {
  if (isMatchCompleted(match) || isMatchCancelled(match) || isMatchPostponed(match) || isLiveNow(match, now)) {
    return false;
  }

  return toMatchDateTime(match.day, match.startTime).getTime() >= now.getTime();
}

export function hasMatchStarted(match: Match, now: Date = new Date()) {
  return toMatchDateTime(match.day, match.startTime).getTime() <= now.getTime();
}

export function getTournamentStatsFromSnapshot(snapshot: RepositorySnapshot): TournamentStats {
  const now = new Date();
  return {
    sports: snapshot.sports.length,
    teams: snapshot.teams.filter((team) => team.isActive).length,
    matches: snapshot.matches.length,
    completedMatches: snapshot.matches.filter((match) => match.status === "completed").length,
    liveMatches: snapshot.matches.filter((match) => isLiveNow(match, now)).length,
    announcements: getPublicAnnouncements(snapshot).length
  };
}

export function getMatchesForSport(snapshot: RepositorySnapshot, sportId: SportSlug) {
  return snapshot.matches.filter((match) => match.sportId === sportId);
}

export function getStagesForSport(snapshot: RepositorySnapshot, sportId: SportSlug) {
  return snapshot.stages.filter((stage) => stage.sportId === sportId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getGroupsForSport(snapshot: RepositorySnapshot, sportId: SportSlug) {
  return snapshot.groups.filter((group) => group.sportId === sportId).sort((a, b) => a.orderIndex - b.orderIndex);
}

export function buildDayNote(snapshot: RepositorySnapshot, day?: string): DayNote {
  const selectedDay = day ?? snapshot.matches[0]?.day ?? snapshot.tournament.startDate;
  const note = tournamentDayNotes[selectedDay];

  if (note) {
    return {
      id: selectedDay,
      ...note
    };
  }

  return {
    id: selectedDay,
    title: "Tournament note",
    detail: `Key tournament updates for ${formatDateLabel(selectedDay)}. Check live matches, schedule changes, and notices for this window.`,
    tone: "info"
  };
}

export function getActiveStage(snapshot: RepositorySnapshot, sportId: SportSlug) {
  const sportStages = getStagesForSport(snapshot, sportId);
  const matches = getMatchesForSport(snapshot, sportId);
  const now = new Date();

  return (
    sportStages.find((stage: CompetitionStage) =>
      matches.some(
        (match: Match) =>
          match.stageId === stage.id && (isLiveNow(match, now) || match.status === "scheduled" || match.status === "postponed")
      )
    ) ??
    sportStages.find((stage: CompetitionStage) => stage.isActive) ??
    sportStages[0] ??
    null
  );
}
