import type { AnnouncementsPageData } from "@/server/data/public/types";
import { loadSnapshot } from "@/server/data/snapshot";
import { buildDataState, getGeneratedAt } from "@/server/data/shared/query-state";
import { getPublicAnnouncements } from "@/server/data/shared/snapshot-selectors";

export async function getAnnouncementsPageData(): Promise<AnnouncementsPageData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    items: getPublicAnnouncements(snapshot)
  };
}
