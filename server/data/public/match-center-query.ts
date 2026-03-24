import type { MatchPageData } from "@/server/data/public/types";
import { getMatchPageData as buildMatchPageData } from "@/server/data/query-helpers";

export async function getMatchPageData(matchId: string): Promise<MatchPageData | null> {
  return buildMatchPageData(matchId);
}
