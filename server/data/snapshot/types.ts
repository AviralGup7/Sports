import type { Announcement } from "@/domain/announcements/types";
import type { CompetitionGroup, CompetitionStage, DecisionType, Match, MatchResult, MatchStatus } from "@/domain/matches/types";
import type { Sport, SportSlug } from "@/domain/sports/types";
import type { Team } from "@/domain/teams/types";
import type { Tournament } from "@/domain/tournament/types";

export type SportRow = { id: SportSlug; name: string; color: string; rules_summary: string; format: string };
export type TeamRow = { id: string; name: string; association: string; seed: number; is_active: boolean };
export type TeamSportRow = { team_id: string; sport_id: SportSlug };
export type TournamentRow = { id: string; name: string; start_date: string; end_date: string; venue: string };
export type StageRow = {
  id: string;
  sport_id: SportSlug;
  type: "group" | "knockout" | "placement";
  label: string;
  order_index: number;
  advances_count: number;
  is_active: boolean;
};
export type GroupRow = {
  id: string;
  stage_id: string;
  sport_id: SportSlug;
  code: string;
  order_index: number;
};
export type MatchRow = {
  id: string;
  sport_id: SportSlug;
  round: string;
  day: string;
  start_time: string;
  venue: string;
  stage_id: string | null;
  group_id: string | null;
  round_index: number | null;
  match_number: number | null;
  team_a_id: string | null;
  team_b_id: string | null;
  status: MatchStatus;
  winner_to_match_id: string | null;
  winner_to_slot: "team_a" | "team_b" | null;
  loser_to_match_id: string | null;
  loser_to_slot: "team_a" | "team_b" | null;
  next_match_id: string | null;
  next_slot: "team_a" | "team_b" | null;
  is_bye: boolean | null;
};
export type MatchResultRow = {
  match_id: string;
  winner_team_id: string | null;
  team_a_score: number | null;
  team_b_score: number | null;
  decision_type: DecisionType | null;
  score_summary: string | null;
  note: string | null;
  updated_by: string | null;
  updated_at: string | null;
};
export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  visibility: "public" | "admin";
  pinned: boolean;
  published_at: string;
  is_published: boolean;
};

export type RepositorySnapshot = {
  tournament: Tournament;
  sports: Sport[];
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  teams: Team[];
  matches: Match[];
  announcements: Announcement[];
};

