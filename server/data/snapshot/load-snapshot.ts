import { cache } from "react";

import { createSupabaseServerClient } from "@/server/supabase/server";
import {
  announcementsSeed,
  competitionGroupsSeed,
  competitionStagesSeed,
  matchesSeed,
  resultsSeed,
  sportsSeed,
  teamsSeed,
  tournamentSeed
} from "@/server/mock/tournament-snapshot";
import { hasSupabaseEnv } from "@/server/supabase/env";
import {
  hydrateSnapshot,
  mapAnnouncementRows,
  mapGroupRows,
  mapMatchRows,
  mapResultRows,
  mapSportRows,
  mapStageRows,
  mapTeamRows,
  mapTournamentRow
} from "@/server/data/snapshot/mappers";
import type {
  AnnouncementRow,
  GroupRow,
  MatchResultRow,
  MatchRow,
  RepositorySnapshot,
  SportRow,
  StageRow,
  TeamRow,
  TeamSportRow,
  TournamentSettingsRow,
  TournamentRow
} from "@/server/data/snapshot/types";

function getFallbackSnapshot() {
  return hydrateSnapshot({
    source: "fallback",
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

function isMissingOptionalResource(error: { code?: string; message?: string } | null | undefined) {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";
  return error.code === "PGRST205" || message.includes("could not find the table") || message.includes("does not exist");
}

const SNAPSHOT_TIMEOUT_MS = 5000;

function withQueryTimeout<T extends { abortSignal: (signal: AbortSignal) => T }>(query: T) {
  if (typeof AbortSignal === "undefined" || typeof AbortSignal.timeout !== "function") {
    return query;
  }

  return query.abortSignal(AbortSignal.timeout(SNAPSHOT_TIMEOUT_MS));
}

async function fetchSnapshot(): Promise<RepositorySnapshot> {

  if (!hasSupabaseEnv()) {
    return getFallbackSnapshot();
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [
      preferredTournamentRes,
      fallbackTournamentRes,
      tournamentSettingsRes,
      sportsRes,
      stagesRes,
      groupsRes,
      teamsRes,
      teamSportsRes,
      matchesRes,
      resultsRes,
      announcementsRes
    ] = await Promise.all([
      withQueryTimeout(supabase.from("tournaments").select("id, name, start_date, end_date, venue").eq("id", tournamentSeed.id)).maybeSingle<TournamentRow>(),
      withQueryTimeout(supabase.from("tournaments").select("id, name, start_date, end_date, venue").order("start_date", { ascending: true }).limit(1)).returns<TournamentRow[]>(),
      withQueryTimeout(supabase.from("tournament_settings").select("tournament_id, logo_asset_path, contacts_json").eq("tournament_id", tournamentSeed.id)).maybeSingle<TournamentSettingsRow>(),
      withQueryTimeout(supabase.from("sports").select("id, name, color, rules_summary, format")).returns<SportRow[]>(),
      withQueryTimeout(supabase.from("competition_stages").select("id, sport_id, type, label, order_index, advances_count, is_active")).returns<StageRow[]>(),
      withQueryTimeout(supabase.from("competition_groups").select("id, stage_id, sport_id, code, order_index")).returns<GroupRow[]>(),
      withQueryTimeout(supabase.from("teams").select("id, name, association, seed, is_active")).returns<TeamRow[]>(),
      withQueryTimeout(supabase.from("team_sports").select("team_id, sport_id")).returns<TeamSportRow[]>(),
      withQueryTimeout(
        supabase
        .from("matches")
        .select(
          "id, sport_id, round, day, start_time, venue, stage_id, group_id, round_index, match_number, team_a_id, team_b_id, status, winner_to_match_id, winner_to_slot, loser_to_match_id, loser_to_slot, next_match_id, next_slot, is_bye"
        )
      ).returns<MatchRow[]>(),
      withQueryTimeout(
        supabase
        .from("match_results")
        .select("match_id, winner_team_id, team_a_score, team_b_score, decision_type, score_summary, note, updated_by, updated_at")
      ).returns<MatchResultRow[]>(),
      withQueryTimeout(supabase.from("announcements").select("id, title, body, visibility, pinned, published_at, is_published")).returns<AnnouncementRow[]>()
    ]);

    const tournamentRow = preferredTournamentRes.data ?? fallbackTournamentRes.data?.[0] ?? null;
    const tournamentSettingsError = isMissingOptionalResource(tournamentSettingsRes.error) ? null : tournamentSettingsRes.error;
    const resolvedTournament = preferredTournamentRes.data
      ? mapTournamentRow(preferredTournamentRes.data, tournamentSettingsError ? null : tournamentSettingsRes.data ?? null, tournamentSeed)
      : tournamentRow
        ? {
            ...mapTournamentRow(tournamentRow, tournamentSettingsError ? null : tournamentSettingsRes.data ?? null, tournamentSeed),
            id: tournamentSeed.id,
            name: tournamentSeed.name,
            venue: tournamentSeed.venue
          }
        : null;

    if (
      preferredTournamentRes.error ||
      fallbackTournamentRes.error ||
      tournamentSettingsError ||
      sportsRes.error ||
      stagesRes.error ||
      groupsRes.error ||
      teamsRes.error ||
      teamSportsRes.error ||
      matchesRes.error ||
      resultsRes.error ||
      announcementsRes.error ||
      !resolvedTournament
    ) {
      throw new Error(
        [
          preferredTournamentRes.error?.message,
          fallbackTournamentRes.error?.message,
          tournamentSettingsError?.message,
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

    return hydrateSnapshot({
      source: "supabase",
      tournament: resolvedTournament,
      sports: mapSportRows(sportsRes.data),
      stages: mapStageRows(stagesRes.data),
      groups: mapGroupRows(groupsRes.data),
      teams: mapTeamRows(teamsRes.data, teamSportsRes.data),
      results: mapResultRows(resultsRes.data),
      matches: mapMatchRows(matchesRes.data),
      announcements: mapAnnouncementRows(announcementsRes.data)
    });
  } catch (error) {
    console.error("Falling back to local seed data:", error);
    return getFallbackSnapshot();
  }
}

const loadSnapshotCached = cache(fetchSnapshot);

export async function loadSnapshot(): Promise<RepositorySnapshot> {
  return loadSnapshotCached();
}

