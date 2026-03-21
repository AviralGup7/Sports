import type { SportSlug } from "@/domain/sports/types";
import { slugify } from "../shared";

import type { CommandContext, CommandResult, ResolvedTeam, TeamRow, TeamSportRow } from "./types";
import { normalizeText, parseSportList } from "./utils";

async function getTeamSportIds(context: CommandContext, teamId: string) {
  const { data, error } = await context.supabase
    .from("team_sports")
    .select("team_id, sport_id")
    .eq("team_id", teamId)
    .returns<TeamSportRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => item.sport_id);
}

async function resolveManagedTeam(context: CommandContext, rawReference: string): Promise<ResolvedTeam> {
  const reference = rawReference.trim();

  if (!reference) {
    throw new Error("Team reference is required.");
  }

  const { data: teams, error } = await context.supabase
    .from("teams")
    .select("id, name, association, seed, is_active")
    .returns<TeamRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  const normalizedReference = normalizeText(reference);
  const slugReference = slugify(reference);
  const candidates = (teams ?? []).filter((team) => {
    const normalizedId = normalizeText(team.id);
    const normalizedName = normalizeText(team.name);

    return (
      team.id === reference ||
      team.id === slugReference ||
      normalizedId === normalizedReference ||
      normalizedName === normalizedReference ||
      normalizedName.includes(normalizedReference) ||
      normalizedReference.includes(normalizedName)
    );
  });

  if (candidates.length === 0) {
    throw new Error(`Team "${reference}" was not found.`);
  }

  if (candidates.length > 1) {
    throw new Error(`Team "${reference}" matched more than one team. Use an exact id.`);
  }

  const team = candidates[0];
  const sportIds = await getTeamSportIds(context, team.id);

  if (
    context.profile.role !== "super_admin" &&
    sportIds.length > 0 &&
    sportIds.every((sportId) => !context.profile.sportIds.includes(sportId))
  ) {
    throw new Error("You cannot manage that team.");
  }

  return {
    ...team,
    sportIds
  };
}

function ensureManageableSports(context: CommandContext, sportIds: SportSlug[]) {
  if (sportIds.length === 0) {
    throw new Error("At least one valid sport id is required.");
  }

  if (context.profile.role !== "super_admin" && sportIds.some((sportId) => !context.profile.sportIds.includes(sportId))) {
    throw new Error("You can only assign teams to sports you manage.");
  }
}

export async function runCreateTeamCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^create\s+team\s+(.+?)\s+association\s+(.+?)\s+seed\s+(\d+)\s+sports\s+(.+)$/i);

  if (!match) {
    throw new Error("Use team creation commands like: create team Pilani Tamil Mandram association Tamil Mandram seed 2 sports football.");
  }

  const [, teamName, association, rawSeed, rawSports] = match;
  const sportIds = parseSportList(rawSports);
  ensureManageableSports(context, sportIds);

  const teamId = slugify(teamName);
  const seed = Number(rawSeed);

  const { error: teamError } = await context.supabase.from("teams").upsert({
    id: teamId,
    name: teamName.trim(),
    association: association.trim(),
    seed,
    is_active: true
  });

  if (teamError) {
    throw new Error(teamError.message);
  }

  await context.supabase.from("team_sports").delete().eq("team_id", teamId);
  const { error: relationError } = await context.supabase.from("team_sports").insert(
    sportIds.map((sportId) => ({
      team_id: teamId,
      sport_id: sportId
    }))
  );

  if (relationError) {
    throw new Error(relationError.message);
  }

  return {
    message: `Team "${teamName.trim()}" created.`,
    sportIds
  };
}

export async function runUpdateTeamCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^update\s+team\s+(.+?)(?:\s+rename\s+(.+?))?(?:\s+association\s+(.+?))?(?:\s+seed\s+(\d+))?(?:\s+sports\s+(.+))?$/i);

  if (!match) {
    throw new Error("Use team update commands like: update team pilani-tamil-mandram rename Pilani Tamil Mandram seed 2 sports football.");
  }

  const [, teamReference, renameValue, associationValue, rawSeed, rawSports] = match;
  const team = await resolveManagedTeam(context, teamReference);
  const nextSportIds = rawSports ? parseSportList(rawSports) : team.sportIds;
  ensureManageableSports(context, nextSportIds);

  const { error: teamError } = await context.supabase.from("teams").upsert({
    id: team.id,
    name: renameValue?.trim() || team.name,
    association: associationValue?.trim() || team.association,
    seed: rawSeed ? Number(rawSeed) : team.seed,
    is_active: team.is_active
  });

  if (teamError) {
    throw new Error(teamError.message);
  }

  if (rawSports) {
    const { error: deleteError } = await context.supabase.from("team_sports").delete().eq("team_id", team.id);
    if (deleteError) {
      throw new Error(deleteError.message);
    }

    const { error: relationError } = await context.supabase.from("team_sports").insert(
      nextSportIds.map((sportId) => ({
        team_id: team.id,
        sport_id: sportId
      }))
    );

    if (relationError) {
      throw new Error(relationError.message);
    }
  }

  return {
    message: `Team "${team.id}" updated.`,
    sportIds: nextSportIds
  };
}

export async function runArchiveTeamCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^archive\s+team\s+(.+)$/i);

  if (!match) {
    throw new Error("Use archive commands like: archive team pilani-tamil-mandram.");
  }

  const team = await resolveManagedTeam(context, match[1]);
  const { error } = await context.supabase.from("teams").update({ is_active: false }).eq("id", team.id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: `Team "${team.id}" archived.`,
    sportIds: team.sportIds
  };
}
