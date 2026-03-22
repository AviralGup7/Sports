import type { MatchStatus, NextSlot } from "@/domain/matches/types";
import type { SportSlug } from "@/domain/sports/types";
import { requireAdminProfile } from "@/server/auth";

export type MatchRow = {
  id: string;
  sport_id: SportSlug;
  day: string;
  start_time: string;
  venue: string;
  status: MatchStatus;
  team_a_id: string | null;
  team_b_id: string | null;
  winner_to_match_id: string | null;
  winner_to_slot: NextSlot | null;
  loser_to_match_id: string | null;
  loser_to_slot: NextSlot | null;
  is_bye: boolean | null;
};

export type TeamRow = {
  id: string;
  name: string;
  association: string;
  seed: number;
  is_active: boolean;
};

export type TeamSportRow = {
  team_id: string;
  sport_id: SportSlug;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  visibility: "public" | "admin";
  pinned: boolean;
  is_published: boolean;
};

export type CommandContext = Awaited<ReturnType<typeof requireAdminProfile>>;

export type CommandResult = {
  message: string;
  sportIds?: SportSlug[];
  matchId?: string;
};

export type AssistantPreviewResult = {
  source: "groq" | "builtin";
  summary: string;
  commands: string[];
};

export type ResolvedTeam = TeamRow & {
  sportIds: SportSlug[];
};
