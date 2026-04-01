import type { Announcement } from "@/domain/announcements/types";
import type { CompetitionStage, Match, MatchProgressionEdge, StandingsRow } from "@/domain/matches/types";
import type { Profile } from "@/domain/admin/types";
import type { Sport } from "@/domain/sports/types";
import type { Team } from "@/domain/teams/types";
import type { Tournament } from "@/domain/tournament/types";

export type DataState = {
  source: "supabase" | "fallback";
  label: string;
  detail: string;
  generatedAt: string;
};

export type TournamentStats = {
  sports: number;
  teams: number;
  matches: number;
  completedMatches: number;
  liveMatches: number;
  announcements: number;
};

export type DayNote = {
  id: string;
  title: string;
  detail: string;
  tone: "info" | "alert" | "success";
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

export type TickerGroup = {
  id: string;
  label: string;
  tone: TickerItemTone;
  items: TickerItem[];
};

export type FreshnessInfo = {
  generatedAt: string;
};

export type NextMatchCountdown = {
  match: Match;
  sport: Sport;
  startsAt: string;
};

export type HighlightMatch = {
  match: Match;
  sport: Sport;
  label: string;
  headline: string;
  summary: string;
  urgency: "live" | "watch" | "next";
};

export type HeroSignal = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "live" | "alert" | "info" | "neutral";
  href?: string;
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
};

export type SportProgressCard = {
  sport: Sport;
  completedMatches: number;
  totalMatches: number;
  liveMatches: number;
  pendingMatches: number;
  finalsPending: number;
  completionPercent: number;
  activeStageLabel: string;
  note: string;
  href: string;
};

export type BracketPreviewCard = {
  sport: Sport;
  stageLabel: string;
  championLabel: string;
  href: string;
  rounds: Array<{
    label: string;
    filled: number;
    total: number;
  }>;
};

export type ScheduleGroup = {
  time: string;
  label: string;
  matches: Match[];
};

export type SportScheduleBlock = {
  sport: Sport;
  visibleCount: number;
  activeStageLabel: string;
  scheduleGroups: ScheduleGroup[];
};

export type BracketTreeNode = {
  id: string;
  columnId: string;
  match: Match;
  title: string;
  subtitle: string;
  state: "live" | "completed" | "pending" | "bye" | "postponed" | "cancelled";
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
  highlightPaths: Array<{
    matchId: string;
    edgeKeys: string[];
    linkedMatchIds: string[];
  }>;
};

export type StandingsCard = {
  id: string;
  label: string;
  rows: StandingsRow[];
};

export type GroupStandingsCard = StandingsCard;

export type AthleticsEventBoard = {
  id: string;
  title: string;
  stageLabel: string;
  description: string;
  matches: Match[];
};

export type MatchLineageCard = {
  label: string;
  matches: Match[];
};

export type GlobalChromeData = {
  tournament: Tournament;
  sports: Sport[];
  tickerItems: TickerItem[];
  tickerGroups: TickerGroup[];
  dataState: DataState;
};

export type HomePageData = {
  generatedAt: string;
  dataState: DataState;
  tournament: Tournament;
  sports: Sport[];
  stats: TournamentStats;
  dayNote: DayNote;
  highlightMatch: HighlightMatch | null;
  nextMatch: NextMatchCountdown | null;
  heroSignals: HeroSignal[];
  featuredMatches: Match[];
  announcements: Announcement[];
  champions: ChampionEntry[];
  championSpotlights: ChampionSpotlight[];
  sportProgressCards: SportProgressCard[];
  bracketPreviewCards: BracketPreviewCard[];
  stageSummaries: Array<{
    sport: Sport;
    activeStage: CompetitionStage | null;
    liveMatches: number;
    completedMatches: number;
    totalMatches: number;
  }>;
};

export type AnnouncementsPageData = {
  generatedAt: string;
  dataState: DataState;
  items: Announcement[];
};

export type SchedulePageData = {
  generatedAt: string;
  dataState: DataState;
  days: string[];
  selectedDay: string;
  selectedSport?: string;
  selectedStatus?: string;
  sports: Sport[];
  dayNote: DayNote;
  fixtures: Match[];
  scheduleGroups: ScheduleGroup[];
  sportBlocks: SportScheduleBlock[];
};

export type SportPageData = {
  generatedAt: string;
  dataState: DataState;
  sport: Sport;
  stages: CompetitionStage[];
  stageSummaries: StageSummary[];
  teams: Team[];
  matches: Match[];
  standings: StandingsCard[];
  bracket: BracketTreeData | null;
  sportProgressCard: SportProgressCard;
  bracketPreview: BracketPreviewCard | null;
  overviewMatches: Match[];
};

export type MatchPageData = {
  generatedAt: string;
  dataState: DataState;
  match: Match;
  sport: Sport;
  relatedMatches: Match[];
  lineage: MatchLineageCard[];
  bracketNeighbors: Match[];
  winnerTargetMatch: Match | null;
  loserTargetMatch: Match | null;
};

export type PublicDataSeedProfile = {
  profile: Profile;
};

export type StandingsSportCard = {
  sport: Sport;
  cards: StandingsCard[];
  liveMatches: number;
  completedMatches: number;
};

export type StandingsPageData = {
  generatedAt: string;
  dataState: DataState;
  sports: Sport[];
  selectedSport?: string;
  sections: StandingsSportCard[];
};

export type TeamListCard = {
  team: Team;
  sports: Sport[];
  upcomingMatches: Match[];
  completedMatches: Match[];
  liveMatches: Match[];
};

export type TeamsPageData = {
  generatedAt: string;
  dataState: DataState;
  teams: TeamListCard[];
  sports: Sport[];
};

export type TeamStandingsSnippet = {
  sport: Sport;
  cards: StandingsCard[];
};

export type TeamProfilePageData = {
  generatedAt: string;
  dataState: DataState;
  team: Team;
  sports: Sport[];
  liveMatches: Match[];
  upcomingMatches: Match[];
  completedMatches: Match[];
  standings: TeamStandingsSnippet[];
};

