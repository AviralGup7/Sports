import type { Profile } from "@/domain/admin/types";
import { cache } from "react";
import { hasSupabaseEnv } from "@/server/supabase/env";
import { profilesSeed } from "@/server/mock/tournament-snapshot";
import {
  AthleticsEventBoard,
  BracketPreviewCard,
  BracketTreeColumn,
  BracketTreeData,
  BracketTreeNode,
  ChampionEntry,
  ChampionSpotlight,
  DayNote,
  GlobalChromeData,
  HeroSignal,
  HighlightMatch,
  MatchPageData,
  HomePageData,
  MatchLineageCard,
  NextMatchCountdown,
  ScheduleGroup,
  SchedulePageData,
  SportProgressCard,
  SportScheduleBlock,
  SportPageData,
  StandingsPageData,
  StandingsSportCard,
  StageSummary,
  TeamListCard,
  TeamProfilePageData,
  TeamStandingsSnippet,
  TeamsPageData,
  TickerGroup,
  TournamentStats,
  TickerItem
} from "@/server/data/public/types";
import {
  AdminAnnouncementsData,
  AdminAttentionItem,
  AdminDashboardData,
  AdminMatchesData,
  AdminSettingsData,
  AdminTeamsData,
  AthleticsResultCard,
  IntegrityIssue
} from "@/server/data/admin/types";
import type { CompetitionStage, Match, Sport, SportSlug, Team } from "@/domain";

import { formatDateLabel, formatDateTime, formatTimeLabel } from "@/server/data/formatters";
import { buildIntegrityIssues, buildProgressionEdges, buildStandingsRows } from "@/domain/matches";
import { loadSnapshot, type RepositorySnapshot } from "@/server/data/snapshot";
import { buildDataState, getGeneratedAt } from "@/server/data/shared/query-state";
import { buildDayNote, getActiveStage, getGroupsForSport, getMatchesForSport, getPublicAnnouncements, getStagesForSport, getTournamentStatsFromSnapshot } from "@/server/data/shared/snapshot-selectors";

const IST_OFFSET = "+05:30";

function toMatchDateTime(day: string, time: string) {
  return new Date(`${day}T${time}:00${IST_OFFSET}`);
}

function getTodayInKolkata() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";

  return `${year}-${month}-${day}`;
}


function isTitleFinalRound(round: string) {
  const normalized = round.toLowerCase();
  return (normalized.includes("grand final") || /\bfinal\b/.test(normalized)) && !normalized.includes("quarter") && !normalized.includes("semi") && !normalized.includes("third");
}

function inferLegacyRoundIndex(match: Match) {
  const normalized = match.round.toLowerCase();

  if (normalized.includes("quarter")) {
    return 1;
  }

  if (normalized.includes("semi")) {
    return 2;
  }

  if (normalized.includes("grand final") || /\bfinal\b/.test(normalized)) {
    return 3;
  }

  if (normalized.includes("third") || normalized.includes("bronze")) {
    return 4;
  }

  return match.roundIndex || 99;
}

function getBracketMatches(matches: Match[]) {
  const staged = matches.filter((match) => match.stage?.type === "knockout" || match.stage?.type === "placement");
  if (staged.length > 0) {
    return staged;
  }

  return matches.filter((match) => {
    const round = match.round.toLowerCase();
    const isBracketRound =
      round.includes("quarter") ||
      round.includes("semi") ||
      round.includes("final") ||
      round.includes("third") ||
      round.includes("bronze");
    const hasProgression =
      Boolean(match.winnerToMatchId) ||
      Boolean(match.loserToMatchId) ||
      matches.some((candidate) => candidate.winnerToMatchId === match.id || candidate.loserToMatchId === match.id);

    return isBracketRound || hasProgression;
  });
}

function buildChampionEntries(snapshot: RepositorySnapshot): ChampionEntry[] {
  return snapshot.sports.map((sport) => {
    const finalMatch = [...getMatchesForSport(snapshot, sport.id)]
      .filter((match) => isTitleFinalRound(match.round))
      .sort((a, b) => b.roundIndex - a.roundIndex || `${b.day}T${b.startTime}`.localeCompare(`${a.day}T${a.startTime}`))[0];

    return {
      sport,
      winner: finalMatch?.status === "completed" ? finalMatch.result?.winner ?? null : null
    };
  });
}

function buildChampionSpotlights(snapshot: RepositorySnapshot): ChampionSpotlight[] {
  return buildChampionEntries(snapshot).map(({ sport, winner }) => ({
    sport,
    winner,
    statusLabel: winner ? "Champion Locked" : "Final Pending",
    note: winner
      ? `${winner.name} leads the ${sport.name.toLowerCase()} champions podium.`
      : `The ${sport.name.toLowerCase()} title is still up for grabs.`
  }));
}

