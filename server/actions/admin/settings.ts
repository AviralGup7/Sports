import { revalidatePath } from "next/cache";

import type { TournamentContact } from "@/domain";
import { requireAdminProfile } from "@/server/auth";
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

import { ActionValidationError, getOptionalString, getRequiredString } from "./form-validation";
import {
  revalidateAdminShellPaths,
  revalidatePublicTournamentPaths,
  redirectWithMessage
} from "./shared";

function readTournamentContacts(formData: FormData): TournamentContact[] {
  const contacts: TournamentContact[] = [];

  for (let index = 0; index < 5; index += 1) {
    const id = `contact-${index + 1}`;
    const name = getOptionalString(formData, `contactName_${index}`);
    const phone = getOptionalString(formData, `contactPhone_${index}`);
    const role = getOptionalString(formData, `contactRole_${index}`) ?? undefined;

    if (!name && !phone && !role) {
      continue;
    }

    if (!name || !phone) {
      throw new ActionValidationError("Each saved contact needs both a name and a phone number.");
    }

    contacts.push({
      id,
      name,
      phone,
      role
    });
  }

  if (contacts.length === 0) {
    throw new ActionValidationError("At least one organizer contact is required.");
  }

  return contacts;
}

export async function performUpdateTournamentSettings(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();

  if (profile.role !== "super_admin") {
    redirectWithMessage("/admin/settings", "error", "Only super admins can update tournament settings.");
  }

  try {
    const tournamentId = getRequiredString(formData, "tournamentId", "Tournament");
    const name = getRequiredString(formData, "name", "Tournament name");
    const venue = getRequiredString(formData, "venue", "Venue");
    const startDate = getRequiredString(formData, "startDate", "Start date");
    const endDate = getRequiredString(formData, "endDate", "End date");
    const logoAssetPath = getRequiredString(formData, "logoAssetPath", "Logo path");
    const contacts = readTournamentContacts(formData);

    const { error: tournamentError } = await supabase.from("tournaments").upsert({
      id: tournamentId,
      name,
      start_date: startDate,
      end_date: endDate,
      venue
    });

    if (tournamentError) {
      redirectWithMessage("/admin/settings", "error", tournamentError.message);
    }

    const { error: settingsError } = await supabase.from("tournament_settings").upsert({
      tournament_id: tournamentId,
      logo_asset_path: logoAssetPath,
      contacts_json: contacts
    });

    if (settingsError) {
      redirectWithMessage("/admin/settings", "error", settingsError.message);
    }
  } catch (error) {
    if (error instanceof ActionValidationError) {
      redirectWithMessage("/admin/settings", "error", error.message);
    }

    throw error;
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/settings");

  redirectWithMessage("/admin/settings", "success", "Tournament settings updated.");
}

async function deleteRowsByIds(table: string, idColumn: string, ids: string[], supabase: Awaited<ReturnType<typeof requireAdminProfile>>["supabase"]) {
  if (ids.length === 0) {
    return;
  }

  const { error } = await supabase.from(table).delete().in(idColumn, ids);
  if (error) {
    throw new Error(error.message);
  }
}

export async function performResetTournamentData(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (profile.role !== "super_admin") {
    redirectWithMessage("/admin/settings", "error", "Only super admins can reset tournament data.");
  }

  if (confirmation !== "RESET TOURNAMENT") {
    redirectWithMessage("/admin/settings", "error", "Type RESET TOURNAMENT to confirm the reset.");
  }

  try {
    const [{ data: existingMatches }, { data: existingGroups }, { data: existingStages }, { data: existingTeams }, { data: existingAnnouncements }] =
      await Promise.all([
        supabase.from("matches").select("id"),
        supabase.from("competition_groups").select("id"),
        supabase.from("competition_stages").select("id"),
        supabase.from("teams").select("id"),
        supabase.from("announcements").select("id")
      ]);

    await deleteRowsByIds(
      "match_results",
      "match_id",
      (existingMatches ?? []).map((row) => row.id),
      supabase
    );
    await deleteRowsByIds(
      "matches",
      "id",
      (existingMatches ?? []).map((row) => row.id),
      supabase
    );
    await deleteRowsByIds(
      "competition_groups",
      "id",
      (existingGroups ?? []).map((row) => row.id),
      supabase
    );
    await deleteRowsByIds(
      "competition_stages",
      "id",
      (existingStages ?? []).map((row) => row.id),
      supabase
    );

    const existingTeamIds = (existingTeams ?? []).map((row) => row.id);
    if (existingTeamIds.length > 0) {
      const { error: teamSportsDeleteError } = await supabase.from("team_sports").delete().in("team_id", existingTeamIds);
      if (teamSportsDeleteError) {
        throw new Error(teamSportsDeleteError.message);
      }
    }

    await deleteRowsByIds("teams", "id", existingTeamIds, supabase);
    await deleteRowsByIds(
      "announcements",
      "id",
      (existingAnnouncements ?? []).map((row) => row.id),
      supabase
    );

    const { error: tournamentError } = await supabase.from("tournaments").upsert({
      id: tournamentSeed.id,
      name: tournamentSeed.name,
      start_date: tournamentSeed.startDate,
      end_date: tournamentSeed.endDate,
      venue: tournamentSeed.venue
    });

    if (tournamentError) {
      throw new Error(tournamentError.message);
    }

    const { error: tournamentSettingsError } = await supabase.from("tournament_settings").upsert({
      tournament_id: tournamentSeed.id,
      logo_asset_path: tournamentSeed.logoAssetPath,
      contacts_json: tournamentSeed.contacts
    });

    if (tournamentSettingsError) {
      throw new Error(tournamentSettingsError.message);
    }

    const { error: sportsError } = await supabase.from("sports").upsert(
      sportsSeed.map((sport) => ({
        id: sport.id,
        name: sport.name,
        color: sport.color,
        rules_summary: sport.rulesSummary,
        format: sport.format
      }))
    );

    if (sportsError) {
      throw new Error(sportsError.message);
    }

    const { error: teamsError } = await supabase.from("teams").upsert(
      teamsSeed.map((team) => ({
        id: team.id,
        name: team.name,
        association: team.association,
        seed: team.seed,
        is_active: team.isActive
      }))
    );

    if (teamsError) {
      throw new Error(teamsError.message);
    }

    const teamSportRows = teamsSeed.flatMap((team) =>
      team.sportIds.map((sportId) => ({
        team_id: team.id,
        sport_id: sportId
      }))
    );

    if (teamSportRows.length > 0) {
      const { error: teamSportsError } = await supabase.from("team_sports").upsert(teamSportRows, {
        onConflict: "team_id,sport_id"
      });

      if (teamSportsError) {
        throw new Error(teamSportsError.message);
      }
    }

    const { error: stagesError } = await supabase.from("competition_stages").upsert(
      competitionStagesSeed.map((stage) => ({
        id: stage.id,
        sport_id: stage.sportId,
        type: stage.type,
        label: stage.label,
        order_index: stage.orderIndex,
        advances_count: stage.advancesCount,
        is_active: stage.isActive
      }))
    );

    if (stagesError) {
      throw new Error(stagesError.message);
    }

    if (competitionGroupsSeed.length > 0) {
      const { error: groupsError } = await supabase.from("competition_groups").upsert(
        competitionGroupsSeed.map((group) => ({
          id: group.id,
          stage_id: group.stageId,
          sport_id: group.sportId,
          code: group.code,
          order_index: group.orderIndex
        }))
      );

      if (groupsError) {
        throw new Error(groupsError.message);
      }
    }

    if (matchesSeed.length > 0) {
      const { error: matchesError } = await supabase.from("matches").upsert(
        matchesSeed.map((match) => ({
          id: match.id,
          tournament_id: tournamentSeed.id,
          sport_id: match.sportId,
          round: match.round,
          day: match.day,
          start_time: match.startTime,
          venue: match.venue,
          stage_id: match.stageId,
          group_id: match.groupId,
          round_index: match.roundIndex,
          match_number: match.matchNumber,
          team_a_id: match.teamAId,
          team_b_id: match.teamBId,
          status: match.status,
          winner_to_match_id: match.winnerToMatchId,
          winner_to_slot: match.winnerToSlot,
          loser_to_match_id: match.loserToMatchId,
          loser_to_slot: match.loserToSlot,
          next_match_id: match.nextMatchId,
          next_slot: match.nextSlot,
          is_bye: match.isBye
        }))
      );

      if (matchesError) {
        throw new Error(matchesError.message);
      }
    }

    if (resultsSeed.length > 0) {
      const { error: resultsError } = await supabase.from("match_results").upsert(
        resultsSeed.map((result) => ({
          match_id: result.matchId,
          winner_team_id: result.winnerTeamId,
          team_a_score: result.teamAScore,
          team_b_score: result.teamBScore,
          decision_type: result.decisionType,
          score_summary: result.scoreSummary,
          note: result.note,
          updated_by: result.updatedBy,
          updated_at: result.updatedAt
        }))
      );

      if (resultsError) {
        throw new Error(resultsError.message);
      }
    }

    if (announcementsSeed.length > 0) {
      const { error: announcementsError } = await supabase.from("announcements").upsert(
        announcementsSeed.map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          body: announcement.body,
          visibility: announcement.visibility,
          pinned: announcement.pinned,
          published_at: announcement.publishedAt,
          is_published: announcement.isPublished
        }))
      );

      if (announcementsError) {
        throw new Error(announcementsError.message);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reset failed.";
    redirectWithMessage("/admin/settings", "error", message);
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/settings");
  revalidatePath("/admin/matches");
  revalidatePath("/admin/teams");
  revalidatePath("/admin/announcements");

  redirectWithMessage("/admin/settings", "success", "Tournament data reset to the seeded baseline.");
}
