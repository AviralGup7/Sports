import type { Metadata } from "next";

import { ScheduleScreen } from "@/features/public/schedule/schedule-screen";
import { buildTournamentPageMetadata } from "@/server/data/public/page-metadata";
import { getSchedulePageData } from "@/server/data/public/schedule-query";
import { sportOrder } from "@/server/mock/tournament-snapshot";

type SchedulePageProps = {
  searchParams?: Promise<{
    day?: string;
    sport?: string;
  }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.find((sport) => sport === params.sport);
  const data = await getSchedulePageData(params.day, selectedSport);

  return <ScheduleScreen data={data} selectedSport={selectedSport} />;
}

export async function generateMetadata({ searchParams }: SchedulePageProps): Promise<Metadata> {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.find((sport) => sport === params.sport);
  const data = await getSchedulePageData(params.day, selectedSport);
  const title = selectedSport ? `${selectedSport} schedule` : "Tournament schedule";

  return buildTournamentPageMetadata(title, `Browse fixtures, filters, and live tournament timings for ${data.selectedDay}.`);
}
