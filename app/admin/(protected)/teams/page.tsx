import { TeamsScreen } from "@/features/admin/teams/teams-screen";
import { requireAdminProfile } from "@/server/auth";
import { getAdminTeamsData } from "@/server/data/admin/teams-query";

type AdminTeamsPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminTeamsPage({ searchParams }: AdminTeamsPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminTeamsData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return <TeamsScreen data={data} message={params.message} tone={tone} />;
}
