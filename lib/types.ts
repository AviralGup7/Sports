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

export type TournamentStats = {
  sports: number;
  teams: number;
  matches: number;
  completedMatches: number;
  announcements: number;
};

export type ChampionEntry = {
  sport: Sport;
  winner: Team | null;
};

export type BracketRound = {
  label: string;
  matches: Match[];
};

export type HomePageData = {
  tournament: Tournament;
  sports: Sport[];
  stats: TournamentStats;
  featuredMatches: Match[];
  announcements: Announcement[];
  champions: ChampionEntry[];
};

export type SchedulePageData = {
  days: string[];
  selectedDay: string;
  selectedSport?: SportSlug;
  sports: Sport[];
  fixtures: Match[];
};

export type SportPageData = {
  sport: Sport;
  teams: Team[];
  matches: Match[];
  bracket: BracketRound[];
};

export type MatchPageData = {
  match: Match;
  sport: Sport;
  relatedMatches: Match[];
};

export type AdminDashboardData = {
  profile: Profile;
  stats: TournamentStats;
  todaysMatches: Match[];
  pendingResults: Match[];
  announcements: Announcement[];
};

export type AdminTeamsData = {
  profile: Profile;
  sports: Sport[];
  teams: Team[];
};

export type AdminMatchesData = {
  profile: Profile;
  sports: Sport[];
  teams: Team[];
  matches: Match[];
  days: string[];
};

export type AdminAnnouncementsData = {
  profile: Profile;
  announcements: Announcement[];
};

export type AdminSettingsData = {
  profile: Profile;
  envReady: boolean;
  exportedAt: string;
};
