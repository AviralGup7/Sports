import { describe, expect, it } from "vitest";

import { formatDateLabel, formatDateTime, formatTimeLabel, getStatusTone } from "../lib/data-format";

describe("data-format helpers", () => {
  it("formats schedule dates for the broadcast UI", () => {
    expect(formatDateLabel("2026-03-19")).toContain("Mar");
  });

  it("formats time labels in 12-hour style", () => {
    expect(formatTimeLabel("18:45")).toMatch(/6:45/i);
  });

  it("formats combined date and time labels", () => {
    expect(formatDateTime("2026-03-19", "09:30")).toContain("9:30");
  });

  it("maps match statuses to stage tones", () => {
    expect(getStatusTone("live")).toBe("live");
    expect(getStatusTone("completed")).toBe("complete");
    expect(getStatusTone("scheduled")).toBe("scheduled");
  });
});
