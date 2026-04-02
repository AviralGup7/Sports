import type { Match } from "@/domain/matches/types";

export type CricketScoreLine = {
  runs: number;
  wickets: number;
  overs: string;
};

export type CricketScoreboardEntry = {
  teamName: string;
  line: CricketScoreLine;
};

const DEFAULT_CRICKET_LINE: CricketScoreLine = {
  runs: 0,
  wickets: 0,
  overs: "0.0"
};

export function parseCricketScoreLine(raw: string | undefined, fallbackRuns: number | null | undefined): CricketScoreLine {
  const normalized = raw?.trim() ?? "";
  const match = normalized.match(/(\d+)(?:\/(\d+))?(?:\s*\(?\s*([0-9]+(?:\.[0-9])?)\s*(?:ov|ovs|overs?)?\s*\)?)?/i);

  if (!match) {
    return {
      ...DEFAULT_CRICKET_LINE,
      runs: fallbackRuns ?? DEFAULT_CRICKET_LINE.runs
    };
  }

  return {
    runs: Number(match[1] ?? fallbackRuns ?? DEFAULT_CRICKET_LINE.runs),
    wickets: Number(match[2] ?? DEFAULT_CRICKET_LINE.wickets),
    overs: match[3] ?? DEFAULT_CRICKET_LINE.overs
  };
}

export function formatCricketScoreLine(line: CricketScoreLine) {
  return `${line.runs}/${line.wickets} (${line.overs} ov)`;
}

export function buildCricketScoreSummary(teamA: CricketScoreLine, teamB: CricketScoreLine) {
  return `${formatCricketScoreLine(teamA)} vs ${formatCricketScoreLine(teamB)}`;
}

export function getCricketScoreboardEntries(match: Match): CricketScoreboardEntry[] {
  const summary = match.result?.scoreSummary ?? "";
  const splitSummary = summary.split(/\s+vs\s+/i);

  const teamALine = parseCricketScoreLine(splitSummary[0], match.result?.teamAScore);
  const teamBLine = parseCricketScoreLine(splitSummary[1], match.result?.teamBScore);

  return [
    {
      teamName: match.teamA?.name ?? "TBD",
      line: teamALine
    },
    {
      teamName: match.teamB?.name ?? "TBD",
      line: teamBLine
    }
  ];
}
