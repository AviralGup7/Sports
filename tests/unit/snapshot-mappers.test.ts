import { describe, expect, it } from "vitest";

import { mapTournamentRow } from "../../server/data/snapshot/mappers";
import { tournamentSeed } from "../../server/mock/tournament-snapshot";

describe("snapshot mappers", () => {
  it("falls back to seeded branding settings when no settings row exists", () => {
    const mapped = mapTournamentRow(
      {
        id: "icl-2026",
        name: "Inter Cultural Assoc Sports League",
        start_date: "2026-04-02",
        end_date: "2026-04-05",
        venue: "GYMG & MedC Grounds"
      },
      null,
      tournamentSeed
    );

    expect(mapped.logoAssetPath).toBe("/branding/icasl-logo.png");
    expect(mapped.contacts).toHaveLength(5);
    expect(mapped.contacts[0]?.name).toBe("Moksh Goel");
  });

  it("uses persisted settings when they are available", () => {
    const mapped = mapTournamentRow(
      {
        id: "icl-2026",
        name: "Inter Cultural Assoc Sports League",
        start_date: "2026-04-02",
        end_date: "2026-04-05",
        venue: "GYMG & MedC Grounds"
      },
      {
        tournament_id: "icl-2026",
        logo_asset_path: "/branding/custom-logo.png",
        contacts_json: [{ id: "ops", name: "Ops Lead", phone: "+91-1111111111", role: "Ops" }]
      },
      tournamentSeed
    );

    expect(mapped.logoAssetPath).toBe("/branding/custom-logo.png");
    expect(mapped.contacts).toEqual([{ id: "ops", name: "Ops Lead", phone: "+91-1111111111", role: "Ops" }]);
  });
});
