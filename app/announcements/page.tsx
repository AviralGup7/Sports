import { AnnouncementsScreen } from "@/features/public/announcements/announcements-screen";
import { getAnnouncementsPageData } from "@/server/data/public/announcements-query";

export default async function AnnouncementsPage() {
  const data = await getAnnouncementsPageData();

  return <AnnouncementsScreen generatedAt={data.generatedAt} items={data.items} />;
}
