import { describe, expect, it } from "vitest";

import { normalizePlannedCommand } from "@/server/ai/groq";

describe("normalizePlannedCommand", () => {
  it("normalizes bracketed planner tokens", () => {
    expect(normalizePlannedCommand("post announcement [admin] TITLE: Camera crew is in position.")).toBe(
      "post announcement admin Camera crew is in position."
    );
  });

  it("normalizes result shorthand and preserves note text shape inputs", () => {
    expect(normalizePlannedCommand("result football-qf-2 Pilani Tamil Mandram score 2-1 [note Late winner]")).toBe(
      "result football-qf-2 Pilani Tamil Mandram score 2-1 note Late winner"
    );
  });

  it("normalizes move commands with bracketed venue", () => {
    expect(normalizePlannedCommand("move cricket-final to 2026-04-05 17:00 [at Indoor Arena]")).toBe(
      "move cricket-final to 2026-04-05 17:00 at Indoor Arena"
    );
  });

  it("normalizes team planner attributes", () => {
    expect(
      normalizePlannedCommand("update team pilani-tamil-mandram rename Pilani Tamil Mandram [association Tamil Mandram] [sports football,cricket]")
    ).toBe("update team pilani-tamil-mandram rename Pilani Tamil Mandram association Tamil Mandram sports football,cricket");
  });
});
