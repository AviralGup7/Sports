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

  it("returns an empty sport page cleanly when no future fixtures are published yet", async () => {
    const data = await getSportPageData("athletics");

    expect(data).not.toBeNull();
    expect(data?.dataState.source).toMatch(/supabase|fallback/);
    expect(data?.matches.length).toBe(0);
  });

  it("builds admin matches data for the live desk filters", async () => {
    const data = await getAdminMatchesData(profilesSeed[0]);

    expect(data.builderCards.length).toBeGreaterThan(0);
    expect(data.matches.length).toBeGreaterThan(0);
    expect(data.days.length).toBeGreaterThan(0);
  });
});
