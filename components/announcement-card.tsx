import { Announcement } from "@/lib/types";

import { NewsBulletin } from "./news-bulletin";

type AnnouncementCardProps = {
  announcement: Announcement;
  compact?: boolean;
  showAdminMeta?: boolean;
};

export function AnnouncementCard({ announcement, compact = false, showAdminMeta = false }: AnnouncementCardProps) {
  return <NewsBulletin announcement={announcement} compact={compact} showAdminMeta={showAdminMeta} />;
}
