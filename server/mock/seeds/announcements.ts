import type { Announcement } from "@/domain";

export const announcementsSeed: Announcement[] = [
  {
    id: "announce-1",
    title: "Volunteer briefing moved to 3:15 PM",
    body: "All venue volunteers should report at the media desk 15 minutes earlier than planned for access badge pickup.",
    visibility: "public",
    pinned: true,
    publishedAt: "2026-04-02T09:00:00+05:30",
    isPublished: true
  },
  {
    id: "announce-2",
    title: "Football quarter-final now in extra time",
    body: "The second football quarter-final remains level and may move to penalties. Crowd access remains restricted near the benches.",
    visibility: "public",
    pinned: false,
    publishedAt: "2026-04-03T16:50:00+05:30",
    isPublished: true
  },
  {
    id: "announce-3",
    title: "Volleyball semi-final lane updated",
    body: "One indoor court match has been postponed after a power reset. Builder mode shows the integrity warning until the slot is rescheduled.",
    visibility: "admin",
    pinned: false,
    publishedAt: "2026-04-03T17:10:00+05:30",
    isPublished: true
  }
];
