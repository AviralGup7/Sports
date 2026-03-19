import type { Match, MatchProgressionEdge } from "./types";
import type { Team } from "../teams/types";

export function applyWinnerAdvancement(
  matches: Match[],
  completedMatchId: string,
  winnerTeam: Team | null,
  loserTeam: Team | null = null
) {
  const sourceMatch = matches.find((match) => match.id === completedMatchId);
  if (!sourceMatch || (!winnerTeam && !loserTeam)) {
    return matches;
  }

  return matches.map((match) => {
    let updated = match;

    if (winnerTeam && sourceMatch.winnerToMatchId && match.id === sourceMatch.winnerToMatchId && sourceMatch.winnerToSlot) {
      updated =
        sourceMatch.winnerToSlot === "team_a"
          ? {
              ...updated,
              teamAId: winnerTeam.id,
              teamA: winnerTeam
            }
          : {
              ...updated,
              teamBId: winnerTeam.id,
              teamB: winnerTeam
            };
    }

    if (loserTeam && sourceMatch.loserToMatchId && match.id === sourceMatch.loserToMatchId && sourceMatch.loserToSlot) {
      updated =
        sourceMatch.loserToSlot === "team_a"
          ? {
              ...updated,
              teamAId: loserTeam.id,
              teamA: loserTeam
            }
          : {
              ...updated,
              teamBId: loserTeam.id,
              teamB: loserTeam
            };
    }

    return updated;
  });
}

export function buildProgressionEdges(matches: Match[]): MatchProgressionEdge[] {
  const edges: MatchProgressionEdge[] = [];

  for (const match of matches) {
    if (match.winnerToMatchId && match.winnerToSlot) {
      edges.push({
        sourceMatchId: match.id,
        targetMatchId: match.winnerToMatchId,
        slot: match.winnerToSlot,
        kind: "winner"
      });
    }

    if (match.loserToMatchId && match.loserToSlot) {
      edges.push({
        sourceMatchId: match.id,
        targetMatchId: match.loserToMatchId,
        slot: match.loserToSlot,
        kind: "loser"
      });
    }
  }

  return edges;
}
