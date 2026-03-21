import type { Announcement } from "@/domain/announcements/types";
import type { Profile } from "@/domain/admin/types";
import type { CompetitionGroup, CompetitionStage, Match } from "@/domain/matches/types";
import type { Sport } from "@/domain/sports/types";
import type { Team } from "@/domain/teams/types";
import type {
  AthleticsEventBoard,
  BracketPreviewCard,
  BracketTreeData,
  GroupStandingsCard,
  SportProgressCard,
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
  dayNote: {
    id: string;
    title: string;
    detail: string;
    tone: "info" | "alert" | "success";
  };
  todaysMatches: Match[];
  pendingResults: Match[];
  announcements: Announcement[];
  teams: Team[];
  attentionItems: AdminAttentionItem[];
  stageSummaries: StageSummary[];
  sportProgressCards: SportProgressCard[];
  bracketPreviewCards: BracketPreviewCard[];
  backupStatus: {
    envReady: boolean;
    usingFallbackData: boolean;
    exportedAt: string;
    note: string;
  };
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

export type QuickResultCandidate = {
  id: string;
  matchId: string;
  sportId: string;
  matchLabel: string;
  teamAName: string;
  teamBName: string;
  winnerTeamId: string | null;
  scoreSummary: string | null;
  progressionHint: string;
  status: Match["status"];
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
  athleticsBoards: AthleticsEventBoard[];
  integrityIssues: IntegrityIssue[];
  quickResultCandidates: QuickResultCandidate[];
  operatorGuide: string[];
};

export type AdminAnnouncementsData = {
  profile: Profile;
  announcements: Announcement[];
};

export type AdminSettingsData = {
  profile: Profile;
  envReady: boolean;
  usingFallbackData: boolean;
  exportedAt: string;
};

