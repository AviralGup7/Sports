import type { Profile } from "@/domain/admin/types";
import { hasSupabaseEnv } from "@/server/supabase/env";
import { profilesSeed } from "@/server/mock/tournament-snapshot";
import {
  BracketTreeColumn,
  BracketTreeData,
  BracketTreeNode,
  ChampionEntry,
  ChampionSpotlight,
  GlobalChromeData,
  GroupStandingsCard,
  HeroSignal,
  HighlightMatch,
  MatchPageData,
  HomePageData,
  MatchLineageCard,
  ScheduleGroup,
  SchedulePageData,
  SportPageData,
  StageSummary,
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

function getPublicAnnouncements(snapshot: RepositorySnapshot) {
  return snapshot.announcements.filter((announcement) => announcement.visibility === "public" && announcement.isPublished);
}

function getTournamentStatsFromSnapshot(snapshot: RepositorySnapshot): TournamentStats {
  return {
    sports: snapshot.sports.length,
    teams: snapshot.teams.filter((team) => team.isActive).length,
    matches: snapshot.matches.length,
    completedMatches: snapshot.matches.filter((match) => match.status === "completed").length,
    liveMatches: snapshot.matches.filter((match) => match.status === "live").length,
    announcements: getPublicAnnouncements(snapshot).length
  };
}

function getMatchesForSport(snapshot: RepositorySnapshot, sportId: SportSlug) {
  return snapshot.matches.filter((match) => match.sportId === sportId);
}

function getStagesForSport(snapshot: RepositorySnapshot, sportId: SportSlug) {
  return snapshot.stages.filter((stage) => stage.sportId === sportId).sort((a, b) => a.orderIndex - b.orderIndex);
}

function getGroupsForSport(snapshot: RepositorySnapshot, sportId: SportSlug) {
  return snapshot.groups.filter((group) => group.sportId === sportId).sort((a, b) => a.orderIndex - b.orderIndex);
}

function getActiveStage(snapshot: RepositorySnapshot, sportId: SportSlug) {
  const sportStages = getStagesForSport(snapshot, sportId);
  const matches = getMatchesForSport(snapshot, sportId);

  return (
    sportStages.find((stage) =>
      matches.some((match) => match.stageId === stage.id && (match.status === "live" || match.status === "scheduled" || match.status === "postponed"))
    ) ??
    sportStages.find((stage) => stage.isActive) ??
    sportStages[0] ??
    null
  );
}

function buildChampionEntries(snapshot: RepositorySnapshot): ChampionEntry[] {
  return snapshot.sports.map((sport) => {
    const finalMatch = [...getMatchesForSport(snapshot, sport.id)]
      .filter((match) => match.round.toLowerCase().includes("final"))
      .sort((a, b) => b.roundIndex - a.roundIndex)[0];

    return {
      sport,
      winner: finalMatch?.result?.winner ?? null
    };
  });
}

function buildChampionSpotlights(snapshot: RepositorySnapshot): ChampionSpotlight[] {
  return buildChampionEntries(snapshot).map(({ sport, winner }) => ({
    sport,
    winner,
    statusLabel: winner ? "Champion Locked" : "Final Pending",
    note: winner
      ? `${winner.name} owns the ${sport.name.toLowerCase()} title lane.`
      : `The ${sport.name.toLowerCase()} championship board is still open.`
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
      ? `${match.teamA?.name ?? "TBD"} and ${match.teamB?.name ?? "TBD"} are live on the board`
      : match.status === "postponed"
        ? `${stageLabel} is waiting on a reschedule call`
        : match.status === "completed"
          ? `${match.result?.winner?.name ?? "Result saved"} closed the ${stageLabel}`
          : `${stageLabel} is next in the tournament feed`;

  return {
    match,
    sport,
    label: match.status === "live" ? "Live Spotlight" : match.status === "postponed" ? "Delay Watch" : "Featured Board",
    headline,
    summary: match.result?.scoreSummary ?? `${formatDateLabel(match.day)} at ${match.startTime} from ${match.venue}`,
    urgency: match.status === "live" ? "live" : match.status === "postponed" ? "watch" : "next"
  };
}

function buildTickerItems(snapshot: RepositorySnapshot): TickerItem[] {
  const ticker: TickerItem[] = [];
  const liveMatches = snapshot.matches.filter((match) => match.status === "live").slice(0, 2);

  ticker.push({
    id: "window",
    label: "Tournament Window",
    message: `${formatDateLabel(snapshot.tournament.startDate)} to ${formatDateLabel(snapshot.tournament.endDate)} at ${snapshot.tournament.venue}`,
    href: "/schedule",
    tone: "info"
  });

  for (const match of liveMatches) {
    ticker.push({
      id: `live-${match.id}`,
      label: "Live",
      message: `${match.teamA?.name ?? "TBD"} vs ${match.teamB?.name ?? "TBD"} | ${match.round}`,
      href: `/matches/${match.id}`,
      tone: "live"
    });
  }

  for (const announcement of getPublicAnnouncements(snapshot).filter((item) => item.pinned).slice(0, 3)) {
    ticker.push({
      id: `notice-${announcement.id}`,
      label: "Pinned",
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

function buildHeroSignals(snapshot: RepositorySnapshot, stats: TournamentStats, highlightMatch: HighlightMatch | null): HeroSignal[] {
  const latestHeadline = getPublicAnnouncements(snapshot).find((announcement) => announcement.pinned) ?? getPublicAnnouncements(snapshot)[0];

  return [
    {
      id: "signal-live",
      label: "Live Boards",
      value: String(stats.liveMatches),
      detail: stats.liveMatches > 0 ? "Matches currently charging through the arena." : "No live boards at this exact moment.",
      tone: stats.liveMatches > 0 ? "live" : "neutral",
      href: "/schedule?status=live"
    },
    {
      id: "signal-spotlight",
      label: "Spotlight",
      value: highlightMatch?.sport.name ?? "Standby",
      detail: highlightMatch?.headline ?? "The next headline board will take over this lane.",
      tone: highlightMatch?.urgency === "live" ? "live" : highlightMatch?.urgency === "watch" ? "alert" : "info",
      href: highlightMatch ? `/matches/${highlightMatch.match.id}` : "/schedule"
    },
    {
      id: "signal-titles",
      label: "Title Watch",
      value: `${snapshot.matches.filter((match) => match.round.toLowerCase().includes("final")).length} finals`,
      detail: "Championship and placement lanes are ready for a prestige finish.",
      tone: "info",
      href: "/schedule"
    },
    {
      id: "signal-news",
      label: "Headline Feed",
      value: latestHeadline ? "Pinned" : "Quiet",
      detail: latestHeadline?.title ?? "No fresh notices are pinned to the arena feed yet.",
      tone: latestHeadline ? "alert" : "neutral",
      href: "/announcements"
    }
  ];
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

function buildBracketTree(matches: Match[], stages: CompetitionStage[]): BracketTreeData | null {
  const bracketMatches = matches
    .filter((match) => match.stage?.type === "knockout" || match.stage?.type === "placement")
    .sort((a, b) => a.roundIndex - b.roundIndex || a.matchNumber - b.matchNumber || `${a.day}T${a.startTime}`.localeCompare(`${b.day}T${b.startTime}`));

  if (bracketMatches.length === 0) {
    return null;
  }

  const grouped = new Map<string, Match[]>();
  for (const match of bracketMatches) {
    const key = `${match.stageId ?? "unknown"}-${match.roundIndex}`;
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
        subtitle: `${match.stage?.label ?? "Bracket"} | ${match.venue}`,
        state: mapNodeState(match),
        isHighlighted: match.status === "live" || Boolean(match.result?.winnerTeamId)
      }))
    };
  });

  const stageIds = new Set(stages.map((stage) => stage.id));
  const edges = buildProgressionEdges(bracketMatches).filter(
    (edge) =>
      bracketMatches.some((match) => match.id === edge.sourceMatchId) &&
      bracketMatches.some((match) => match.id === edge.targetMatchId) &&
      stageIds.size >= 0
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

export async function getGlobalChromeData(): Promise<GlobalChromeData> {
  const snapshot = await loadSnapshot();
  const tickerItems = buildTickerItems(snapshot);

  return {
    tournament: snapshot.tournament,
    sports: snapshot.sports,
    tickerItems,
    tickerGroups: buildTickerGroups(tickerItems)
  };
}

export async function getHomePageData(): Promise<HomePageData> {
  const snapshot = await loadSnapshot();
  const stats = getTournamentStatsFromSnapshot(snapshot);
  const highlightMatch = buildHighlightMatch(snapshot);
  const featuredMatches = snapshot.matches.filter((match) => match.status !== "completed").slice(0, 6);

  return {
    tournament: snapshot.tournament,
    sports: snapshot.sports,
    stats,
    highlightMatch,
    heroSignals: buildHeroSignals(snapshot, stats, highlightMatch),
    featuredMatches,
    announcements: getPublicAnnouncements(snapshot).slice(0, 4),
    champions: buildChampionEntries(snapshot),
    championSpotlights: buildChampionSpotlights(snapshot),
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
  stageId?: string,
  groupId?: string,
  status?: string
): Promise<SchedulePageData> {
  const snapshot = await loadSnapshot();
  const days = Array.from(new Set(snapshot.matches.map((match) => match.day))).sort();
  const selectedDay = day && days.includes(day) ? day : days[0];
  const stages = sportId ? getStagesForSport(snapshot, sportId) : snapshot.stages;
  const groups = sportId ? getGroupsForSport(snapshot, sportId) : snapshot.groups;
  const fixtures = snapshot.matches.filter(
    (match) =>
      match.day === selectedDay &&
      (!sportId || match.sportId === sportId) &&
      (!stageId || match.stageId === stageId) &&
      (!groupId || match.groupId === groupId) &&
      (!status || match.status === status)
  );

  return {
    days,
    selectedDay,
    selectedSport: sportId,
    selectedStage: stageId,
    selectedGroup: groupId,
    selectedStatus: status,
    sports: snapshot.sports,
    stages,
    groups,
    fixtures,
    scheduleGroups: buildScheduleGroups(fixtures)
  };
}

export async function getSportPageData(sportId: SportSlug): Promise<SportPageData | null> {
  const snapshot = await loadSnapshot();
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
    sport: {
      ...sport,
      format: `${sport.format} | ${getActiveStage(snapshot, sportId)?.label ?? "Structure open"}`
    },
    stages,
    groups,
    stageSummaries: buildStageSummaries(snapshot, sportId),
    teams,
    matches,
    standings,
    bracket: sportId === "athletics" ? null : buildBracketTree(matches, stages),
    overviewMatches: matches.slice(0, 6),
    athleticsMatches: sportId === "athletics" ? matches : []
  };
}

export async function getMatchPageData(matchId: string): Promise<MatchPageData | null> {
  const snapshot = await loadSnapshot();
  const match = snapshot.matches.find((item) => item.id === matchId);

  if (!match) {
    return null;
  }

  const sport = snapshot.sports.find((item) => item.id === match.sportId);
  if (!sport) {
    return null;
  }

  return {
    match,
    sport,
    relatedMatches: buildRelatedMatches(snapshot, match),
    lineage: buildMatchLineage(snapshot, match),
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
  return getPublicAnnouncements(snapshot);
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
    todaysMatches,
    pendingResults: visibleMatches.filter((match) => match.status !== "completed" && match.status !== "cancelled").slice(0, 6),
    announcements: snapshot.announcements.slice(0, 5),
    attentionItems: buildAdminAttentionItems(snapshot, visibleMatches, integrityIssues),
    stageSummaries: snapshot.sports
      .filter((sport) => allowedSports.includes(sport.id))
      .flatMap((sport) => buildStageSummaries(snapshot, sport.id))
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
    integrityIssues
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
  return {
    profile,
    envReady: hasSupabaseEnv(),
    exportedAt: new Date().toISOString()
  };
}

export function getAdminSeedProfile() {
  return profilesSeed[0];
}

export function getSportBySlugFromCollection(sports: Sport[], sportId?: SportSlug) {
  return sports.find((sport) => sport.id === sportId);
}

