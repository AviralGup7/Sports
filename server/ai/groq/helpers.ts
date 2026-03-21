import type { GroqApiError } from "./types";

export function getAuthHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
}

export async function parseGroqError(response: Response) {
  try {
    const data = (await response.json()) as GroqApiError;
    return data.error?.message ?? `Groq request failed with status ${response.status}.`;
  } catch {
    return `Groq request failed with status ${response.status}.`;
  }
}

export function extractJsonObject(content: string) {
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

export function normalizePlannedCommand(command: string) {
  return command
    .trim()
    .replace(/^[-*\d.)\s]+/, "")
    .replace(/\[admin\]/gi, "admin")
    .replace(/\[public\]/gi, "public")
    .replace(/\bpinned\b/gi, "pin")
    .replace(/\bunpinned\b/gi, "unpin")
    .replace(/\bunpublish(?:ed)?\b/gi, "draft")
    .replace(/\[note\s+([^\]]+)\]/gi, "note $1")
    .replace(/\[at\s+([^\]]+)\]/gi, "at $1")
    .replace(/\[association\s+([^\]]+)\]/gi, "association $1")
    .replace(/\[sports?\s+([^\]]+)\]/gi, "sports $1")
    .replace(/\bTITLE:\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ensureCanonicalResultCommand(command: string) {
  const match = command.match(/^result\s+([a-z0-9-]+)\s+(.+?)\s+score\s+(\d+)\s*[-:]\s*(\d+)(?:\s+note\s+(.+))?$/i);
  if (!match || /\swinner\s/i.test(command)) {
    return command;
  }

  const [, matchId, winnerText, scoreA, scoreB, note] = match;
  const noteSuffix = note ? ` note ${note}` : "";
  return `result ${matchId} winner ${winnerText.trim()} score ${scoreA}-${scoreB}${noteSuffix}`;
}

function pruneUnrequestedCommands(prompt: string, commands: string[]) {
  const normalizedPrompt = prompt.toLowerCase();
  const hasExplicitStatusIntent =
    /\bstatus\b|\blive\b|\bpostpon(?:e|ed)\b|\bcancel(?:led)?\b|\bcomplete(?:d)?\b|\bmark\b/.test(normalizedPrompt);
  const hasExplicitAnnouncementUpdateIntent =
    /\bupdate announcement\b|\bedit announcement\b|\bannouncement\s+[a-z0-9-]+\b/.test(normalizedPrompt);

  return commands.filter((command) => {
    const normalizedCommand = command.toLowerCase();

    if (!hasExplicitStatusIntent && /^status\s+[a-z0-9-]+\s+scheduled$/.test(normalizedCommand)) {
      return false;
    }

    if (!hasExplicitAnnouncementUpdateIntent && /^update\s+announcement\b/.test(normalizedCommand) && commands.some((item) => /^post\s+announcement\b/i.test(item))) {
      return false;
    }

    return true;
  });
}

export function canonicalizePlannedCommands(prompt: string, commands: string[]) {
  return pruneUnrequestedCommands(
    prompt,
    Array.from(
      new Set(
        commands
          .map((command) => ensureCanonicalResultCommand(normalizePlannedCommand(command)))
          .filter(Boolean)
      )
    )
  );
}
