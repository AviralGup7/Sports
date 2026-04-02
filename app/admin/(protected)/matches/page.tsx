import { MatchesScreen } from "@/features/admin/matches/matches-screen";
import { requireAdminProfile } from "@/server/auth";
import { getAdminMatchesData } from "@/server/data/admin/matches-query";

type AdminMatchesPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
    sport?: string;
    day?: string;
    stage?: string;
    mode?: string;
  }>;
};

export default async function AdminMatchesPage({ searchParams }: AdminMatchesPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminMatchesData(profile);

  return <MatchesScreen data={data} params={params} />;
}
