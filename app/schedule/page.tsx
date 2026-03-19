import { ScheduleScreen } from "@/features/public/schedule/schedule-screen";
import { getSchedulePageData } from "@/server/data/public/schedule-query";
import { sportOrder } from "@/server/mock/tournament-snapshot";

type SchedulePageProps = {
  searchParams?: Promise<{
    day?: string;
    sport?: string;
    stage?: string;
    group?: string;
    status?: string;
  }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.find((sport) => sport === params.sport);
  const data = await getSchedulePageData(params.day, selectedSport, params.stage, params.group, params.status);

  return <ScheduleScreen data={data} selectedSport={selectedSport} />;
}
