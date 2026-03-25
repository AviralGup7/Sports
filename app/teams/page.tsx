import { TeamsScreen } from "@/features/public/teams/teams-screen";
import { getTeamsPageData } from "@/server/data/public/teams-query";
import { sportOrder } from "@/server/mock/tournament-snapshot";

type TeamsPageProps = {
  searchParams?: Promise<{
    sport?: string;
  }>;
};

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.find((sport) => sport === params.sport);
  const data = await getTeamsPageData();

  return <TeamsScreen data={data} selectedSport={selectedSport} />;
}
