import type { Announcement } from "@/domain";

export const announcementsSeed: Announcement[] = [
  {
    id: "notice-brackets-apr-1",
    title: "Updated knockout brackets published",
    body: "Association overlap is allowed in this version. The scheduling check now only avoids the same player being forced into two live matches at the same time. Cricket, football, volleyball, and athletics have been rebuilt on that basis using the exact registered association list.",
    visibility: "public",
    pinned: true,
    publishedAt: "2026-04-01T18:30:00.000Z",
    isPublished: true
  },
  {
    id: "notice-timing-apr-1",
    title: "Best-fit timing plan for 2 April to 5 April",
    body: "2 April: Cricket Matches 1 to 3 run from 6 PM to midnight. 3 April: Athletics Heat A and Volleyball Match 1 run from 6 PM to 8 PM, then Football Matches 1 to 4 run from 8 PM to midnight. 4 April: Athletics Heat B and Volleyball Match 2 run from 6 PM to 8 PM, then Football Matches 5 to 7 plus Cricket Match 4 run from 8 PM to midnight. 5 April: Athletics final ladder and Volleyball Matches 3 to 4 run from 6 PM to 8 PM, then Football semis and final plus Cricket Matches 5 to 7 fill the 8 PM to midnight block.",
    visibility: "public",
    pinned: false,
    publishedAt: "2026-04-01T18:35:00.000Z",
    isPublished: true
  },
  {
    id: "notice-capacity-apr-1",
    title: "Capacity warning remains active",
    body: "Football fits the current evening window, and athletics fits as heats. Cricket is still short by 1 slot if only one ground is used. Volleyball is still short by 3 slots if only one court is used. Overflow placeholders on the site mark the exact places where an extra cricket slot, three extra volleyball slots, or a second court are still required.",
    visibility: "public",
    pinned: true,
    publishedAt: "2026-04-01T18:40:00.000Z",
    isPublished: true
  }
];