function buildHighlightMatch(snapshot: RepositorySnapshot): HighlightMatch | null {
  const sportsById = new Map(snapshot.sports.map((sport) => [sport.id, sport]));
  const match =
    snapshot.matches.find((item) => item.status === "live") ??
    snapshot.matches.find((item) => item.status === "postponed") ??
    snapshot.matches.find((item) => item.status === "scheduled") ??
    snapshot.matches[0];

  if (!match) {
    return null;
  }

  const sport = sportsById.get(match.sportId);
  if (!sport) {
    return null;
  }

  const stageLabel = match.stage?.label ?? match.round;
  const headline =
    match.status === "live"
      ? `${match.teamA?.name ?? "TBD"} and ${match.teamB?.name ?? "TBD"} are live right now`
      : match.status === "postponed"
        ? `${stageLabel} is waiting on a reschedule call`
        : match.status === "completed"
          ? `${match.result?.winner?.name ?? "Result saved"} closed the ${stageLabel}`
          : `${stageLabel} is next on the schedule`;

  return {
    match,
    sport,
    label: match.status === "live" ? "Live Match" : match.status === "postponed" ? "Schedule Update" : "Featured Match",
    headline,
    summary: match.result?.scoreSummary ?? `${formatDateLabel(match.day)} at ${match.startTime} from ${match.venue}`,
    urgency: match.status === "live" ? "live" : match.status === "postponed" ? "watch" : "next"
  };
}

function buildTickerItems(snapshot: RepositorySnapshot): TickerItem[] {
  const ticker: TickerItem[] = [];
  const liveMatches = snapshot.matches.filter((match) => match.status === "live").slice(0, 2);
  const nextMatch = buildNextMatch(snapshot);

  for (const match of liveMatches) {
    ticker.push({
      id: `live-${match.id}`,
      label: "LIVE",
      message: `${match.sportId.toUpperCase()} | ${match.teamA?.name ?? "TBD"} vs ${match.teamB?.name ?? "TBD"} | ${match.result?.scoreSummary ?? match.round}`,
      href: `/matches/${match.id}`,
      tone: "live"
    });
  }

  if (liveMatches.length === 0 && nextMatch) {
    ticker.push({
      id: `next-${nextMatch.match.id}`,
      label: "UP NEXT",
      message: `${nextMatch.sport.name} | ${nextMatch.match.teamA?.name ?? "TBD"} vs ${nextMatch.match.teamB?.name ?? "TBD"} | ${formatDateTime(nextMatch.match.day, nextMatch.match.startTime)}`,
      href: `/matches/${nextMatch.match.id}`,
      tone: "info"
    });
  }

  for (const announcement of getPublicAnnouncements(snapshot).filter((item) => item.pinned).slice(0, 3)) {
    ticker.push({
      id: `notice-${announcement.id}`,
      label: "ALERT",
      message: announcement.title,
      href: "/announcements",
      tone: "alert"
    });
  }

  return ticker;
}

function buildTickerGroups(items: TickerItem[]): TickerGroup[] {
  const grouped = new Map<string, TickerGroup>();

  for (const item of items) {
    const key = item.tone;
    const existing = grouped.get(key);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    grouped.set(key, {
      id: key,
      label: key === "live" ? "Live Boards" : key === "alert" ? "Urgent Calls" : "Tournament Intel",
      tone: item.tone,
      items: [item]
    });
  }

  return Array.from(grouped.values());
}

function buildHeroSignals(
  snapshot: RepositorySnapshot,
  stats: TournamentStats,
  highlightMatch: HighlightMatch | null,
  nextMatch: NextMatchCountdown | null
): HeroSignal[] {
  const latestHeadline = getPublicAnnouncements(snapshot).find((announcement) => announcement.pinned) ?? getPublicAnnouncements(snapshot)[0];

  return [
    {
      id: "signal-live",
      label: "Live now",
      value: String(stats.liveMatches),
      detail: stats.liveMatches > 0 ? "Scores are updating on matches in progress right now." : "No matches are live at this exact moment.",
      tone: stats.liveMatches > 0 ? "live" : "neutral",
      href: highlightMatch?.urgency === "live" ? `/matches/${highlightMatch.match.id}` : "/schedule?status=live"
    },
    {
      id: "signal-next",
      label: "Next / today",
      value: nextMatch ? `${nextMatch.match.teamA?.name ?? "TBD"} vs ${nextMatch.match.teamB?.name ?? "TBD"}` : "Schedule ready",
      detail: nextMatch ? `${formatDateTime(nextMatch.match.day, nextMatch.match.startTime)} | ${nextMatch.match.venue}` : "Open the schedule to browse the next fixtures.",
      tone: nextMatch ? "info" : "neutral",
      href: nextMatch ? `/matches/${nextMatch.match.id}` : "/schedule"
    },
    {
      id: "signal-news",
      label: "Important notice",
      value: latestHeadline ? "Posted" : "Quiet",
      detail: latestHeadline?.title ?? "No new notices have been posted yet.",
      tone: latestHeadline ? "alert" : "neutral",
      href: "/announcements"
    }
  ];
}

