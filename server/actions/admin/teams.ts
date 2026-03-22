import { revalidatePath } from "next/cache";

import type { SportSlug } from "@/domain/sports/types";
import { requireAdminProfile } from "@/server/auth";

import { ActionValidationError, getNumberField, getOptionalString, getRequiredString, getStringList } from "./form-validation";
import {
  revalidateAdminShellPaths,
  revalidatePublicTournamentPaths,
  redirectWithMessage,
  slugify,
  toNullableString
} from "./shared";

export async function performUpsertTeam(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  let name = "";
  let association = "";
  let seed = 0;
  let sportIds: SportSlug[] = [];
  let existingId: string | null = null;

  try {
    name = getRequiredString(formData, "name", "Team name");
    association = getRequiredString(formData, "association", "Association");
    seed = getNumberField(formData, "seed", "Seed", { min: 1 }) ?? 1;
    sportIds = getStringList(formData, "sportIds").map((value) => value as SportSlug);
    existingId = getOptionalString(formData, "id");
  } catch (error) {
    if (error instanceof ActionValidationError) {
      redirectWithMessage("/admin/teams", "error", error.message);
    }

    throw error;
  }

  const teamId = existingId ?? slugify(name);

  if (sportIds.length === 0) {
    redirectWithMessage("/admin/teams", "error", "At least one sport is required.");
  }

  if (profile.role !== "super_admin" && sportIds.some((sportId) => !profile.sportIds.includes(sportId))) {
    redirectWithMessage("/admin/teams", "error", "You can only assign teams to sports you manage.");
  }

  const { error: teamError } = await supabase.from("teams").upsert({
    id: teamId,
    name,
    association,
    seed,
    is_active: true
  });

  if (teamError) {
    redirectWithMessage("/admin/teams", "error", teamError.message);
  }

  const { error: deleteError } = await supabase.from("team_sports").delete().eq("team_id", teamId);
  if (deleteError) {
    redirectWithMessage("/admin/teams", "error", deleteError.message);
  }

  const { error: relationError } = await supabase.from("team_sports").insert(
    sportIds.map((sportId) => ({
      team_id: teamId,
      sport_id: sportId
    }))
  );

  if (relationError) {
    redirectWithMessage("/admin/teams", "error", relationError.message);
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/teams");
  sportIds.forEach((sportId) => revalidatePath(`/sports/${sportId}`));

  redirectWithMessage("/admin/teams", "success", existingId ? "Team updated." : "Team created.");
}

export async function performArchiveTeam(formData: FormData) {
  const { supabase } = await requireAdminProfile();
  let id = "";

  try {
    id = getRequiredString(formData, "id", "Team id");
  } catch (error) {
    if (error instanceof ActionValidationError) {
      redirectWithMessage("/admin/teams", "error", error.message);
    }

    throw error;
  }

  const { error } = await supabase.from("teams").update({ is_active: false }).eq("id", id);

  if (error) {
    redirectWithMessage("/admin/teams", "error", error.message);
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/teams");
  redirectWithMessage("/admin/teams", "success", "Team archived.");
}

