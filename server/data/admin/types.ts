import type { Announcement } from "@/domain/announcements/types";
import type { Profile } from "@/domain/admin/types";
import type { CompetitionGroup, CompetitionStage, Match } from "@/domain/matches/types";
import type { Sport } from "@/domain/sports/types";
import type { Team } from "@/domain/teams/types";
import type {
  BracketTreeData,
  GroupStandingsCard,
  StageSummary,
  TournamentStats
} from "@/server/data/public/types";

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

