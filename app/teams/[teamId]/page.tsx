import { notFound } from "next/navigation";

import { TeamProfileScreen } from "@/features/public/teams/team-profile-screen";
import { getTeamProfilePageData } from "@/server/data/public/teams-query";

type TeamProfilePageProps = {
  params: Promise<{
    teamId: string;
  }>;
};

export default async function TeamProfilePage({ params }: TeamProfilePageProps) {
  const { teamId } = await params;
  const data = await getTeamProfilePageData(teamId);

  if (!data) {
    notFound();
  }

  return <TeamProfileScreen data={data} />;
}
