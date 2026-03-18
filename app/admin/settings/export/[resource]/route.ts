import { NextResponse } from "next/server";

import { getAdminProfile } from "@/lib/auth";
import { getAdminAnnouncementsData, getAdminMatchesData, getAdminTeamsData } from "@/lib/data";

type RouteContext = {
  params: Promise<{
    resource: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const context = await getAdminProfile();
  if (!context) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { resource } = await params;

  if (resource === "teams") {
    const data = await getAdminTeamsData(context.profile);
    return NextResponse.json(data.teams);
  }

  if (resource === "matches") {
    const data = await getAdminMatchesData(context.profile);
    return NextResponse.json(data.matches);
  }

  if (resource === "results") {
    const data = await getAdminMatchesData(context.profile);
    return NextResponse.json(data.matches.map((match) => match.result).filter(Boolean));
  }

  if (resource === "announcements") {
    const data = await getAdminAnnouncementsData(context.profile);
    return NextResponse.json(data.announcements);
  }

  return new NextResponse("Not found", { status: 404 });
}
