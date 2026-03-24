import type { SportSlug } from "@/domain";
import type { SchedulePageData } from "@/server/data/public/types";
import { getSchedulePageData as buildSchedulePageData } from "@/server/data/query-helpers";

export async function getSchedulePageData(day?: string, sportId?: SportSlug, status?: string): Promise<SchedulePageData> {
  return buildSchedulePageData(day, sportId, status);
}
