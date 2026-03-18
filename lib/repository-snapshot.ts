import { unstable_noStore as noStore } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  announcementsSeed,
  competitionGroupsSeed,
  competitionStagesSeed,
  matchesSeed,
  resultsSeed,
  sportOrder,
  sportsSeed,
  teamsSeed,
  tournamentSeed
} from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  Announcement,
  CompetitionGroup,
  CompetitionStage,
  DecisionType,
  Match,
  MatchResult,
  MatchStatus,
  Sport,
  SportSlug,
  Team,
  Tournament
} from "@/lib/types-domain";

type SportRow = { id: SportSlug; name: string; color: string; rules_summary: string; format: string };
type TeamRow = { id: string; name: string; association: string; seed: number; is_active: boolean };
type TeamSportRow = { team_id: string; sport_id: SportSlug };
type TournamentRow = { id: string; name: string; start_date: string; end_date: string; venue: string };
type StageRow = {
  id: string;
  sport_id: SportSlug;
  type: "group" | "knockout" | "placement";
  label: string;
  order_index: number;
  advances_count: number;
  is_active: boolean;
};
type GroupRow = {
  id: string;
  stage_id: string;
  sport_id: SportSlug;
  code: string;
  order_index: number;
};
type MatchRow = {
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
type MatchResultRow = {
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
type AnnouncementRow = {
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

function hydrateSnapshot(input: {
  tournament: Tournament;
  sports: Sport[];
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  teams: Team[];
  results: MatchResult[];
  matches: Match[];
  announcements: Announcement[];
}): RepositorySnapshot {
  const teamsById = new Map(input.teams.map((team) => [team.id, team]));
  const stagesById = new Map(input.stages.map((stage) => [stage.id, stage]));
  const groupsById = new Map(input.groups.map((group) => [group.id, group]));
  const resultsByMatchId = new Map(input.results.map((result) => [result.matchId, result]));

  const matches = input.matches
    .map((match) => {
      const result = resultsByMatchId.get(match.id) ?? null;
      const winner = result?.winnerTeamId ? teamsById.get(result.winnerTeamId) ?? null : null;

      return {
        ...match,
        stage: match.stageId ? stagesById.get(match.stageId) ?? null : null,
        group: match.groupId ? groupsById.get(match.groupId) ?? null : null,
        teamA: match.teamAId ? teamsById.get(match.teamAId) ?? null : null,
        teamB: match.teamBId ? teamsById.get(match.teamBId) ?? null : null,
        result: result
          ? {
              ...result,
              winner
            }
          : null
      };
    })
    .sort((a, b) => `${a.day}T${a.startTime}`.localeCompare(`${b.day}T${b.startTime}`));

  const announcements = [...input.announcements].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );

  return {
    tournament: input.tournament,
    sports: [...input.sports].sort((a, b) => sportOrder.indexOf(a.id) - sportOrder.indexOf(b.id)),
    stages: [...input.stages].sort((a, b) => a.orderIndex - b.orderIndex || a.label.localeCompare(b.label)),
    groups: [...input.groups].sort((a, b) => a.orderIndex - b.orderIndex || a.code.localeCompare(b.code)),
    teams: [...input.teams].sort((a, b) => a.seed - b.seed || a.name.localeCompare(b.name)),
    matches,
    announcements
  };
}

function getFallbackSnapshot() {
  return hydrateSnapshot({
    tournament: tournamentSeed,
    sports: sportsSeed,
    stages: competitionStagesSeed,
    groups: competitionGroupsSeed,
    teams: teamsSeed,
    results: resultsSeed,
    matches: matchesSeed,
    announcements: announcementsSeed
  });
}

export async function loadSnapshot(): Promise<RepositorySnapshot> {
  noStore();

  if (!hasSupabaseEnv()) {
    return getFallbackSnapshot();
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [
      preferredTournamentRes,
      fallbackTournamentRes,
      sportsRes,
      stagesRes,
      groupsRes,
      teamsRes,
      teamSportsRes,
      matchesRes,
      resultsRes,
      announcementsRes
    ] = await Promise.all([
      supabase.from("tournaments").select("id, name, start_date, end_date, venue").eq("id", tournamentSeed.id).maybeSingle<TournamentRow>(),
      supabase.from("tournaments").select("id, name, start_date, end_date, venue").order("start_date", { ascending: true }).limit(1).returns<TournamentRow[]>(),
      supabase.from("sports").select("id, name, color, rules_summary, format").returns<SportRow[]>(),
      supabase
        .from("competition_stages")
        .select("id, sport_id, type, label, order_index, advances_count, is_active")
        .returns<StageRow[]>(),
      supabase
        .from("competition_groups")
        .select("id, stage_id, sport_id, code, order_index")
        .returns<GroupRow[]>(),
      supabase.from("teams").select("id, name, association, seed, is_active").returns<TeamRow[]>(),
      supabase.from("team_sports").select("team_id, sport_id").returns<TeamSportRow[]>(),
      supabase
        .from("matches")
        .select(
          "id, sport_id, round, day, start_time, venue, stage_id, group_id, round_index, match_number, team_a_id, team_b_id, status, winner_to_match_id, winner_to_slot, loser_to_match_id, loser_to_slot, next_match_id, next_slot, is_bye"
        )
        .returns<MatchRow[]>(),
      supabase
        .from("match_results")
        .select("match_id, winner_team_id, team_a_score, team_b_score, decision_type, score_summary, note, updated_by, updated_at")
        .returns<MatchResultRow[]>(),
      supabase
        .from("announcements")
        .select("id, title, body, visibility, pinned, published_at, is_published")
        .returns<AnnouncementRow[]>()
    ]);

    const tournamentRow = preferredTournamentRes.data ?? fallbackTournamentRes.data?.[0] ?? null;

    if (
      preferredTournamentRes.error ||
      fallbackTournamentRes.error ||
      sportsRes.error ||
      stagesRes.error ||
      groupsRes.error ||
      teamsRes.error ||
      teamSportsRes.error ||
      matchesRes.error ||
      resultsRes.error ||
      announcementsRes.error ||
      !tournamentRow
    ) {
      throw new Error(
        [
          preferredTournamentRes.error?.message,
          fallbackTournamentRes.error?.message,
          sportsRes.error?.message,
          stagesRes.error?.message,
          groupsRes.error?.message,
          teamsRes.error?.message,
          teamSportsRes.error?.message,
          matchesRes.error?.message,
          resultsRes.error?.message,
          announcementsRes.error?.message
        ]
          .filter(Boolean)
          .join(" | ")
      );
    }

    const teamSportsByTeamId = new Map<string, SportSlug[]>();
    for (const relation of teamSportsRes.data) {
      const existing = teamSportsByTeamId.get(relation.team_id) ?? [];
      existing.push(relation.sport_id);
      teamSportsByTeamId.set(relation.team_id, existing);
    }

    const tournament: Tournament = {
      id: tournamentRow.id,
      name: tournamentRow.name,
      startDate: tournamentRow.start_date,
      endDate: tournamentRow.end_date,
      venue: tournamentRow.venue
    };

    const sports: Sport[] = sportsRes.data.map((sport) => ({
      id: sport.id,
      name: sport.name,
      color: sport.color,
      rulesSummary: sport.rules_summary,
      format: sport.format
    }));

    const stages: CompetitionStage[] = stagesRes.data.map((stage) => ({
      id: stage.id,
      sportId: stage.sport_id,
      type: stage.type,
      label: stage.label,
      orderIndex: stage.order_index,
      advancesCount: stage.advances_count,
      isActive: stage.is_active
    }));

    const groups: CompetitionGroup[] = groupsRes.data.map((group) => ({
      id: group.id,
      stageId: group.stage_id,
      sportId: group.sport_id,
      code: group.code,
      orderIndex: group.order_index
    }));

    const teams: Team[] = teamsRes.data.map((team) => ({
      id: team.id,
      name: team.name,
      association: team.association,
      sportIds: teamSportsByTeamId.get(team.id) ?? [],
      seed: team.seed,
      isActive: team.is_active
    }));

    const matches: Match[] = matchesRes.data.map((match) => ({
      id: match.id,
      sportId: match.sport_id,
      round: match.round,
      day: match.day,
      startTime: match.start_time.slice(0, 5),
      venue: match.venue,
      stageId: match.stage_id,
      groupId: match.group_id,
      roundIndex: match.round_index ?? 1,
      matchNumber: match.match_number ?? 1,
      teamAId: match.team_a_id,
      teamBId: match.team_b_id,
      status: match.status,
      winnerToMatchId: match.winner_to_match_id ?? match.next_match_id,
      winnerToSlot: match.winner_to_slot ?? match.next_slot,
      loserToMatchId: match.loser_to_match_id,
      loserToSlot: match.loser_to_slot,
      nextMatchId: match.next_match_id ?? match.winner_to_match_id,
      nextSlot: match.next_slot ?? match.winner_to_slot,
      isBye: Boolean(match.is_bye)
    }));

    const results: MatchResult[] = resultsRes.data.map((result) => ({
      matchId: result.match_id,
      winnerTeamId: result.winner_team_id,
      teamAScore: result.team_a_score,
      teamBScore: result.team_b_score,
      decisionType: result.decision_type ?? "normal",
      scoreSummary: result.score_summary,
      note: result.note,
      updatedBy: result.updated_by,
      updatedAt: result.updated_at
    }));

    const announcements: Announcement[] = announcementsRes.data.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      visibility: announcement.visibility,
      pinned: announcement.pinned,
      publishedAt: announcement.published_at,
      isPublished: announcement.is_published
    }));

    return hydrateSnapshot({
      tournament,
      sports,
      stages,
      groups,
      teams,
      results,
      matches,
      announcements
    });
  } catch (error) {
    console.error("Falling back to local seed data:", error);
    return getFallbackSnapshot();
  }
}
