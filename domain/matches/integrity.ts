import type { CompetitionStage, Match } from "./types";

export function buildIntegrityIssues(matches: Match[], stages: CompetitionStage[]) {
  const issues: Array<{
    id: string;
    severity: "warning" | "error";
    title: string;
    detail: string;
    matchId?: string;
  }> = [];

  const stageIds = new Set(stages.map((stage) => stage.id));
  const matchIds = new Set(matches.map((match) => match.id));
  const incomingByTarget = new Map<string, Match[]>();

  for (const match of matches) {
    if (match.winnerToMatchId) {
      incomingByTarget.set(match.winnerToMatchId, [...(incomingByTarget.get(match.winnerToMatchId) ?? []), match]);
    }
    if (match.loserToMatchId) {
      incomingByTarget.set(match.loserToMatchId, [...(incomingByTarget.get(match.loserToMatchId) ?? []), match]);
    }
  }

  for (const match of matches) {
    if (match.stageId && !stageIds.has(match.stageId)) {
      issues.push({
        id: `${match.id}-missing-stage`,
        severity: "error",
        title: "Match is linked to a missing stage",
        detail: `${match.round} references ${match.stageId}, but that stage is not available in the sport configuration.`,
        matchId: match.id
      });
    }

    if (match.winnerToMatchId && !matchIds.has(match.winnerToMatchId)) {
      issues.push({
        id: `${match.id}-missing-winner-route`,
        severity: "error",
        title: "Winner route is broken",
        detail: `${match.round} points winners to ${match.winnerToMatchId}, but that target match does not exist.`,
        matchId: match.id
      });
    }

    if (match.loserToMatchId && !matchIds.has(match.loserToMatchId)) {
      issues.push({
        id: `${match.id}-missing-loser-route`,
        severity: "error",
        title: "Loser route is broken",
        detail: `${match.round} points losers to ${match.loserToMatchId}, but that target match does not exist.`,
        matchId: match.id
      });
    }

    if (match.status === "completed" && !match.result?.winnerTeamId && !match.isBye) {
      issues.push({
        id: `${match.id}-no-winner`,
        severity: "warning",
        title: "Completed match has no winner",
        detail: `${match.round} is marked completed, but no winner is locked yet.`,
        matchId: match.id
      });
    }

    if (match.isBye && match.teamAId && !match.result?.winnerTeamId) {
      issues.push({
        id: `${match.id}-bye-missing-winner`,
        severity: "warning",
        title: "Bye is missing an auto-advance winner",
        detail: `${match.round} is a bye slot, but the advancing team has not been saved in the result.`,
        matchId: match.id
      });
    }

    const incoming = incomingByTarget.get(match.id) ?? [];
    const hasCompletedIncoming = incoming.some((item) => item.status === "completed");
    const isBracketBoard = match.stage?.type === "knockout" || match.stage?.type === "placement";
    if (isBracketBoard && hasCompletedIncoming && (!match.teamAId || !match.teamBId) && match.status !== "cancelled") {
      issues.push({
        id: `${match.id}-slot-open`,
        severity: "warning",
        title: "Bracket slot is still unresolved",
        detail: `${match.round} has completed feeder matches, but one or more sides are still empty.`,
        matchId: match.id
      });
    }
  }

  return issues;
}
