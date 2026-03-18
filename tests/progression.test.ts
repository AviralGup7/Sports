import { describe, expect, it } from "vitest";

import { matchesSeed, teamsSeed } from "../lib/mock-data";
import { applyWinnerAdvancement } from "../lib/progression";

describe("applyWinnerAdvancement", () => {
  it("places the winner into the configured team_a slot", () => {
    const winner = teamsSeed.find((team) => team.id === "andhra-samithi") ?? null;
    const updatedMatches = applyWinnerAdvancement(matchesSeed, "cricket-qf-1", winner);
    const nextMatch = updatedMatches.find((match) => match.id === "cricket-sf-1");

    expect(nextMatch?.teamAId).toBe("andhra-samithi");
  });

  it("leaves matches unchanged when no progression target exists", () => {
    const winner = teamsSeed.find((team) => team.id === "pilani-tamil-mandram") ?? null;
    const updatedMatches = applyWinnerAdvancement(matchesSeed, "athletics-final", winner);
    const finalMatch = updatedMatches.find((match) => match.id === "athletics-final");

    expect(finalMatch?.teamAId).toBe("pilani-tamil-mandram");
    expect(finalMatch?.teamBId).toBe("utkal-samaj");
  });
});