function buildNextMatch(snapshot: RepositorySnapshot): NextMatchCountdown | null {
  const now = new Date();
  const sportsById = new Map(snapshot.sports.map((sport) => [sport.id, sport]));
  const nextMatch = snapshot.matches
    .filter((match) => match.status === "scheduled" || match.status === "live" || match.status === "postponed")
    .sort((a, b) => toMatchDateTime(a.day, a.startTime).getTime() - toMatchDateTime(b.day, b.startTime).getTime())
    .find((match) => toMatchDateTime(match.day, match.startTime).getTime() >= now.getTime());

  if (!nextMatch) {
    return null;
  }

  const sport = sportsById.get(nextMatch.sportId);
  if (!sport) {
    return null;
  }

  return {
    match: nextMatch,
    sport,
    startsAt: toMatchDateTime(nextMatch.day, nextMatch.startTime).toISOString()
  };
}

function buildScheduleGroups(fixtures: Match[]): ScheduleGroup[] {
  const grouped = new Map<string, Match[]>();

  for (const fixture of fixtures) {
    const bucket = grouped.get(fixture.startTime) ?? [];
    bucket.push(fixture);
    grouped.set(fixture.startTime, bucket);
  }

  return Array.from(grouped.entries())
    .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
    .map(([time, matches]) => ({
      time,
      label: formatTimeLabel(time),
      matches
    }));
}

function buildStageSummaries(snapshot: RepositorySnapshot, sportId?: SportSlug): StageSummary[] {
  const stages = sportId ? getStagesForSport(snapshot, sportId) : snapshot.stages;

  return stages.map((stage) => {
    const matches = snapshot.matches.filter((match) => match.stageId === stage.id);
    return {
      stage,
      totalMatches: matches.length,
      completedMatches: matches.filter((match) => match.status === "completed").length,
      liveMatches: matches.filter((match) => match.status === "live").length,
      pendingMatches: matches.filter((match) => match.status === "scheduled" || match.status === "postponed").length,
      groups: snapshot.groups.filter((group) => group.stageId === stage.id)
    };
  });
}

function buildSportProgressCards(snapshot: RepositorySnapshot, sportIds?: SportSlug[]): SportProgressCard[] {
  const sports = sportIds ? snapshot.sports.filter((sport) => sportIds.includes(sport.id)) : snapshot.sports;

  return sports.map((sport) => {
    const matches = getMatchesForSport(snapshot, sport.id);
    const completedMatches = matches.filter((match) => match.status === "completed").length;
    const liveMatches = matches.filter((match) => match.status === "live").length;
    const pendingMatches = matches.length - completedMatches - liveMatches;
    const finalsPending = matches.filter((match) => isTitleFinalRound(match.round) && match.status !== "completed").length;
    const completionPercent = matches.length > 0 ? Math.round((completedMatches / matches.length) * 100) : 0;
    const activeStageLabel = getActiveStage(snapshot, sport.id)?.label ?? "Structure open";

    return {
      sport,
      completedMatches,
      totalMatches: matches.length,
      liveMatches,
      pendingMatches,
      finalsPending,
      completionPercent,
      activeStageLabel,
      note:
        liveMatches > 0
          ? `${liveMatches} live match${liveMatches === 1 ? "" : "es"} currently active.`
          : finalsPending > 0
            ? `${finalsPending} final${finalsPending === 1 ? "" : "s"} still to be decided.`
            : pendingMatches > 0
              ? `${pendingMatches} match${pendingMatches === 1 ? "" : "es"} still to come.`
              : "All visible results are in.",
      href: `/sports/${sport.id}`
    };
  });
}

function buildBracketPreviewCard(snapshot: RepositorySnapshot, sport: Sport): BracketPreviewCard | null {
  const sportMatches = getMatchesForSport(snapshot, sport.id);
  const bracket = buildBracketTree(sportMatches, getStagesForSport(snapshot, sport.id));

  if (!bracket) {
    return null;
  }

  const rounds = bracket.columns.slice(0, 4).map((column) => ({
    label: column.label,
    filled: column.nodes.filter((node) => node.match.teamAId || node.match.teamBId).length,
    total: column.nodes.length
  }));

  const championMatch = sportMatches.find((match) => isTitleFinalRound(match.round));

  return {
    sport,
    stageLabel: getActiveStage(snapshot, sport.id)?.label ?? "Bracket",
    championLabel: championMatch?.result?.winner?.name ?? "Champion pending",
    href: `/sports/${sport.id}?tab=bracket`,
    rounds
  };
}

function buildBracketPreviewCards(snapshot: RepositorySnapshot, sportIds?: SportSlug[]) {
  const sports = sportIds ? snapshot.sports.filter((sport) => sportIds.includes(sport.id)) : snapshot.sports;
  return sports.map((sport) => buildBracketPreviewCard(snapshot, sport)).filter((card): card is BracketPreviewCard => Boolean(card));
}

