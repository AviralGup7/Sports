import type { Metadata } from "next";

import { HomeScreen } from "@/features/public/home/home-screen";
import { getHomePageData } from "@/server/data/public/home-query";
import { buildTournamentPageMetadata } from "@/server/data/public/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData();

  return buildTournamentPageMetadata(data.tournament.name, `Follow live scores, schedules, standings, and notices from ${data.tournament.name}.`);
}

export default async function HomePage() {
  const data = await getHomePageData();

  return <HomeScreen data={data} />;
}
