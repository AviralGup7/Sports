import { HomeScreen } from "@/features/public/home/home-screen";
import { getHomePageData } from "@/server/data/public/home-query";

export default async function HomePage() {
  const data = await getHomePageData();

  return <HomeScreen data={data} />;
}
