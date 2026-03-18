import { revalidatePath } from "next/cache";

import { requireAdminProfile } from "@/lib/auth";
import { SportSlug } from "@/lib/types-domain";

import {
  revalidateAdminShellPaths,
  revalidatePublicTournamentPaths,
  redirectWithMessage,
  slugify,
  toNullableString
} from "./shared";

export async function performUpsertTeam(formData: FormData) {
  const { profile, supabase } = await requireAdminProfile();
  const name = String(formData.get("name") ?? "").trim();
  const association = String(formData.get("association") ?? "").trim();
  const seed = Number(formData.get("seed") ?? 0);
  const sportIds = formData.getAll("sportIds").map((value) => String(value) as SportSlug);
  const existingId = toNullableString(formData.get("id"));
  const teamId = existingId ?? slugify(name);

  if (!name || !association || !seed || sportIds.length === 0) {
    redirectWithMessage("/admin/teams", "error", "Team name, association, seed, and at least one sport are required.");
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
  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("teams").update({ is_active: false }).eq("id", id);

  if (error) {
    redirectWithMessage("/admin/teams", "error", error.message);
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/teams");
  redirectWithMessage("/admin/teams", "success", "Team archived.");
}
