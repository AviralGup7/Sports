export type Role = "super_admin" | "sport_admin";

export type SportSlug = "cricket" | "football" | "volleyball" | "athletics";

export type MatchStatus = "scheduled" | "live" | "completed";

export type AnnouncementVisibility = "public" | "admin";

export type NextSlot = "team_a" | "team_b";

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

export type MatchResult = {
  matchId: string;
  winnerTeamId: string | null;
  winner?: Team | null;
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
  teamAId: string | null;
  teamBId: string | null;
  status: MatchStatus;
  nextMatchId: string | null;
  nextSlot: NextSlot | null;
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
