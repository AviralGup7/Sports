import { describe, expect, it } from "vitest";

import { buildDataState } from "../../server/data/shared/query-state";

describe("query-state helpers", () => {
  it("labels live snapshots clearly", () => {
    const state = buildDataState({ source: "supabase" } as never, "2026-04-01T10:00:00.000Z");

    expect(state.label).toBe("Live tournament data");
    expect(state.detail).toContain("Supabase");
  });

  it("labels fallback snapshots clearly", () => {
    const state = buildDataState({ source: "fallback" } as never, "2026-04-01T10:00:00.000Z");

    expect(state.label).toBe("Fallback tournament data");
    expect(state.detail).toContain("seeded fallback data");
  });
});
