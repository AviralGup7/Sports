import type { CompetitionGroup, CompetitionStage, Match, StandingsRow } from "./types";
import type { SportSlug } from "../sports/types";
import type { Team } from "../teams/types";

function sortStandingsRows(rows: StandingsRow[]) {
  return [...rows]
    .sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      if (b.draws !== a.draws) {
        return b.draws - a.draws;
      }

      if (a.losses !== b.losses) {
        return a.losses - b.losses;
      }

      if (a.played !== b.played) {
        return a.played - b.played;
      }

      return (a.team?.seed ?? Number.MAX_SAFE_INTEGER) - (b.team?.seed ?? Number.MAX_SAFE_INTEGER);
    })
    .map((row, index) => ({
      ...row,
      rank: index + 1
    }));
}

export function buildStandingsRows(
  teams: Team[],
  matches: Match[],
  _groups: CompetitionGroup[],
  sportId: SportSlug,
  _stages: CompetitionStage[]
) {
  const sportTeams = teams.filter((team) => team.sportIds.includes(sportId));
  const rows = new Map<string, StandingsRow>();

  for (const team of sportTeams) {
    rows.set(team.id, {
      teamId: team.id,
      team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
      scoreFor: 0,
      scoreAgainst: 0,
      scoreDifference: 0
    });
  }

  for (const match of matches) {
    if (match.sportId !== sportId || match.status !== "completed" || !match.teamAId || !match.teamBId || !match.result) {
      continue;
    }

    const teamARow = rows.get(match.teamAId);
    const teamBRow = rows.get(match.teamBId);
    if (!teamARow || !teamBRow) {
      continue;
    }

    const teamAScore = match.result.teamAScore ?? 0;
    const teamBScore = match.result.teamBScore ?? 0;

    teamARow.played += 1;
    teamBRow.played += 1;
    teamARow.scoreFor += teamAScore;
    teamARow.scoreAgainst += teamBScore;
    teamBRow.scoreFor += teamBScore;
    teamBRow.scoreAgainst += teamAScore;
    teamARow.scoreDifference = teamARow.scoreFor - teamARow.scoreAgainst;
    teamBRow.scoreDifference = teamBRow.scoreFor - teamBRow.scoreAgainst;

    if (match.result.winnerTeamId === match.teamAId) {
      teamARow.wins += 1;
      teamARow.points += 2;
      teamBRow.losses += 1;
    } else if (match.result.winnerTeamId === match.teamBId) {
      teamBRow.wins += 1;
      teamBRow.points += 2;
      teamARow.losses += 1;
    } else {
      teamARow.draws += 1;
      teamBRow.draws += 1;
      teamARow.points += 1;
      teamBRow.points += 1;
    }
  }

  const ranked = sortStandingsRows(Array.from(rows.values())).map((row) => ({
    ...row,
    qualified: false
  }));

  if (ranked.length === 0) {
    return [];
  }

  return [
    {
      id: `${sportId}-knockout-summary`,
      label: "Knockout Summary",
      rows: ranked
    }
  ];
}
