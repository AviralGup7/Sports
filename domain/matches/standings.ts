import type { CompetitionGroup, CompetitionStage, Match, StandingsRow } from "./types";
import type { SportSlug } from "../sports/types";
import type { Team } from "../teams/types";

function sortStandingsRows(rows: StandingsRow[]) {
  return [...rows]
    .sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      if (b.scoreDifference !== a.scoreDifference) {
        return b.scoreDifference - a.scoreDifference;
      }

      if (b.scoreFor !== a.scoreFor) {
        return b.scoreFor - a.scoreFor;
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
  groups: CompetitionGroup[],
  sportId: SportSlug,
  stages: CompetitionStage[]
) {
  const relevantGroupIds = new Set(groups.filter((group) => group.sportId === sportId).map((group) => group.id));
  const relevantStageIds = new Set(
    stages.filter((stage) => stage.sportId === sportId && stage.type === "group").map((stage) => stage.id)
  );

  return groups
    .filter((group) => group.sportId === sportId)
    .map((group) => {
      const groupTeamIds = new Set(
        matches
          .filter((match) => match.groupId === group.id)
          .flatMap((match) => [match.teamAId, match.teamBId])
          .filter((teamId): teamId is string => Boolean(teamId))
      );
      const groupTeams = teams.filter((team) => groupTeamIds.has(team.id));
      const rows = new Map<string, StandingsRow>();

      for (const team of groupTeams) {
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
        if (!match.groupId || match.groupId !== group.id || !relevantGroupIds.has(match.groupId) || !match.stageId || !relevantStageIds.has(match.stageId)) {
          continue;
        }

        if (match.status !== "completed" || !match.teamAId || !match.teamBId || !match.result) {
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

      const ranked = sortStandingsRows(Array.from(rows.values()).filter((row) => row.played > 0)).map((row, index) => ({
        ...row,
        qualified: index < ((stages.find((stage) => stage.id === group.stageId)?.advancesCount ?? 0) || 0)
      }));

      return {
        group,
        rows: ranked
      };
    })
    .filter((card) => card.rows.length > 0);
}
