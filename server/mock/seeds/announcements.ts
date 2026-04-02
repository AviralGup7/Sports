import type { Announcement } from "@/domain";

export const announcementsSeed: Announcement[] = [
  {
    id: "notice-fixtures-apr-2",
    title: "2 April fixtures",
    body: "7:30 PM to 9:00 PM: Tigers of MP vs MV7. 9:00 PM to 10:30 PM: Maharashtra Mandal vs Sangam. 10:30 PM to 12:00 AM: Andhra Samithi vs Capitol.",
    visibility: "public",
    pinned: false,
    publishedAt: "2026-04-01T18:30:00.000Z",
    isPublished: true
  },
  {
    id: "notice-apr-2-match-cancelled",
    title: "2 April 6:00 PM cricket match cancelled",
    body: "The 2 April 2026 6:00 PM cricket fixture between HCA and Marudhara has been cancelled. No further changes will be accepted for this match.",
    visibility: "public",
    pinned: true,
    publishedAt: "2026-04-02T10:00:00.000Z",
    isPublished: true
  }
];
