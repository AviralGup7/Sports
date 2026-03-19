import { describe, expect, it } from "vitest";

import { applyWinnerAdvancement, buildProgressionEdges, buildStandingsRows } from "../../domain/matches";
import { competitionGroupsSeed, competitionStagesSeed, matchesSeed, resultsSeed, teamsSeed } from "../../server/mock/tournament-snapshot";

describe("progression engine", () => {
  it("places winner and loser into the configured follow-up slots", () => {
    const winner = teamsSeed.find((team) => team.id === "andhra-samithi") ?? null;
    const loser = teamsSeed.find((team) => team.id === "madhyansh") ?? null;
    const updatedMatches = applyWinnerAdvancement(matchesSeed, "cricket-sf-1", winner, loser);
    const finalMatch = updatedMatches.find((match) => match.id === "cricket-final");
    const thirdPlace = updatedMatches.find((match) => match.id === "cricket-third");

    expect(finalMatch?.teamAId).toBe("andhra-samithi");
    expect(thirdPlace?.teamAId).toBe("madhyansh");
  });

  it("builds ordered group standings with qualification markers", () => {
    const cricketTeams = teamsSeed.filter((team) => team.sportIds.includes("cricket"));
    const cricketMatches = matchesSeed
      .filter((match) => match.sportId === "cricket")
      .map((match) => ({
        ...match,
        result: resultsSeed.find((result) => result.matchId === match.id) ?? null
      }));
    const cards = buildStandingsRows(cricketTeams, cricketMatches, competitionGroupsSeed, "cricket", competitionStagesSeed);
    const groupA = cards.find((card) => card.group.id === "cricket-group-a");

    expect(groupA?.rows[0].teamId).toBe("andhra-samithi");
    expect(groupA?.rows[0].qualified).toBe(true);
    expect(groupA?.rows[1].teamId).toBe("gurjari");
    expect(groupA?.rows[1].qualified).toBe(true);
  });

  it("builds winner and loser progression edges for bracket trees", () => {
    const cricketMatches = matchesSeed.filter((match) => match.sportId === "cricket");
    const edges = buildProgressionEdges(cricketMatches);

    expect(edges.some((edge) => edge.sourceMatchId === "cricket-sf-1" && edge.kind === "winner" && edge.targetMatchId === "cricket-final")).toBe(true);
    expect(edges.some((edge) => edge.sourceMatchId === "cricket-sf-1" && edge.kind === "loser" && edge.targetMatchId === "cricket-third")).toBe(true);
  });
});
