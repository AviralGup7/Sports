import { describe, expect, it } from "vitest";

import { getAdminMatchesData } from "../../server/data/admin/matches-query";
import { getSchedulePageData } from "../../server/data/public/schedule-query";
import { getSportPageData } from "../../server/data/public/sport-center-query";
import { profilesSeed } from "../../server/mock/tournament-snapshot";

describe("route-facing queries", () => {
  it("applies the minimal schedule query contract and still filters by status", async () => {
    const data = await getSchedulePageData("2026-04-03", "football", "live");

    expect(data.selectedStatus).toBe("live");
    expect(data.dataState.source).toMatch(/supabase|fallback/);
    expect(data.fixtures.every((match) => match.sportId === "football" && match.status === "live")).toBe(true);
  });

  it("returns athletics heat cards without forcing a knockout table", async () => {
    const data = await getSportPageData("athletics");

    expect(data).not.toBeNull();
    expect(data?.dataState.source).toMatch(/supabase|fallback/);
    expect(data?.matches.length).toBeGreaterThan(0);
    expect(data?.standings.length).toBe(0);
    expect(data?.stageSummaries[0]?.stage.label).toBe("Heat and Finals Cards");
  });

  it("builds admin matches data with visible builder cards and quick-result candidates", async () => {
    const data = await getAdminMatchesData(profilesSeed[0]);

    expect(data.builderCards.length).toBeGreaterThan(0);
    expect(data.quickResultCandidates.length).toBeGreaterThan(0);
    expect(data.days.length).toBeGreaterThan(0);
  });
});
