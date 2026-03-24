import type { SportSlug } from "@/domain";
import type { SportPageData } from "@/server/data/public/types";
import { getSportPageData as buildSportPageData } from "@/server/data/query-helpers";

export async function getSportPageData(sportId: SportSlug): Promise<SportPageData | null> {
  return buildSportPageData(sportId);
}
