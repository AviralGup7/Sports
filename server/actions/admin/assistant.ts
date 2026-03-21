import type { SportSlug } from "@/domain/sports/types";
import { requireAdminProfile } from "@/server/auth";

import { runAnnouncementCommand, runAnnouncementUpdateCommand } from "./assistant/announcements";
import { runRescheduleCommand, runResultCommand, runStatusCommand } from "./assistant/matches";
import { runArchiveTeamCommand, runCreateTeamCommand, runUpdateTeamCommand } from "./assistant/teams";
import type { CommandContext, CommandResult } from "./assistant/types";
import { getRedirectPath, parseCommands, revalidateAdminAssistantPaths } from "./assistant/utils";
import { redirectWithMessage } from "./shared";

async function executeSingleAdminCommand(context: CommandContext, command: string): Promise<CommandResult> {
  const normalizedCommand = command.toLowerCase();

  if (/^(announce|announcement|notice|post announcement|publish announcement|publish notice|write notice)\b/.test(normalizedCommand)) {
    return runAnnouncementCommand(context, command);
  }

  if (/^(update|edit)\s+announcement\b/.test(normalizedCommand)) {
    return runAnnouncementUpdateCommand(context, command);
  }

  if (/^create\s+team\b/.test(normalizedCommand)) {
    return runCreateTeamCommand(context, command);
  }

  if (/^update\s+team\b/.test(normalizedCommand)) {
    return runUpdateTeamCommand(context, command);
  }

  if (/^archive\s+team\b/.test(normalizedCommand)) {
    return runArchiveTeamCommand(context, command);
  }

  if (/^(move|reschedule|change time for|change match)\b/.test(normalizedCommand)) {
    return runRescheduleCommand(context, command);
  }

  if (/^(status|set status|mark|update status)\b/.test(normalizedCommand)) {
    return runStatusCommand(context, command);
  }

  if (/^(result|score|update result)\b/.test(normalizedCommand)) {
    return runResultCommand(context, command);
  }

  throw new Error("Command not recognized. Try an announcement, team, move, status, or result command.");
}

export async function performRunAdminAssistant(formData: FormData) {
  const commandText = String(formData.get("command") ?? "").trim();
  const redirectPath = getRedirectPath(formData);

  if (!commandText) {
    return redirectWithMessage(redirectPath, "error", "Write a command first.");
  }

  const commands = parseCommands(commandText);
  if (commands.length === 0) {
    return redirectWithMessage(redirectPath, "error", "No runnable admin command was found.");
  }

  const context = await requireAdminProfile();
  const sportIds: SportSlug[] = [];
  const matchIds: string[] = [];
  const messages: string[] = [];

  for (const command of commands) {
    try {
      const result = await executeSingleAdminCommand(context, command);
      messages.push(result.message);

      if (result.sportIds) {
        sportIds.push(...result.sportIds);
      }

      if (result.matchId) {
        matchIds.push(result.matchId);
      }
    } catch (error) {
      return redirectWithMessage(
        redirectPath,
        "error",
        error instanceof Error ? error.message : "Admin AI command failed."
      );
    }
  }

  revalidateAdminAssistantPaths(sportIds, matchIds);
  return redirectWithMessage(redirectPath, "success", messages.join(" "));
}
