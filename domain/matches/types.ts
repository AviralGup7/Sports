import type { SportSlug } from "../sports/types";
import type { Team } from "../teams/types";

export type MatchStatus = "scheduled" | "live" | "completed" | "postponed" | "cancelled";

export type NextSlot = "team_a" | "team_b";

export type CompetitionStageType = "group" | "knockout" | "placement";

export type DecisionType = "normal" | "walkover" | "penalties" | "retired";

export type CompetitionStage = {
  id: string;
  sportId: SportSlug;
  type: CompetitionStageType;
  label: string;
  orderIndex: number;
  advancesCount: number;
  isActive: boolean;
};

export type CompetitionGroup = {
  id: string;
  stageId: string;
  sportId: SportSlug;
  code: string;
  orderIndex: number;
};

export type MatchProgressionEdge = {
  sourceMatchId: string;
  targetMatchId: string;
  slot: NextSlot;
  kind: "winner" | "loser";
};

export type StandingsRow = {
  teamId: string;
  team?: Team | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  scoreFor: number;
  scoreAgainst: number;
  scoreDifference: number;
  rank?: number;
  qualified?: boolean;
};

export type MatchResult = {
  matchId: string;
  winnerTeamId: string | null;
  winner?: Team | null;
  teamAScore: number | null;
  teamBScore: number | null;
  decisionType: DecisionType;
  scoreSummary: string | null;
  note: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
};

export type Match = {
  id: string;
  sportId: SportSlug;
  round: string;
  day: string;
  startTime: string;
  venue: string;
  stageId: string | null;
  groupId: string | null;
  roundIndex: number;
  matchNumber: number;
  teamAId: string | null;
  teamBId: string | null;
  status: MatchStatus;
  winnerToMatchId: string | null;
  winnerToSlot: NextSlot | null;
  loserToMatchId: string | null;
  loserToSlot: NextSlot | null;
  nextMatchId: string | null;
  nextSlot: NextSlot | null;
  isBye: boolean;
  stage?: CompetitionStage | null;
  group?: CompetitionGroup | null;
  teamA?: Team | null;
  teamB?: Team | null;
  result?: MatchResult | null;
};
