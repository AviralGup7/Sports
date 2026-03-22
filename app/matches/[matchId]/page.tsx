import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MatchCenterScreen } from "@/features/public/match-center/match-center-screen";
import { buildTournamentPageMetadata } from "@/server/data/public/page-metadata";
import { getMatchPageData } from "@/server/data/public/match-center-query";

type MatchPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { matchId } = await params;
  const data = await getMatchPageData(matchId);

  if (!data) {
    return buildTournamentPageMetadata("Match", "Browse tournament match details.");
  }

  const title = `${data.match.teamA?.name ?? "TBD"} vs ${data.match.teamB?.name ?? "TBD"}`;
  return buildTournamentPageMetadata(title, `Live score, result history, and bracket context for ${data.sport.name}.`);
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;
  const data = await getMatchPageData(matchId);

  if (!data) {
    notFound();
  }

  return <MatchCenterScreen data={data} />;
}
