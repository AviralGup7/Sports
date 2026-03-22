import type { Metadata } from "next";

import { getStandingsPageData } from "@/server/data/public/standings-query";
import { buildTournamentPageMetadata } from "@/server/data/public/page-metadata";
import { StandingsScreen } from "@/features/public/standings/standings-screen";
import { sportOrder } from "@/server/mock/tournament-snapshot";

type StandingsPageProps = {
  searchParams?: Promise<{
    sport?: string;
  }>;
};

export default async function StandingsPage({ searchParams }: StandingsPageProps) {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.find((sport) => sport === params.sport);
  const data = await getStandingsPageData(selectedSport);

  return <StandingsScreen data={data} />;
}

export async function generateMetadata({ searchParams }: StandingsPageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.find((sport) => sport === params.sport);
  const title = selectedSport ? `${selectedSport} standings` : "Standings";

  return buildTournamentPageMetadata(title, "Track tables, qualification markers, and completed-result standings across the tournament.");
}
