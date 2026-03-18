import {
  Announcement,
  Match,
  Profile,
  Sport,
  SportSlug,
  Team,
  Tournament
} from "@/lib/types-domain";

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

export type BracketRound = {
  label: string;
  matches: Match[];
};

export type ScheduleGroup = {
  time: string;
  label: string;
  matches: Match[];
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
};

export type SchedulePageData = {
  days: string[];
  selectedDay: string;
  selectedSport?: SportSlug;
  sports: Sport[];
  fixtures: Match[];
  scheduleGroups: ScheduleGroup[];
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
  attentionItems: AdminAttentionItem[];
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
