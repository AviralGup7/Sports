import type { CommandContext, CommandResult, AnnouncementRow } from "./types";
import { slugify } from "../shared";

export async function runAnnouncementCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^(?:announce|announcement|notice|post announcement|publish announcement|publish notice|write notice)\s+(.+?)(?:\s*::\s*([\s\S]+))?$/i);

  if (!match) {
    throw new Error("Use announcement commands like: post announcement pin Weather delay :: Cricket starts at 6:30 PM.");
  }

  const flagsAndTitle = match[1].trim();
  const body = match[2]?.trim() || flagsAndTitle;
  const pinned = /\bpin(?:ned)?\b/i.test(flagsAndTitle);
  const draft = /\bdraft\b/i.test(flagsAndTitle);
  const adminOnly = /\badmin(?:\s+only)?\b/i.test(flagsAndTitle);
  const title = flagsAndTitle
    .replace(/\bpin(?:ned)?\b/gi, "")
    .replace(/\bdraft\b/gi, "")
    .replace(/\badmin(?:\s+only)?\b/gi, "")
    .replace(/\bpublic\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!title || !body) {
    throw new Error("Announcement commands need both a title and body.");
  }

  const announcementId = `${slugify(title)}-${Date.now()}`;
  const { error } = await context.supabase.from("announcements").upsert({
    id: announcementId,
    title,
    body,
    visibility: adminOnly ? "admin" : "public",
    pinned,
    is_published: !draft,
    published_at: new Date().toISOString()
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: `Announcement "${title}" created.`
  };
}

export async function runAnnouncementUpdateCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const match = command.match(/^(?:update|edit)\s+announcement\s+([a-z0-9-]+)\s+(.+?)(?:\s*::\s*([\s\S]+))?$/i);

  if (!match) {
    throw new Error("Use update commands like: update announcement weather-delay publish pin Weather delay :: Cricket starts at 6:30 PM.");
  }

  const [, announcementId, flagsAndTitle, body] = match;
  const { data: existingAnnouncement, error: existingError } = await context.supabase
    .from("announcements")
    .select("id, title, body, visibility, pinned, is_published")
    .eq("id", announcementId)
    .maybeSingle<AnnouncementRow>();

  if (existingError || !existingAnnouncement) {
    throw new Error(existingError?.message ?? `Announcement "${announcementId}" was not found.`);
  }

  const normalizedFlags = flagsAndTitle.trim();
  const title = normalizedFlags
    .replace(/\bpin(?:ned)?\b/gi, "")
    .replace(/\bunpin\b/gi, "")
    .replace(/\bdraft\b/gi, "")
    .replace(/\bpublish(?:ed)?\b/gi, "")
    .replace(/\bunpublish(?:ed)?\b/gi, "")
    .replace(/\badmin(?:\s+only)?\b/gi, "")
    .replace(/\bpublic\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const pinned = /\bunpin\b/i.test(normalizedFlags) ? false : /\bpin(?:ned)?\b/i.test(normalizedFlags) ? true : existingAnnouncement.pinned;
  const isPublished = /\bdraft\b|\bunpublish(?:ed)?\b/i.test(normalizedFlags) ? false : /\bpublish(?:ed)?\b/i.test(normalizedFlags) ? true : existingAnnouncement.is_published;
  const visibility = /\badmin(?:\s+only)?\b/i.test(normalizedFlags)
    ? "admin"
    : /\bpublic\b/i.test(normalizedFlags)
      ? "public"
      : existingAnnouncement.visibility;

  const { error } = await context.supabase.from("announcements").upsert({
    id: existingAnnouncement.id,
    title: title || existingAnnouncement.title,
    body: body?.trim() || title || existingAnnouncement.body,
    visibility,
    pinned,
    is_published: isPublished,
    published_at: new Date().toISOString()
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    message: `Announcement "${existingAnnouncement.id}" updated.`
  };
}
