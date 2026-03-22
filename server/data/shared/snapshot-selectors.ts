import type { CompetitionStage, Match, SportSlug } from "@/domain";
import type { RepositorySnapshot } from "@/server/data/snapshot";

import type { DayNote, TournamentStats } from "@/server/data/public/types";
import { formatDateLabel } from "@/server/data/formatters";

const tournamentDayNotes: Record<string, Omit<DayNote, "id">> = {
  "2026-04-02": {
    title: "Opening day",
    detail: "Cricket pool play and early athletics results set the tone for the tournament.",
    tone: "info"
  },
  "2026-04-03": {
    title: "Full tournament day",
    detail: "Every sport is active today, so live scores, schedule changes, and notices matter most.",
    tone: "alert"
  },
  "2026-04-04": {
    title: "Knockout day",
    detail: "Semi-finals and late qualification matches tighten the title race across campus.",
    tone: "alert"
  },
  "2026-04-05": {
    title: "Finals day",
    detail: "Championship matches, bronze playoffs, and medal events decide the podium before closeout.",
    tone: "success"
  }
};

export function getPublicAnnouncements(snapshot: RepositorySnapshot) {
  return snapshot.announcements.filter((announcement) => announcement.visibility === "public" && announcement.isPublished);
}

export function getTournamentStatsFromSnapshot(snapshot: RepositorySnapshot): TournamentStats {
  return {
    sports: snapshot.sports.length,
    teams: snapshot.teams.filter((team) => team.isActive).length,
    matches: snapshot.matches.length,
    completedMatches: snapshot.matches.filter((match) => match.status === "completed").length,
    liveMatches: snapshot.matches.filter((match) => match.status === "live").length,
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

  return (
    sportStages.find((stage: CompetitionStage) =>
      matches.some((match: Match) => match.stageId === stage.id && (match.status === "live" || match.status === "scheduled" || match.status === "postponed"))
    ) ??
    sportStages.find((stage: CompetitionStage) => stage.isActive) ??
    sportStages[0] ??
    null
  );
}
