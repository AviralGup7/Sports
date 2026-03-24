import type { SportSlug } from "@/domain";
import type { StandingsPageData } from "@/server/data/public/types";
import { loadSnapshot } from "@/server/data/snapshot";
import { buildDataState, getGeneratedAt } from "@/server/data/shared/query-state";
import { buildStandingsSections } from "@/server/data/shared/public-view-builders";

export async function getStandingsPageData(selectedSport?: SportSlug): Promise<StandingsPageData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    sports: snapshot.sports,
    selectedSport,
    sections: buildStandingsSections(snapshot, selectedSport)
  };
}
