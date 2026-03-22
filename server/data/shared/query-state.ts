import type { RepositorySnapshot } from "@/server/data/snapshot";

export function getGeneratedAt() {
  return new Date().toISOString();
}

export function buildDataState(snapshot: RepositorySnapshot, generatedAt: string) {
  return {
    source: snapshot.source,
    label: snapshot.source === "supabase" ? "Live tournament data" : "Fallback tournament data",
    detail:
      snapshot.source === "supabase"
        ? "The app is reading from Supabase."
        : "Supabase is unavailable or incomplete, so seeded fallback data is rendering.",
    generatedAt
  };
}
