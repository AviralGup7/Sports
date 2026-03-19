import type { Announcement } from "@/domain/announcements/types";
import type { CompetitionGroup, CompetitionStage, Match, MatchProgressionEdge, StandingsRow } from "@/domain/matches/types";
import type { Profile } from "@/domain/admin/types";
import type { Sport } from "@/domain/sports/types";
import type { Team } from "@/domain/teams/types";
import type { Tournament } from "@/domain/tournament/types";

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

export type TickerGroup = {
  id: string;
  label: string;
  tone: TickerItemTone;
  items: TickerItem[];
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

export type GroupStandingsCard = {
  group: CompetitionGroup;
  rows: StandingsRow[];
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
};

export type HomePageData = {
  tournament: Tournament;
  sports: Sport[];
  stats: TournamentStats;
  highlightMatch: HighlightMatch | null;
  heroSignals: HeroSignal[];
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
  selectedSport?: string;
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

export type PublicDataSeedProfile = {
  profile: Profile;
};

