import { NextResponse } from "next/server";

import { getAdminProfile } from "@/server/auth";
import { testGroqConnection } from "@/server/ai/groq";

export async function POST(request: Request) {
  const admin = await getAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as { apiKey?: string };
  const apiKey = body.apiKey?.trim();

  if (!apiKey) {
    return NextResponse.json({ error: "Groq API key is required." }, { status: 400 });
  }

  try {
    const result = await testGroqConnection(apiKey);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Groq connection failed." },
      { status: 400 }
    );
  }
}
