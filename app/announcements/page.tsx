import type { Metadata } from "next";

import { AnnouncementsScreen } from "@/features/public/announcements/announcements-screen";
import { buildTournamentPageMetadata } from "@/server/data/public/page-metadata";
import { getAnnouncementsPageData } from "@/server/data/public/announcements-query";

export async function generateMetadata(): Promise<Metadata> {
  return buildTournamentPageMetadata("Announcements", "Read the latest tournament alerts, notices, and published updates.");
}

export default async function AnnouncementsPage() {
  const data = await getAnnouncementsPageData();

  return <AnnouncementsScreen generatedAt={data.generatedAt} items={data.items} />;
}