function buildSportScheduleBlocks(snapshot: RepositorySnapshot, fixtures: Match[]): SportScheduleBlock[] {
  return snapshot.sports
    .map((sport) => {
      const sportMatches = fixtures.filter((match) => match.sportId === sport.id);

      if (sportMatches.length === 0) {
        return null;
      }

      return {
        sport,
        visibleCount: sportMatches.length,
        activeStageLabel: getActiveStage(snapshot, sport.id)?.label ?? "Mixed schedule",
        scheduleGroups: buildScheduleGroups(sportMatches)
      };
    })
    .filter((block): block is SportScheduleBlock => Boolean(block));
}

function getMatchesForTeam(snapshot: RepositorySnapshot, teamId: string) {
  return snapshot.matches
    .filter((match) => match.teamAId === teamId || match.teamBId === teamId)
    .sort((a, b) => toMatchDateTime(a.day, a.startTime).getTime() - toMatchDateTime(b.day, b.startTime).getTime());
}

function buildTeamListCards(snapshot: RepositorySnapshot): TeamListCard[] {
  const sportsById = new Map(snapshot.sports.map((sport) => [sport.id, sport]));

  return snapshot.teams
    .filter((team) => team.isActive)
    .map((team) => {
      const matches = getMatchesForTeam(snapshot, team.id);
      return {
        team,
        sports: team.sportIds.map((sportId) => sportsById.get(sportId)).filter((sport): sport is Sport => Boolean(sport)),
        liveMatches: matches.filter((match) => match.status === "live"),
        upcomingMatches: matches.filter((match) => match.status === "scheduled" || match.status === "postponed"),
        completedMatches: matches.filter((match) => match.status === "completed")
      };
    })
    .sort((a, b) => a.team.name.localeCompare(b.team.name));
}

function buildStandingsSections(snapshot: RepositorySnapshot, selectedSport?: SportSlug): StandingsSportCard[] {
  const sports = selectedSport ? snapshot.sports.filter((sport) => sport.id === selectedSport) : snapshot.sports;
  const sections: StandingsSportCard[] = [];

  for (const sport of sports) {
    const teams = snapshot.teams.filter((team) => team.isActive && team.sportIds.includes(sport.id));
    const matches = getMatchesForSport(snapshot, sport.id);
    const groups = getGroupsForSport(snapshot, sport.id);
    const stages = getStagesForSport(snapshot, sport.id);
    const cards = buildStandingsRows(teams, matches, groups, sport.id, stages);

    if (cards.length === 0) {
      continue;
    }

    sections.push({
      sport,
      cards,
      liveMatches: matches.filter((match) => match.status === "live").length,
      completedMatches: matches.filter((match) => match.status === "completed").length
    });
  }

  return sections;
}

function buildTeamStandings(snapshot: RepositorySnapshot, team: Team): TeamStandingsSnippet[] {
  const snippets: TeamStandingsSnippet[] = [];

  for (const sportId of team.sportIds) {
    const sport = snapshot.sports.find((item) => item.id === sportId);
    if (!sport) {
      continue;
    }

    const cards = buildStandingsRows(
      snapshot.teams.filter((candidate) => candidate.isActive && candidate.sportIds.includes(sportId)),
      getMatchesForSport(snapshot, sportId),
      getGroupsForSport(snapshot, sportId),
      sportId,
      getStagesForSport(snapshot, sportId)
    );
    const filteredCards = cards
      .map((card) => ({
        ...card,
        rows: card.rows.filter((row) => row.teamId === team.id)
      }))
      .filter((card) => card.rows.length > 0);

    if (filteredCards.length === 0) {
      continue;
    }

    snippets.push({
      sport,
      cards: filteredCards
    });
  }

  return snippets;
}

function buildAthleticsBoards(snapshot: RepositorySnapshot): AthleticsEventBoard[] {
  const athleticsMatches = getMatchesForSport(snapshot, "athletics");
  const grouped = new Map<string, Match[]>();

  for (const match of athleticsMatches) {
    const bucket = grouped.get(match.round) ?? [];
    bucket.push(match);
    grouped.set(match.round, bucket);
  }

  return Array.from(grouped.entries()).map(([title, matches]) => ({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title,
    stageLabel: matches[0]?.stage?.label ?? "Athletics results",
    description:
      matches.length > 1
        ? `${matches.length} association result cards are grouped in this event.`
        : "Single athletics result card for this event.",
    matches
  }));
}

function buildQuickResultCandidates(matches: Match[]) {
  return matches
    .filter((match) => match.status !== "cancelled")
    .map((match) => ({
      id: `${match.id}-quick`,
      matchId: match.id,
      sportId: match.sportId,
      matchLabel: `${match.stage?.label ?? match.round}${match.group ? ` | ${match.group.code}` : ""}`,
      teamAName: match.teamA?.name ?? "TBD",
      teamBName: match.teamB?.name ?? "TBD",
      winnerTeamId: match.result?.winnerTeamId ?? null,
      scoreSummary: match.result?.scoreSummary ?? null,
      progressionHint:
        match.winnerToMatchId || match.loserToMatchId
          ? "Saving a completed result will advance linked winner and loser routes immediately."
          : "This board does not currently feed another linked match.",
      status: match.status
    }));
}

