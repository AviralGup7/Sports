const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.1-8b-instant";

type GroqMatchContext = {
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

type GroqAnnouncementContext = {
  id: string;
  title: string;
  visibility: string;
  pinned: boolean;
  isPublished: boolean;
};

type GroqPlanningInput = {
  apiKey: string;
  prompt: string;
  matches: GroqMatchContext[];
  announcements: GroqAnnouncementContext[];
};

type GroqPlanningResult = {
  command: string;
  summary: string;
};

type GroqApiError = {
  error?: {
    message?: string;
  };
};

function getAuthHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
}

async function parseGroqError(response: Response) {
  try {
    const data = (await response.json()) as GroqApiError;
    return data.error?.message ?? `Groq request failed with status ${response.status}.`;
  } catch {
    return `Groq request failed with status ${response.status}.`;
  }
}

function extractJsonObject(content: string) {
  const fenced = content.match(/```json\s*([\s\S]+?)```/i);
  if (fenced) {
    return fenced[1].trim();
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return content.slice(start, end + 1);
  }

  return content.trim();
}

export async function testGroqConnection(apiKey: string) {
  const response = await fetch(`${GROQ_BASE_URL}/models`, {
    headers: getAuthHeaders(apiKey),
    method: "GET",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await parseGroqError(response));
  }

  const data = (await response.json()) as {
    data?: Array<{ id: string }>;
  };

  return {
    ok: true,
    model: data.data?.[0]?.id ?? GROQ_MODEL
  };
}

export async function planAdminCommandWithGroq({ apiKey, prompt, matches, announcements }: GroqPlanningInput): Promise<GroqPlanningResult> {
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: getAuthHeaders(apiKey),
    cache: "no-store",
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content:
            "You are an admin operations planner for a sports tournament portal. Convert a natural-language admin request into exactly one canonical command. Return JSON only with keys command and summary. Valid commands are: " +
            '1) post announcement [pin] [draft] [admin] TITLE :: BODY ' +
            '2) update announcement ANNOUNCEMENT_ID [pin|unpin] [draft|publish] [admin|public] TITLE :: BODY ' +
            '3) move MATCH_ID to YYYY-MM-DD HH:MM [at VENUE] ' +
            '4) status MATCH_ID scheduled|live|completed|postponed|cancelled ' +
            '5) result MATCH_ID winner TEAM_NAME score A-B [note NOTE]. ' +
            "Choose the correct match id or announcement id from the provided context. Prefer exact ids when they exist. Keep times in 24-hour HH:MM format."
        },
        {
          role: "user",
          content: JSON.stringify({
            prompt,
            matches,
            announcements
          })
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(await parseGroqError(response));
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const rawContent = data.choices?.[0]?.message?.content?.trim();
  if (!rawContent) {
    throw new Error("Groq returned an empty planning response.");
  }

  const parsed = JSON.parse(extractJsonObject(rawContent)) as Partial<GroqPlanningResult>;

  if (!parsed.command || !parsed.summary) {
    throw new Error("Groq did not return a usable admin command.");
  }

  return {
    command: parsed.command.trim(),
    summary: parsed.summary.trim()
  };
}
