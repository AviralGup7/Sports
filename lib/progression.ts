import { Match, Team } from "@/lib/types";

export function applyWinnerAdvancement(matches: Match[], completedMatchId: string, winnerTeam: Team | null) {
  if (!winnerTeam) {
    return matches;
  }

  const sourceMatch = matches.find((match) => match.id === completedMatchId);
  if (!sourceMatch?.nextMatchId || !sourceMatch.nextSlot) {
    return matches;
  }

  return matches.map((match) => {
    if (match.id !== sourceMatch.nextMatchId) {
      return match;
    }

    if (sourceMatch.nextSlot === "team_a") {
      return {
        ...match,
        teamAId: winnerTeam.id
      };
    }

    return {
      ...match,
      teamBId: winnerTeam.id
    };
  });
}