function buildBackupStatus(snapshot: RepositorySnapshot) {
  return {
    envReady: hasSupabaseEnv(),
    usingFallbackData: snapshot.source === "fallback",
    exportedAt: new Date().toISOString(),
    note:
      snapshot.source === "fallback"
        ? "The app is currently rendering fallback tournament data. Exports still work, but live Supabase records are not being read."
        : "Live tournament data is available. Use exports as event-day backups before major updates."
  };
}

function mapNodeState(match: Match): BracketTreeNode["state"] {
  if (match.isBye) {
    return "bye";
  }

  if (match.status === "live") {
    return "live";
  }

  if (match.status === "completed") {
    return "completed";
  }

  if (match.status === "cancelled") {
    return "cancelled";
  }

  if (match.status === "postponed") {
    return "postponed";
  }

  return "pending";
}

function buildBracketTree(matches: Match[], _stages: CompetitionStage[]): BracketTreeData | null {
  const bracketMatches = getBracketMatches(matches).sort(
    (a, b) =>
      inferLegacyRoundIndex(a) - inferLegacyRoundIndex(b) ||
      a.matchNumber - b.matchNumber ||
      `${a.day}T${a.startTime}`.localeCompare(`${b.day}T${b.startTime}`)
  );

  if (bracketMatches.length === 0) {
    return null;
  }

  const grouped = new Map<string, Match[]>();
  for (const match of bracketMatches) {
    const key = `${match.stageId ?? "legacy"}-${inferLegacyRoundIndex(match)}`;
    const bucket = grouped.get(key) ?? [];
    bucket.push(match);
    grouped.set(key, bucket);
  }

  const columns: BracketTreeColumn[] = Array.from(grouped.entries()).map(([key, roundMatches]) => {
    const firstMatch = roundMatches[0];
    const label = firstMatch.stage?.type === "placement" ? firstMatch.round : `${firstMatch.round}`;

    return {
      id: key,
      label,
      count: roundMatches.length,
      nodes: roundMatches.map((match) => ({
        id: match.id,
        columnId: key,
        match,
        title: `${match.teamA?.name ?? "TBD"} vs ${match.teamB?.name ?? "TBD"}`,
        subtitle: `${match.stage?.label ?? "Bracket match"} | ${match.venue}`,
        state: mapNodeState(match),
        isHighlighted: match.status === "live" || Boolean(match.result?.winnerTeamId)
      }))
    };
  });

  const edges = buildProgressionEdges(bracketMatches).filter(
    (edge) =>
      bracketMatches.some((match) => match.id === edge.sourceMatchId) &&
      bracketMatches.some((match) => match.id === edge.targetMatchId)
  );

  const highlightPaths = bracketMatches.map((match) => {
    const linkedEdges = edges.filter((edge) => edge.sourceMatchId === match.id || edge.targetMatchId === match.id);
    const linkedMatchIds = Array.from(
      new Set(
        linkedEdges.flatMap((edge) => [edge.sourceMatchId, edge.targetMatchId]).filter((id) => id !== match.id)
      )
    );

    return {
      matchId: match.id,
      edgeKeys: linkedEdges.map((edge) => `${edge.sourceMatchId}-${edge.kind}-${edge.targetMatchId}`),
      linkedMatchIds
    };
  });

  return {
    columns,
    edges,
    highlightPaths
  };
}

function buildMatchLineage(snapshot: RepositorySnapshot, match: Match): MatchLineageCard[] {
  const fedBy = snapshot.matches.filter(
    (item) => item.winnerToMatchId === match.id || item.loserToMatchId === match.id || item.nextMatchId === match.id
  );
  const feedsInto = snapshot.matches.filter(
    (item) => item.id === match.winnerToMatchId || item.id === match.loserToMatchId || item.id === match.nextMatchId
  );
  const cards: MatchLineageCard[] = [];

  if (fedBy.length > 0) {
    cards.push({
      label: "Came From",
      matches: fedBy
    });
  }

  if (feedsInto.length > 0) {
    cards.push({
      label: "Feeds Into",
      matches: feedsInto
    });
  }

  return cards;
}

function buildRelatedMatches(snapshot: RepositorySnapshot, match: Match) {
  const lineageIds = new Set(
    snapshot.matches
      .filter(
        (item) =>
          item.id === match.winnerToMatchId ||
          item.id === match.loserToMatchId ||
          item.winnerToMatchId === match.id ||
          item.loserToMatchId === match.id
      )
      .map((item) => item.id)
  );

  return snapshot.matches.filter((item) => item.sportId === match.sportId && item.id !== match.id && !lineageIds.has(item.id)).slice(0, 4);
}

