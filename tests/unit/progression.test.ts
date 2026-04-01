import { describe, expect, it } from "vitest";

import { applyWinnerAdvancement, buildProgressionEdges, buildStandingsRows } from "../../domain/matches";
import type { CompetitionGroup, CompetitionStage, Match, MatchResult, Team } from "../../domain";

const teams: Team[] = [
  { id: "andhra-samithi", name: "Andhra Samithi", association: "Andhra Samithi", sportIds: ["cricket"], seed: 1, isActive: true },
  { id: "madhyansh", name: "Tigers of M.P", association: "Madhyansh", sportIds: ["cricket"], seed: 2, isActive: true },
  { id: "gurjari", name: "Gujarat Titans", association: "Gurjari", sportIds: ["cricket"], seed: 3, isActive: true },
  { id: "capitol", name: "Capitol", association: "Capitol", sportIds: ["cricket"], seed: 4, isActive: true }
];

const stages: CompetitionStage[] = [
  { id: "cricket-knockout-stage", sportId: "cricket", type: "knockout", label: "Championship Bracket", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "cricket-placement-stage", sportId: "cricket", type: "placement", label: "Bronze Match", orderIndex: 2, advancesCount: 0, isActive: true }
];

const groups: CompetitionGroup[] = [];

const matches: Match[] = [
  {
    id: "cricket-sf-1",
    sportId: "cricket",
    round: "Semi Final 1",
    day: "2026-04-04",
    startTime: "18:00",
    venue: "Main Ground",
    stageId: "cricket-knockout-stage",
    groupId: null,
    roundIndex: 2,
    matchNumber: 1,
    teamAId: "andhra-samithi",
    teamBId: "madhyansh",
    status: "scheduled",
    winnerToMatchId: "cricket-final",
    winnerToSlot: "team_a",
    loserToMatchId: "cricket-third",
    loserToSlot: "team_a",
    nextMatchId: "cricket-final",
    nextSlot: "team_a",
    isBye: false
  },
  {
    id: "cricket-final",
    sportId: "cricket",
    round: "Grand Final",
    day: "2026-04-05",
    startTime: "20:00",
    venue: "Main Ground",
    stageId: "cricket-knockout-stage",
    groupId: null,
    roundIndex: 3,
    matchNumber: 1,
    teamAId: null,
    teamBId: null,
    status: "scheduled",
    winnerToMatchId: null,
    winnerToSlot: null,
    loserToMatchId: null,
    loserToSlot: null,
    nextMatchId: null,
    nextSlot: null,
    isBye: false
  },
  {
    id: "cricket-third",
    sportId: "cricket",
    round: "Third Place",
    day: "2026-04-05",
    startTime: "16:00",
    venue: "Main Ground",
    stageId: "cricket-placement-stage",
    groupId: null,
    roundIndex: 3,
    matchNumber: 1,
    teamAId: null,
    teamBId: null,
    status: "scheduled",
    winnerToMatchId: null,
    winnerToSlot: null,
    loserToMatchId: null,
    loserToSlot: null,
    nextMatchId: null,
    nextSlot: null,
    isBye: false
  },
  {
    id: "cricket-qf-1",
    sportId: "cricket",
    round: "Quarter Final 1",
    day: "2026-04-03",
    startTime: "15:00",
    venue: "Main Ground",
    stageId: "cricket-knockout-stage",
    groupId: null,
    roundIndex: 1,
    matchNumber: 1,
    teamAId: "andhra-samithi",
    teamBId: "capitol",
    status: "completed",
    winnerToMatchId: null,
    winnerToSlot: null,
    loserToMatchId: null,
    loserToSlot: null,
    nextMatchId: null,
    nextSlot: null,
    isBye: false
  },
  {
    id: "cricket-qf-2",
    sportId: "cricket",
    round: "Quarter Final 2",
    day: "2026-04-03",
    startTime: "17:00",
    venue: "Main Ground",
    stageId: "cricket-knockout-stage",
    groupId: null,
    roundIndex: 1,
    matchNumber: 2,
    teamAId: "gurjari",
    teamBId: "madhyansh",
    status: "completed",
    winnerToMatchId: null,
    winnerToSlot: null,
    loserToMatchId: null,
    loserToSlot: null,
    nextMatchId: null,
    nextSlot: null,
    isBye: false
  }
];

const results: MatchResult[] = [
  {
    matchId: "cricket-qf-1",
    winnerTeamId: "andhra-samithi",
    teamAScore: 150,
    teamBScore: 120,
    decisionType: "normal",
    scoreSummary: "150/5 vs 120/9",
    note: null,
    updatedBy: null,
    updatedAt: null
  },
  {
    matchId: "cricket-qf-2",
    winnerTeamId: "gurjari",
    teamAScore: 140,
    teamBScore: 132,
    decisionType: "normal",
    scoreSummary: "140/7 vs 132/8",
    note: null,
    updatedBy: null,
    updatedAt: null
  }
];

describe("progression engine", () => {
  it("places winner and loser into the configured follow-up slots", () => {
    const winner = teams.find((team) => team.id === "andhra-samithi") ?? null;
    const loser = teams.find((team) => team.id === "madhyansh") ?? null;
    const updatedMatches = applyWinnerAdvancement(matches, "cricket-sf-1", winner, loser);
    const finalMatch = updatedMatches.find((match) => match.id === "cricket-final");
    const thirdPlace = updatedMatches.find((match) => match.id === "cricket-third");

    expect(finalMatch?.teamAId).toBe("andhra-samithi");
    expect(thirdPlace?.teamAId).toBe("madhyansh");
  });

  it("builds ordered group standings with qualification markers", () => {
    const cricketTeams = teams.filter((team) => team.sportIds.includes("cricket"));
    const cricketMatches = matches
      .filter((match) => match.sportId === "cricket")
      .map((match) => ({
        ...match,
        result: results.find((result) => result.matchId === match.id) ?? null
      }));
    const cards = buildStandingsRows(cricketTeams, cricketMatches, groups, "cricket", stages);
    const summary = cards[0];

    expect(summary?.label).toBe("Knockout Summary");
    expect(summary?.rows[0].teamId).toBe("andhra-samithi");
    expect(summary?.rows[1].teamId).toBe("gurjari");
  });

  it("builds winner and loser progression edges for bracket trees", () => {
    const cricketMatches = matches.filter((match) => match.sportId === "cricket");
    const edges = buildProgressionEdges(cricketMatches);

    expect(edges.some((edge) => edge.sourceMatchId === "cricket-sf-1" && edge.kind === "winner" && edge.targetMatchId === "cricket-final")).toBe(true);
    expect(edges.some((edge) => edge.sourceMatchId === "cricket-sf-1" && edge.kind === "loser" && edge.targetMatchId === "cricket-third")).toBe(true);
  });
});
