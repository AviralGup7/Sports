import { TeamsScreen } from "@/features/public/teams/teams-screen";
import { getTeamsPageData } from "@/server/data/public/teams-query";

export default async function TeamsPage() {
  const data = await getTeamsPageData();

  return <TeamsScreen data={data} />;
}