function buildAdminAttentionItems(snapshot: RepositorySnapshot, visibleMatches: Match[], integrityIssues: IntegrityIssue[]): AdminAttentionItem[] {
  const liveMatches = visibleMatches.filter((match) => match.status === "live");
  const pendingResults = visibleMatches.filter((match) => match.status !== "completed" && match.status !== "cancelled");
  const publicPinned = getPublicAnnouncements(snapshot).filter((announcement) => announcement.pinned);
  const completedMatches = visibleMatches.filter((match) => match.status === "completed");

  return [
    {
      id: "pending-results",
      label: "Pending Results",
      value: String(pendingResults.length),
      detail: "Boards waiting for result locks, postponement calls, or progression updates.",
      href: "/admin/matches?mode=live",
      tone: pendingResults.length > 0 ? "alert" : "success"
    },
    {
      id: "live-matches",
      label: "Live Boards",
      value: String(liveMatches.length),
      detail: liveMatches.length > 0 ? "Fixtures actively running right now." : "No fixtures are currently live.",
      href: "/admin/matches?mode=live",
      tone: liveMatches.length > 0 ? "live" : "neutral"
    },
    {
      id: "integrity",
      label: "Tree Issues",
      value: String(integrityIssues.length),
      detail: integrityIssues.length > 0 ? "Bracket routes or results need attention." : "No bracket integrity issues detected.",
      href: "/admin/matches?mode=tree",
      tone: integrityIssues.length > 0 ? "alert" : "success"
    },
    {
      id: "pinned-notices",
      label: "Pinned Notices",
      value: String(publicPinned.length),
      detail: "Public headline notices riding the ticker and announcement feed.",
      href: "/admin/announcements",
      tone: "neutral"
    },
    {
      id: "completed",
      label: "Completed",
      value: String(completedMatches.length),
      detail: "Results already locked into standings, trees, and archive lanes.",
      href: "/admin/matches?mode=live",
      tone: "success"
    }
  ];
}

function buildAthleticsCards(snapshot: RepositorySnapshot): AthleticsResultCard[] {
  const athleticsMatches = getMatchesForSport(snapshot, "athletics");
  const grouped = new Map<string, Match[]>();

  for (const match of athleticsMatches) {
    const bucket = grouped.get(match.round) ?? [];
    bucket.push(match);
    grouped.set(match.round, bucket);
  }

  return Array.from(grouped.entries()).map(([title, matches]) => ({
    id: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    matches
  }));
}

const getGlobalChromeDataCached = cache(
  async (): Promise<GlobalChromeData> => {
    const snapshot = await loadSnapshot();
    const tickerItems = buildTickerItems(snapshot);
    const generatedAt = getGeneratedAt();

    return {
      tournament: snapshot.tournament,
      sports: snapshot.sports,
      tickerItems,
      tickerGroups: buildTickerGroups(tickerItems),
      dataState: buildDataState(snapshot, generatedAt)
    };
  }
);

export async function getGlobalChromeData(): Promise<GlobalChromeData> {
  return getGlobalChromeDataCached();
}

export async function getHomePageData(): Promise<HomePageData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();
  const stats = getTournamentStatsFromSnapshot(snapshot);
  const highlightMatch = buildHighlightMatch(snapshot);
  const nextMatch = buildNextMatch(snapshot);
  const featuredMatches = snapshot.matches.filter((match) => match.status !== "completed").slice(0, 6);
  const anchorDay = highlightMatch?.match.day ?? featuredMatches[0]?.day ?? snapshot.tournament.startDate;

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    tournament: snapshot.tournament,
    sports: snapshot.sports,
    stats,
    dayNote: buildDayNote(snapshot, anchorDay),
    highlightMatch,
    nextMatch,
    heroSignals: buildHeroSignals(snapshot, stats, highlightMatch, nextMatch),
    featuredMatches,
    announcements: getPublicAnnouncements(snapshot).slice(0, 4),
    champions: buildChampionEntries(snapshot),
    championSpotlights: buildChampionSpotlights(snapshot),
    sportProgressCards: buildSportProgressCards(snapshot),
    bracketPreviewCards: buildBracketPreviewCards(snapshot),
    stageSummaries: snapshot.sports.map((sport) => {
      const matches = getMatchesForSport(snapshot, sport.id);
      return {
        sport,
        activeStage: getActiveStage(snapshot, sport.id),
        liveMatches: matches.filter((match) => match.status === "live").length,
        completedMatches: matches.filter((match) => match.status === "completed").length,
        totalMatches: matches.length
      };
    })
  };
}

export async function getSchedulePageData(
  day?: string,
  sportId?: SportSlug,
  stageIdOrStatus?: string,
  groupId?: string,
  status?: string
): Promise<SchedulePageData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();
  const days = Array.from(new Set(snapshot.matches.map((match) => match.day))).sort();
  const today = getTodayInKolkata();
  const selectedDay = day && days.includes(day) ? day : days.includes(today) ? today : days[0];
  const selectedStatus =
    status ??
    (stageIdOrStatus && ["scheduled", "live", "completed", "postponed", "cancelled"].includes(stageIdOrStatus) ? stageIdOrStatus : undefined);
  const fixtures = snapshot.matches.filter(
    (match) =>
      match.day === selectedDay &&
      (!sportId || match.sportId === sportId) &&
      (!selectedStatus || match.status === selectedStatus)
  );

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    days,
    selectedDay,
    selectedSport: sportId,
    selectedStatus,
    sports: snapshot.sports,
    dayNote: buildDayNote(snapshot, selectedDay),
    fixtures,
    scheduleGroups: buildScheduleGroups(fixtures),
    sportBlocks: buildSportScheduleBlocks(snapshot, fixtures)
  };
}

