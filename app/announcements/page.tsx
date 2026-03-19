import { AnnouncementsScreen } from "@/features/public/announcements/announcements-screen";
import { getAnnouncementsPageData } from "@/server/data/public/announcements-query";

export default async function AnnouncementsPage() {
  const items = await getAnnouncementsPageData();

  return <AnnouncementsScreen items={items} />;
}
