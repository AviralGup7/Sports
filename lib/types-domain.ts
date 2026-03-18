export type Role = "super_admin" | "sport_admin";

export type SportSlug = "cricket" | "football" | "volleyball" | "athletics";

export type MatchStatus = "scheduled" | "live" | "completed" | "postponed" | "cancelled";

export type AnnouncementVisibility = "public" | "admin";

export type NextSlot = "team_a" | "team_b";

export type CompetitionStageType = "group" | "knockout" | "placement";

export type DecisionType = "normal" | "walkover" | "penalties" | "retired";

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  sportIds: SportSlug[];
};

export type Sport = {
  id: SportSlug;
  name: string;
  color: string;
  rulesSummary: string;
  format: string;
};

export type Team = {
  id: string;
  name: string;
  association: string;
  sportIds: SportSlug[];
  seed: number;
  isActive: boolean;
};

export type Tournament = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
};

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

export type Announcement = {
  id: string;
  title: string;
  body: string;
  visibility: AnnouncementVisibility;
  pinned: boolean;
  publishedAt: string;
  isPublished: boolean;
};
