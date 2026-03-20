import type { MatchResult } from "@/domain";

import { profilesSeed } from "./core";

export const resultsSeed: MatchResult[] = [
  {
    matchId: "cricket-ga-1",
    winnerTeamId: "andhra-samithi",
    teamAScore: 148,
    teamBScore: 142,
    decisionType: "normal",
    scoreSummary: "148/4 vs 142/7",
    note: "Andhra defended tightly at the death.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-02T12:10:00+05:30"
  },
  {
    matchId: "cricket-ga-2",
    winnerTeamId: "gurjari",
    teamAScore: 151,
    teamBScore: 144,
    decisionType: "normal",
    scoreSummary: "151/5 vs 144/8",
    note: "Gurjari closed on top after a late batting burst.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-02T15:35:00+05:30"
  },
  {
    matchId: "cricket-ga-3",
    winnerTeamId: "andhra-samithi",
    teamAScore: 133,
    teamBScore: 129,
    decisionType: "normal",
    scoreSummary: "133/7 vs 129/9",
    note: "A low-scoring win keeps Andhra top of Group A.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T11:45:00+05:30"
  },
  {
    matchId: "cricket-ga-4",
    winnerTeamId: "capitol",
    teamAScore: 155,
    teamBScore: 153,
    decisionType: "normal",
    scoreSummary: "155/6 vs 153/7",
    note: "Capitol stayed alive with a chase in the final over.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T15:10:00+05:30"
  },
  {
    matchId: "cricket-gb-1",
    winnerTeamId: "udgam",
    teamAScore: 139,
    teamBScore: 141,
    decisionType: "normal",
    scoreSummary: "139/8 vs 141/4",
    note: "Udgam paced the chase expertly.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-02T17:40:00+05:30"
  },
  {
    matchId: "cricket-gb-2",
    winnerTeamId: "madhyansh",
    teamAScore: 121,
    teamBScore: 126,
    decisionType: "normal",
    scoreSummary: "121/9 vs 126/5",
    note: "Madhyansh earned the cleaner net run-rate start.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-02T20:50:00+05:30"
  },
  {
    matchId: "cricket-gb-3",
    winnerTeamId: null,
    teamAScore: 67,
    teamBScore: 66,
    decisionType: "normal",
    scoreSummary: "67/1 vs 66/3",
    note: "Powerplay underway with Punjab narrowly ahead.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T16:35:00+05:30"
  },
  {
    matchId: "football-qf-1",
    winnerTeamId: "kannada-vedike",
    teamAScore: 1,
    teamBScore: 1,
    decisionType: "penalties",
    scoreSummary: "1 - 1 (4-3 pens)",
    note: "Kannada Vedike survived a penalty shootout.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T15:55:00+05:30"
  },
  {
    matchId: "football-qf-2",
    winnerTeamId: null,
    teamAScore: 1,
    teamBScore: 1,
    decisionType: "normal",
    scoreSummary: "1 - 1",
    note: "Second half in progress.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T16:55:00+05:30"
  },
  {
    matchId: "football-qf-3",
    winnerTeamId: "andhra-samithi",
    teamAScore: 2,
    teamBScore: 0,
    decisionType: "normal",
    scoreSummary: "2 - 0",
    note: "A composed defensive display secured the shutout.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T18:15:00+05:30"
  },
  {
    matchId: "volleyball-qf-1",
    winnerTeamId: "sangam",
    teamAScore: 1,
    teamBScore: 0,
    decisionType: "walkover",
    scoreSummary: "Bye to semi-final",
    note: "Top seed Sangam advances on a bracket bye.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T11:05:00+05:30"
  },
  {
    matchId: "volleyball-qf-2",
    winnerTeamId: "udgam",
    teamAScore: 2,
    teamBScore: 1,
    decisionType: "normal",
    scoreSummary: "25-21, 18-25, 15-12",
    note: "Udgam held firm in the decider.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T13:25:00+05:30"
  },
  {
    matchId: "volleyball-sf-1",
    winnerTeamId: "sangam",
    teamAScore: 3,
    teamBScore: 1,
    decisionType: "normal",
    scoreSummary: "25-19, 22-25, 25-17, 25-20",
    note: "Sangam reaches the final with a balanced attack.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-04T17:40:00+05:30"
  },
  {
    matchId: "athletics-heat-1",
    winnerTeamId: "pilani-tamil-mandram",
    teamAScore: 12,
    teamBScore: 11,
    decisionType: "normal",
    scoreSummary: "11.8s vs 12.1s",
    note: "Pilani Tamil Mandram topped Heat 1.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T16:22:00+05:30"
  },
  {
    matchId: "athletics-heat-2",
    winnerTeamId: "utkal-samaj",
    teamAScore: 12,
    teamBScore: 11,
    decisionType: "normal",
    scoreSummary: "11.9s vs 12.0s",
    note: "Photo finish separated the field in Heat 2.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T16:35:00+05:30"
  }
];
