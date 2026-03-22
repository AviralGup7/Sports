import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SportCenterScreen } from "@/features/public/sport-center/sport-center-screen";
import { buildTournamentPageMetadata } from "@/server/data/public/page-metadata";
import { getSportPageData } from "@/server/data/public/sport-center-query";
import { sportOrder } from "@/server/mock/tournament-snapshot";

type SportPageProps = {
  params: Promise<{
    sport: string;
  }>;
  searchParams?: Promise<{
    tab?: string;
  }>;
};

export async function generateMetadata({ params }: SportPageProps): Promise<Metadata> {
  const { sport: sportSlug } = await params;
  const resolvedSportSlug = sportOrder.find((sport) => sport === sportSlug);

  if (!resolvedSportSlug) {
    return buildTournamentPageMetadata("Sport", "Browse tournament sport details.");
  }

  const data = await getSportPageData(resolvedSportSlug);
  if (!data) {
    return buildTournamentPageMetadata("Sport", "Browse tournament sport details.");
  }

  return buildTournamentPageMetadata(data.sport.name, `View fixtures, standings, and bracket details for ${data.sport.name}.`);
}

export default async function SportPage({ params, searchParams }: SportPageProps) {
  const { sport: sportSlug } = await params;
  const routeParams = (await searchParams) ?? {};
  const selectedTab = routeParams.tab ?? "overview";
  const resolvedSportSlug = sportOrder.find((sport) => sport === sportSlug);

  if (!resolvedSportSlug) {
    notFound();
  }

  const data = await getSportPageData(resolvedSportSlug);
  if (!data) {
    notFound();
  }

  return <SportCenterScreen sportSlug={resolvedSportSlug} selectedTab={selectedTab} data={data} />;
}
