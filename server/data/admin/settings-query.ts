import type { Profile } from "@/domain/admin/types";
import type { AdminSettingsData } from "@/server/data/admin/types";
import { profilesSeed } from "@/server/mock/tournament-snapshot";
import { hasSupabaseEnv } from "@/server/supabase/env";
import { loadSnapshot } from "@/server/data/snapshot";
import { buildDataState, getGeneratedAt } from "@/server/data/shared/query-state";

export async function getAdminSettingsData(profile: Profile): Promise<AdminSettingsData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();

  return {
    profile,
    tournament: snapshot.tournament,
    dataState: buildDataState(snapshot, generatedAt),
    envReady: hasSupabaseEnv(),
    usingFallbackData: snapshot.source === "fallback",
    exportedAt: generatedAt
  };
}

export function getAdminSeedProfile() {
  return profilesSeed[0];
}
