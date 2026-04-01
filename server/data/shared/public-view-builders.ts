import { buildStandingsRows } from "@/domain/matches";
import type { Sport, SportSlug, Team } from "@/domain";
import type { RepositorySnapshot } from "@/server/data/snapshot";
import type { StandingsSportCard, TeamListCard, TeamStandingsSnippet } from "@/server/data/public/types";
import { getMatchesForSport, getStagesForSport } from "@/server/data/shared/snapshot-selectors";

function getMatchesForTeam(snapshot: RepositorySnapshot, teamId: string) {
  return snapshot.matches
    .filter((match) => match.teamAId === teamId || match.teamBId === teamId)
    .sort((a, b) => `${a.day}T${a.startTime}`.localeCompare(`${b.day}T${b.startTime}`));
}

export function buildStandingsSections(snapshot: RepositorySnapshot, selectedSport?: SportSlug): StandingsSportCard[] {
  const sports = selectedSport ? snapshot.sports.filter((sport) => sport.id === selectedSport) : snapshot.sports;
  const sections: StandingsSportCard[] = [];

  for (const sport of sports) {
    const teams = snapshot.teams.filter((team) => team.isActive && team.sportIds.includes(sport.id));
    const matches = getMatchesForSport(snapshot, sport.id);
    const stages = getStagesForSport(snapshot, sport.id);
    const cards = buildStandingsRows(teams, matches, [], sport.id, stages);

    if (cards.length === 0) {
      continue;
    }

    sections.push({
      sport,
      cards,
      liveMatches: matches.filter((match) => match.status === "live").length,
      completedMatches: matches.filter((match) => match.status === "completed").length
    });
  }

  return sections;
}

export function buildTeamListCards(snapshot: RepositorySnapshot): TeamListCard[] {
  const sportsById = new Map(snapshot.sports.map((sport) => [sport.id, sport]));

  return snapshot.teams
    .filter((team) => team.isActive)
    .map((team) => {
      const matches = getMatchesForTeam(snapshot, team.id);
      return {
        team,
        sports: team.sportIds.map((sportId) => sportsById.get(sportId)).filter((sport): sport is Sport => Boolean(sport)),
        liveMatches: matches.filter((match) => match.status === "live"),
        upcomingMatches: matches.filter((match) => match.status === "scheduled" || match.status === "postponed"),
        completedMatches: matches.filter((match) => match.status === "completed")
      };
    })
    .sort((a, b) => a.team.name.localeCompare(b.team.name));
}

export function buildTeamStandings(snapshot: RepositorySnapshot, team: Team): TeamStandingsSnippet[] {
  const snippets: TeamStandingsSnippet[] = [];

  for (const sportId of team.sportIds) {
    const sport = snapshot.sports.find((item) => item.id === sportId);
    if (!sport) {
      continue;
    }

    const cards = buildStandingsRows(
      snapshot.teams.filter((candidate) => candidate.isActive && candidate.sportIds.includes(sportId)),
      getMatchesForSport(snapshot, sportId),
      [],
      sportId,
      getStagesForSport(snapshot, sportId)
    );
    const filteredCards = cards
      .map((card) => ({
        ...card,
        rows: card.rows.filter((row) => row.teamId === team.id)
      }))
      .filter((card) => card.rows.length > 0);

    if (filteredCards.length === 0) {
      continue;
    }

    snippets.push({
      sport,
      cards: filteredCards
    });
  }

  return snippets;
}

export function getTeamMatches(snapshot: RepositorySnapshot, teamId: string) {
  return getMatchesForTeam(snapshot, teamId);
}
