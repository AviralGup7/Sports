import { canonicalizePlannedCommands, extractJsonObject, getAuthHeaders, normalizePlannedCommand, parseGroqError } from "./groq/helpers";
import { GROQ_SYSTEM_PROMPT } from "./groq/prompt";
import type { GroqPlanningInput, GroqPlanningResult, RawGroqPlanningResult } from "./groq/types";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.1-8b-instant";

export { normalizePlannedCommand } from "./groq/helpers";

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

export async function planAdminCommandWithGroq({ apiKey, prompt, matches, announcements, teams }: GroqPlanningInput): Promise<GroqPlanningResult> {
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
          content: GROQ_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: JSON.stringify({
            prompt,
            matches,
            announcements,
            teams
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

  const parsed = JSON.parse(extractJsonObject(rawContent)) as RawGroqPlanningResult;
  const rawCommands = Array.isArray(parsed.commands)
    ? parsed.commands.map((command) => String(command))
    : parsed.command
      ? [String(parsed.command)]
      : [];

  if (rawCommands.length === 0) {
    throw new Error("Groq did not return a usable admin command.");
  }

  const commands = canonicalizePlannedCommands(prompt, rawCommands);

  if (commands.length === 0) {
    throw new Error("Groq did not return a usable admin command.");
  }

  return {
    commands,
    summary: parsed.summary?.trim() || `Prepared ${commands.length} admin command${commands.length === 1 ? "" : "s"}.`
  };
}
