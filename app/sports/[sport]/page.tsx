import { notFound } from "next/navigation";

import { SportCenterScreen } from "@/features/public/sport-center/sport-center-screen";
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
