import type { Profile } from "@/domain/admin/types";
import type { AdminAnnouncementsData } from "@/server/data/admin/types";
import { loadSnapshot } from "@/server/data/snapshot";

export async function getAdminAnnouncementsData(profile: Profile): Promise<AdminAnnouncementsData> {
  const snapshot = await loadSnapshot();

  return {
    profile,
    announcements:
      profile.role === "super_admin"
        ? snapshot.announcements
        : snapshot.announcements.filter((announcement) => announcement.visibility === "public" || profile.sportIds.length > 0)
  };
}