export async function getSportPageData(sportId: SportSlug): Promise<SportPageData | null> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();
  const sport = snapshot.sports.find((item) => item.id === sportId);

  if (!sport) {
    return null;
  }

  const teams = snapshot.teams.filter((team) => team.isActive && team.sportIds.includes(sportId));
  const matches = getMatchesForSport(snapshot, sportId);
  const stages = getStagesForSport(snapshot, sportId);
  const groups = getGroupsForSport(snapshot, sportId);
  const standings = buildStandingsRows(teams, matches, groups, sportId, stages);

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    sport: {
      ...sport,
      format: getActiveStage(snapshot, sportId)?.label ? `${sport.format} | ${getActiveStage(snapshot, sportId)?.label}` : sport.format
    },
    stages,
    groups,
    stageSummaries: buildStageSummaries(snapshot, sportId),
    teams,
    matches,
    standings,
    bracket: buildBracketTree(matches, stages),
    sportProgressCard: buildSportProgressCards(snapshot, [sportId])[0],
    bracketPreview: buildBracketPreviewCard(snapshot, sport),
    overviewMatches: matches.slice(0, 6)
  };
}

export async function getMatchPageData(matchId: string): Promise<MatchPageData | null> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();
  const match = snapshot.matches.find((item) => item.id === matchId);

  if (!match) {
    return null;
  }

  const sport = snapshot.sports.find((item) => item.id === match.sportId);
  if (!sport) {
    return null;
  }

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    match,
    sport,
    relatedMatches: buildRelatedMatches(snapshot, match),
    lineage: buildMatchLineage(snapshot, match),
    winnerTargetMatch: snapshot.matches.find((item) => item.id === match.winnerToMatchId) ?? null,
    loserTargetMatch: snapshot.matches.find((item) => item.id === match.loserToMatchId) ?? null,
    bracketNeighbors: snapshot.matches.filter(
      (item) =>
        item.sportId === match.sportId &&
        item.id !== match.id &&
        (item.id === match.winnerToMatchId ||
          item.id === match.loserToMatchId ||
          item.winnerToMatchId === match.id ||
          item.loserToMatchId === match.id)
    )
  };
}

export async function getAnnouncementsPageData() {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();
  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    items: getPublicAnnouncements(snapshot)
  };
}

export async function getStandingsPageData(selectedSport?: SportSlug): Promise<StandingsPageData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    sports: snapshot.sports,
    selectedSport,
    sections: buildStandingsSections(snapshot, selectedSport)
  };
}

export async function getTeamsPageData(): Promise<TeamsPageData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    teams: buildTeamListCards(snapshot),
    sports: snapshot.sports
  };
}

export async function getTeamProfilePageData(teamId: string): Promise<TeamProfilePageData | null> {
  const snapshot = await loadSnapshot();
  const team = snapshot.teams.find((item) => item.id === teamId && item.isActive);

  if (!team) {
    return null;
  }

  const sportsById = new Map(snapshot.sports.map((sport) => [sport.id, sport]));
  const matches = getMatchesForTeam(snapshot, team.id);
  const generatedAt = getGeneratedAt();

  return {
    generatedAt,
    dataState: buildDataState(snapshot, generatedAt),
    team,
    sports: team.sportIds.map((sportId) => sportsById.get(sportId)).filter((sport): sport is Sport => Boolean(sport)),
    liveMatches: matches.filter((match) => match.status === "live"),
    upcomingMatches: matches.filter((match) => match.status === "scheduled" || match.status === "postponed"),
    completedMatches: matches.filter((match) => match.status === "completed"),
    standings: buildTeamStandings(snapshot, team)
  };
}

