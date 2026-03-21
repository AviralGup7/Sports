import { NextResponse } from "next/server";

import { getAdminProfile } from "@/server/auth";
import { planAdminCommandWithGroq } from "@/server/ai/groq";

type PlanningMatchContext = {
  id: string;
  sportId: string;
  round: string;
  day: string;
  startTime: string;
  venue: string;
  status: string;
  teamAName: string;
  teamBName: string;
};

type PlanningAnnouncementContext = {
  id: string;
  title: string;
  visibility: string;
  pinned: boolean;
  isPublished: boolean;
};

type PlanningTeamContext = {
  id: string;
  name: string;
  association: string;
  seed: number;
  sportIds: string[];
  isActive: boolean;
};

export async function POST(request: Request) {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    apiKey?: string;
    prompt?: string;
    matches?: PlanningMatchContext[];
    announcements?: PlanningAnnouncementContext[];
    teams?: PlanningTeamContext[];
  };

  const apiKey = body.apiKey?.trim();
  const prompt = body.prompt?.trim();

  if (!apiKey || !prompt) {
    return NextResponse.json({ error: "Groq API key and prompt are required." }, { status: 400 });
  }

  try {
    const result = await planAdminCommandWithGroq({
      apiKey,
      prompt,
      matches: body.matches ?? [],
      announcements: body.announcements ?? [],
      teams: body.teams ?? []
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Groq planning failed." },
      { status: 400 }
    );
  }
}
