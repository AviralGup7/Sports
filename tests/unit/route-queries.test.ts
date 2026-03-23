import { describe, expect, it } from "vitest";

import { getAdminMatchesData } from "../../server/data/admin/matches-query";
import { getSchedulePageData } from "../../server/data/public/schedule-query";
import { getSportPageData } from "../../server/data/public/sport-center-query";
import { profilesSeed } from "../../server/mock/tournament-snapshot";

describe("route-facing queries", () => {
  it("ignores obsolete schedule stage/group inputs and still applies status filtering", async () => {
    const data = await getSchedulePageData("2026-04-03", "football", "deprecated-stage", "deprecated-group", "live");

    expect(data.selectedStatus).toBe("live");
    expect(data.fixtures.every((match) => match.sportId === "football" && match.status === "live")).toBe(true);
  });

  it("returns a bracket for athletics in the public sport center", async () => {
    const data = await getSportPageData("athletics");

    expect(data).not.toBeNull();
    expect(data?.bracket).not.toBeNull();
    expect(data?.standings.length).toBeGreaterThan(0);
  });

  it("builds admin matches data with visible builder cards and quick-result candidates", async () => {
    const data = await getAdminMatchesData(profilesSeed[0]);

    expect(data.builderCards.length).toBeGreaterThan(0);
    expect(data.quickResultCandidates.length).toBeGreaterThan(0);
    expect(data.days.length).toBeGreaterThan(0);
  });
});