export async function getAdminDashboardData(profile: Profile): Promise<AdminDashboardData> {
  const snapshot = await loadSnapshot();
  const allowedSports = profile.role === "super_admin" ? snapshot.sports.map((sport) => sport.id) : profile.sportIds;
  const visibleMatches = snapshot.matches.filter((match) => allowedSports.includes(match.sportId));
  const liveMatch = visibleMatches.find((match) => match.status === "live");
  const anchorDay =
    liveMatch?.day ??
    visibleMatches.find((match) => match.status === "scheduled" || match.status === "postponed")?.day ??
    visibleMatches[0]?.day;
  const todaysMatches = visibleMatches.filter((match) => match.day === anchorDay).slice(0, 6);
  const integrityIssues = buildIntegrityIssues(visibleMatches, snapshot.stages.filter((stage) => allowedSports.includes(stage.sportId)));

  return {
    profile,
    stats: getTournamentStatsFromSnapshot(snapshot),
    dayNote: buildDayNote(snapshot, anchorDay),
    todaysMatches,
    pendingResults: visibleMatches.filter((match) => match.status !== "completed" && match.status !== "cancelled").slice(0, 6),
    announcements: snapshot.announcements.slice(0, 5),
    teams: snapshot.teams
      .filter((team) => team.isActive && (profile.role === "super_admin" || team.sportIds.some((sportId) => profile.sportIds.includes(sportId))))
      .slice(0, 8),
    attentionItems: buildAdminAttentionItems(snapshot, visibleMatches, integrityIssues),
    stageSummaries: snapshot.sports
      .filter((sport) => allowedSports.includes(sport.id))
      .flatMap((sport) => buildStageSummaries(snapshot, sport.id)),
    sportProgressCards: buildSportProgressCards(snapshot, allowedSports),
    bracketPreviewCards: buildBracketPreviewCards(snapshot, allowedSports),
    backupStatus: buildBackupStatus(snapshot)
  };
}

export async function getAdminTeamsData(profile: Profile): Promise<AdminTeamsData> {
  const snapshot = await loadSnapshot();
  const sports =
    profile.role === "super_admin"
      ? snapshot.sports
      : snapshot.sports.filter((sport) => profile.sportIds.includes(sport.id));
  const teams =
    profile.role === "super_admin"
      ? snapshot.teams
      : snapshot.teams.filter((team) => team.sportIds.some((sportId) => profile.sportIds.includes(sportId)));

  return {
    profile,
    sports,
    teams
  };
}

export async function getAdminMatchesData(profile: Profile): Promise<AdminMatchesData> {
  const snapshot = await loadSnapshot();
  const sports =
    profile.role === "super_admin"
      ? snapshot.sports
      : snapshot.sports.filter((sport) => profile.sportIds.includes(sport.id));
  const matches =
    profile.role === "super_admin"
      ? snapshot.matches
      : snapshot.matches.filter((match) => profile.sportIds.includes(match.sportId));
  const stages =
    profile.role === "super_admin"
      ? snapshot.stages
      : snapshot.stages.filter((stage) => profile.sportIds.includes(stage.sportId));
  const groups =
    profile.role === "super_admin"
      ? snapshot.groups
      : snapshot.groups.filter((group) => profile.sportIds.includes(group.sportId));
  const teams = snapshot.teams.filter((team) => team.isActive);
  const integrityIssues = buildIntegrityIssues(matches, stages);

  return {
    profile,
    sports,
    stages,
    groups,
    teams,
    matches,
    days: Array.from(new Set(matches.map((match) => match.day))).sort(),
    builderCards: sports
      .filter((sport) => sport.id !== "athletics")
      .map((sport) => ({
        sport,
        stages: stages.filter((stage) => stage.sportId === sport.id),
        groups: groups.filter((group) => group.sportId === sport.id),
        standings: buildStandingsRows(teams, matches, groups, sport.id, stages),
        bracket: buildBracketTree(matches.filter((match) => match.sportId === sport.id), stages.filter((stage) => stage.sportId === sport.id)),
        integrityIssues: integrityIssues.filter((issue) => matches.some((match) => match.id === issue.matchId && match.sportId === sport.id)),
        teams: teams.filter((team) => team.sportIds.includes(sport.id))
      })),
    athleticsCards: buildAthleticsCards({
      ...snapshot,
      matches: matches.filter((match) => match.sportId === "athletics")
    }),
    athleticsBoards: buildAthleticsBoards({
      ...snapshot,
      matches: matches.filter((match) => match.sportId === "athletics")
    }),
    integrityIssues,
    quickResultCandidates: buildQuickResultCandidates(matches),
    operatorGuide: [
      "Use quick result to close live or just-finished boards without opening the full fixture editor.",
      "Switch to Builder when you need to regenerate structure, not for day-of score entry.",
      "Open Bracket Manager to check unresolved winner or loser routes before finals day."
    ]
  };
}

export async function getAdminAnnouncementsData(profile: Profile): Promise<AdminAnnouncementsData> {
  const snapshot = await loadSnapshot();

  return {
    profile,
    announcements:
      profile.role === "super_admin"
        ? snapshot.announcements
        : snapshot.announcements.filter(
            (announcement) => announcement.visibility === "public" || profile.sportIds.length > 0
          )
  };
}

export async function getAdminSettingsData(profile: Profile): Promise<AdminSettingsData> {
  const snapshot = await loadSnapshot();
  const generatedAt = getGeneratedAt();
  return {
    profile,
    tournament: snapshot.tournament,
    dataState: buildDataState(snapshot, generatedAt),
    envReady: hasSupabaseEnv(),
    usingFallbackData: snapshot.source === "fallback",
    exportedAt: generatedAt
  };
}

export function getAdminSeedProfile() {
  return profilesSeed[0];
}

export function getSportBySlugFromCollection(sports: Sport[], sportId?: SportSlug) {
  return sports.find((sport) => sport.id === sportId);
}

