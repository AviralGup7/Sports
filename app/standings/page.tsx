import { getStandingsPageData } from "@/server/data/public/standings-query";
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
