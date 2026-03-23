import type { MatchResult } from "@/domain";

import { profilesSeed } from "./core";

export const resultsSeed: MatchResult[] = [
  {
    matchId: "cricket-qf-1",
    winnerTeamId: "andhra-samithi",
    teamAScore: 168,
    teamBScore: 149,
    decisionType: "normal",
    scoreSummary: "168/5 vs 149/8",
    note: "Andhra Samiti defended confidently to open the knockout draw.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-02T12:20:00+05:30"
  },
  {
    matchId: "cricket-qf-2",
    winnerTeamId: "gurjari",
    teamAScore: 154,
    teamBScore: 150,
    decisionType: "normal",
    scoreSummary: "154/6 vs 150/7",
    note: "Gurjari closed out a tight chase to book the first semi-final.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-02T16:25:00+05:30"
  },
  {
    matchId: "cricket-qf-3",
    winnerTeamId: null,
    teamAScore: 82,
    teamBScore: 79,
    decisionType: "normal",
    scoreSummary: "82/2 vs 79/4",
    note: "Punjab Cultural has the edge midway through the chase.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T16:45:00+05:30"
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
    note: "Second half in progress with both teams pressing.",
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
    teamAScore: 3,
    teamBScore: 0,
    decisionType: "normal",
    scoreSummary: "25-19, 25-22, 25-17",
    note: "Sangam rolled through in straight sets.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T11:50:00+05:30"
  },
  {
    matchId: "volleyball-qf-2",
    winnerTeamId: null,
    teamAScore: 1,
    teamBScore: 1,
    decisionType: "normal",
    scoreSummary: "25-21, 22-25",
    note: "Set three is underway in a balanced contest.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T13:12:00+05:30"
  },
  {
    matchId: "volleyball-qf-3",
    winnerTeamId: "marudhara",
    teamAScore: 3,
    teamBScore: 2,
    decisionType: "normal",
    scoreSummary: "22-25, 25-21, 21-25, 25-18, 15-11",
    note: "Marudhara recovered from a set down twice to advance.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T15:20:00+05:30"
  },
  {
    matchId: "athletics-qf-1",
    winnerTeamId: "gurjari",
    teamAScore: 11,
    teamBScore: 12,
    decisionType: "normal",
    scoreSummary: "11.62s vs 11.88s",
    note: "Gurjari qualified cleanly from the first sprint duel.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T09:42:00+05:30"
  },
  {
    matchId: "athletics-qf-2",
    winnerTeamId: "punjab-cultural",
    teamAScore: 11,
    teamBScore: 12,
    decisionType: "normal",
    scoreSummary: "11.71s vs 11.95s",
    note: "Punjab Cultural pulled away over the last 20 metres.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T10:28:00+05:30"
  },
  {
    matchId: "athletics-qf-3",
    winnerTeamId: null,
    teamAScore: 11,
    teamBScore: 11,
    decisionType: "normal",
    scoreSummary: "11.84s vs 11.86s",
    note: "Photo-finish check pending as the race comes alive.",
    updatedBy: profilesSeed[0].id,
    updatedAt: "2026-04-03T11:06:00+05:30"
  }
];
