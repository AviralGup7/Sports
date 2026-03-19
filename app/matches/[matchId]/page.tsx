import { notFound } from "next/navigation";

import { MatchCenterScreen } from "@/features/public/match-center/match-center-screen";
import { getMatchPageData } from "@/server/data/public/match-center-query";

type MatchPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;
  const data = await getMatchPageData(matchId);

  if (!data) {
    notFound();
  }

  return <MatchCenterScreen data={data} />;
}
