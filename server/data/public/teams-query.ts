import type { Sport } from "@/domain";
import type { TeamsPageData, TeamProfilePageData } from "@/server/data/public/types";
import { loadSnapshot } from "@/server/data/snapshot";
import { buildDataState, getGeneratedAt } from "@/server/data/shared/query-state";
import { buildTeamListCards, buildTeamStandings, getTeamMatches } from "@/server/data/shared/public-view-builders";

export async function getTeamsPageData(): Promise<TeamsPageData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    teams: buildTeamListCards(snapshot),
    sports: snapshot.sports
  };
}

export async function getTeamProfilePageData(teamId: string): Promise<TeamProfilePageData | null> {
  const snapshot = await loadSnapshot();
  const team = snapshot.teams.find((item) => item.id === teamId && item.isActive);

  if (!team) {
    return null;
  }

  const sportsById = new Map(snapshot.sports.map((sport) => [sport.id, sport]));
  const matches = getTeamMatches(snapshot, team.id);
  const generatedAt = getGeneratedAt();
  const now = new Date();

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    team,
    sports: team.sportIds.map((sportId) => sportsById.get(sportId)).filter((sport): sport is Sport => Boolean(sport)),
    liveMatches: matches.filter((match) => {
      if (match.status === "completed" || match.status === "cancelled" || match.status === "postponed") {
        return false;
      }

      const start = new Date(`${match.day}T${match.startTime}:00+05:30`);
      const end = new Date(start.getTime() + 90 * 60 * 1000);

      return now >= start && now < end;
    }),
    upcomingMatches: matches.filter((match) => match.status === "scheduled" || match.status === "postponed"),
    completedMatches: matches.filter((match) => match.status === "completed"),
    standings: buildTeamStandings(snapshot, team)
  };
}
