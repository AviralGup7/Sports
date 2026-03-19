export type AnnouncementVisibility = "public" | "admin";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  visibility: AnnouncementVisibility;
  pinned: boolean;
  publishedAt: string;
  isPublished: boolean;
};
