import {
  Announcement,
  CompetitionGroup,
  CompetitionStage,
  Match,
  MatchProgressionEdge,
  Profile,
  Sport,
  SportSlug,
  StandingsRow,
  Team,
  Tournament
} from "@/lib/types-domain";

export type TournamentStats = {
  sports: number;
  teams: number;
  matches: number;
  completedMatches: number;
  liveMatches: number;
  announcements: number;
};

export type ChampionEntry = {
  sport: Sport;
  winner: Team | null;
};

export type TickerItemTone = "live" | "alert" | "info";

export type TickerItem = {
  id: string;
  label: string;
  message: string;
  href?: string;
  tone: TickerItemTone;
};

export type HighlightMatch = {
  match: Match;
  sport: Sport;
  label: string;
  headline: string;
  summary: string;
};

export type ChampionSpotlight = {
  sport: Sport;
  winner: Team | null;
  statusLabel: string;
  note: string;
};

export type StageSummary = {
  stage: CompetitionStage;
  totalMatches: number;
  completedMatches: number;
  liveMatches: number;
  pendingMatches: number;
  groups: CompetitionGroup[];
};

export type ScheduleGroup = {
  time: string;
  label: string;
  matches: Match[];
};

export type BracketTreeNode = {
  id: string;
  columnId: string;
  match: Match;
  title: string;
  subtitle: string;
  state: "live" | "completed" | "pending" | "bye" | "postponed";
  isHighlighted: boolean;
};

export type BracketTreeColumn = {
  id: string;
  label: string;
  count: number;
  nodes: BracketTreeNode[];
};

export type BracketTreeData = {
  columns: BracketTreeColumn[];
  edges: MatchProgressionEdge[];
};

export type GroupStandingsCard = {
  group: CompetitionGroup;
  rows: StandingsRow[];
};

export type MatchLineageCard = {
  label: string;
  matches: Match[];
};

export type IntegrityIssue = {
  id: string;
  severity: "warning" | "error";
  title: string;
  detail: string;
  matchId?: string;
};

export type AdminAttentionItemTone = "alert" | "live" | "success" | "neutral";

export type AdminAttentionItem = {
  id: string;
  label: string;
  value: string;
  detail: string;
  href: string;
  tone: AdminAttentionItemTone;
};

export type GlobalChromeData = {
  tournament: Tournament;
  sports: Sport[];
  tickerItems: TickerItem[];
};

export type HomePageData = {
  tournament: Tournament;
  sports: Sport[];
  stats: TournamentStats;
  highlightMatch: HighlightMatch | null;
  featuredMatches: Match[];
  announcements: Announcement[];
  champions: ChampionEntry[];
  championSpotlights: ChampionSpotlight[];
  stageSummaries: Array<{
    sport: Sport;
    activeStage: CompetitionStage | null;
    liveMatches: number;
    completedMatches: number;
    totalMatches: number;
  }>;
};

export type SchedulePageData = {
  days: string[];
  selectedDay: string;
  selectedSport?: SportSlug;
  selectedStage?: string;
  selectedGroup?: string;
  selectedStatus?: string;
  sports: Sport[];
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  fixtures: Match[];
  scheduleGroups: ScheduleGroup[];
};

export type SportPageData = {
  sport: Sport;
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  stageSummaries: StageSummary[];
  teams: Team[];
  matches: Match[];
  standings: GroupStandingsCard[];
  bracket: BracketTreeData | null;
  overviewMatches: Match[];
  athleticsMatches: Match[];
};

export type MatchPageData = {
  match: Match;
  sport: Sport;
  relatedMatches: Match[];
  lineage: MatchLineageCard[];
  bracketNeighbors: Match[];
};

export type AdminDashboardData = {
  profile: Profile;
  stats: TournamentStats;
  todaysMatches: Match[];
  pendingResults: Match[];
  announcements: Announcement[];
  attentionItems: AdminAttentionItem[];
  stageSummaries: StageSummary[];
};

export type BuilderCard = {
  sport: Sport;
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  standings: GroupStandingsCard[];
  bracket: BracketTreeData | null;
  integrityIssues: IntegrityIssue[];
  teams: Team[];
};

export type AthleticsResultCard = {
  id: string;
  title: string;
  matches: Match[];
};

export type AdminTeamsData = {
  profile: Profile;
  sports: Sport[];
  teams: Team[];
};

export type AdminMatchesData = {
  profile: Profile;
  sports: Sport[];
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  teams: Team[];
  matches: Match[];
  days: string[];
  builderCards: BuilderCard[];
  athleticsCards: AthleticsResultCard[];
  integrityIssues: IntegrityIssue[];
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
