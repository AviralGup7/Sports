import type { Profile } from "@/domain/admin/types";
import type { AdminTeamsData } from "@/server/data/admin/types";
import { loadSnapshot } from "@/server/data/snapshot";

export async function getAdminTeamsData(profile: Profile): Promise<AdminTeamsData> {
  const snapshot = await loadSnapshot();
  const sports =
    profile.role === "super_admin"
      ? snapshot.sports
      : snapshot.sports.filter((sport) => profile.sportIds.includes(sport.id));
  const teams =
    profile.role === "super_admin"
      ? snapshot.teams
      : snapshot.teams.filter((team) => team.sportIds.some((sportId) => profile.sportIds.includes(sportId)));

  return {
    profile,
    sports,
    teams
  };
}
