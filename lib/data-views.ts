import { profilesSeed } from "@/lib/mock-data";
import {
  AdminAnnouncementsData,
  AdminAttentionItem,
  AdminDashboardData,
  AdminMatchesData,
  AdminSettingsData,
  AdminTeamsData,
  BracketRound,
  ChampionEntry,
  ChampionSpotlight,
  GlobalChromeData,
  HighlightMatch,
  HomePageData,
  MatchPageData,
  ScheduleGroup,
  SchedulePageData,
  SportPageData,
  TournamentStats,
  TickerItem
} from "@/lib/types-view";
import { Match, Profile, SportSlug } from "@/lib/types-domain";
import { hasSupabaseEnv } from "@/lib/supabase/env";

import { formatDateLabel, formatDateTime, formatTimeLabel } from "./data-format";
import { RepositorySnapshot, loadSnapshot } from "./repository-snapshot";

function getPublicAnnouncements(snapshot: RepositorySnapshot) {
  return snapshot.announcements.filter((announcement) => announcement.visibility === "public" && announcement.isPublished);
}

function getTournamentStatsFromSnapshot(snapshot: RepositorySnapshot): TournamentStats {
  return {
    sports: snapshot.sports.length,
    teams: snapshot.teams.filter((team) => team.isActive).length,
    matches: snapshot.matches.length,
    completedMatches: snapshot.matches.filter((match) => match.status === "completed").length,
    announcements: getPublicAnnouncements(snapshot).length
  };
}

function buildChampionEntries(snapshot: RepositorySnapshot): ChampionEntry[] {
  return snapshot.sports.map((sport) => {
    const finalMatch = snapshot.matches.find((match) => match.sportId === sport.id && match.round.toLowerCase() === "final");
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
      ? `${winner.name} closed out the ${sport.name.toLowerCase()} title run.`
      : `Waiting on the final result to crown the ${sport.name.toLowerCase()} champion.`
  }));
}

function buildHighlightMatch(snapshot: RepositorySnapshot): HighlightMatch | null {
  const sportsById = new Map(snapshot.sports.map((sport) => [sport.id, sport]));
  const match =
    snapshot.matches.find((item) => item.status === "live") ??
    snapshot.matches.find((item) => item.status === "scheduled") ??
    snapshot.matches[0];

  if (!match) {
    return null;
  }

  const sport = sportsById.get(match.sportId);
  if (!sport) {
    return null;
  }

  const headline =
    match.status === "live"
      ? `${match.teamA?.name ?? "TBD"} are on the floor now`
      : match.status === "completed"
        ? `${match.result?.winner?.name ?? "Result saved"} closed this fixture`
        : `${match.round} is next on the arena board`;

  const summary = match.result?.scoreSummary ?? `${formatDateLabel(match.day)} at ${match.startTime} from ${match.venue}`;

  return {
    match,
    sport,
    label: match.status === "live" ? "Now Playing" : match.status === "completed" ? "Latest Final" : "Featured Fixture",
    headline,
    summary
  };
}

function buildTickerItems(snapshot: RepositorySnapshot): TickerItem[] {
  const ticker: TickerItem[] = [];
  const liveMatches = snapshot.matches.filter((match) => match.status === "live").slice(0, 2);
  const publicAnnouncements = getPublicAnnouncements(snapshot);

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
      message: `${match.teamA?.name ?? "TBD"} vs ${match.teamB?.name ?? "TBD"} in ${match.sportId}`,
      href: `/matches/${match.id}`,
      tone: "live"
    });
  }

  for (const announcement of publicAnnouncements.filter((item) => item.pinned).slice(0, 3)) {
    ticker.push({
      id: `notice-${announcement.id}`,
      label: announcement.pinned ? "Pinned" : "Update",
      message: announcement.title,
      href: "/announcements",
      tone: "alert"
    });
  }

  return ticker;
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

function buildAdminAttentionItems(snapshot: RepositorySnapshot, visibleMatches: Match[]): AdminAttentionItem[] {
  const liveMatches = visibleMatches.filter((match) => match.status === "live");
  const pendingResults = visibleMatches.filter((match) => match.status !== "completed");
  const publicPinned = getPublicAnnouncements(snapshot).filter((announcement) => announcement.pinned);
  const completedMatches = visibleMatches.filter((match) => match.status === "completed");

  return [
    {
      id: "pending-results",
      label: "Pending Results",
      value: String(pendingResults.length),
      detail: "Fixtures still waiting for a final lock and winner progression.",
      href: "/admin/matches",
      tone: pendingResults.length > 0 ? "alert" : "success"
    },
    {
      id: "live-matches",
      label: "Live Boards",
      value: String(liveMatches.length),
      detail: liveMatches.length > 0 ? "Fixtures actively running right now." : "No fixtures are currently live.",
      href: "/admin/matches",
      tone: liveMatches.length > 0 ? "live" : "neutral"
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
      detail: "Results already locked into the archive and progression chain.",
      href: "/admin/matches",
      tone: "success"
    }
  ];
}

function getSportStageLabel(matches: Match[]) {
  if (matches.some((match) => match.status === "live")) {
    return "Live Round";
  }

  const finalMatch = matches.find((match) => match.round.toLowerCase() === "final");
  if (finalMatch?.status === "completed") {
    return "Champion Decided";
  }

  return matches[0]?.round ?? "Bracket Open";
}

export function buildBracketRounds(matches: Match[]): BracketRound[] {
  const grouped = new Map<string, Match[]>();

  for (const match of matches) {
    const bucket = grouped.get(match.round) ?? [];
    bucket.push(match);
    grouped.set(match.round, bucket);
  }

  return Array.from(grouped.entries()).map(([label, roundMatches]) => ({
    label,
    matches: roundMatches.sort((a, b) => `${a.day}T${a.startTime}`.localeCompare(`${b.day}T${b.startTime}`))
  }));
}

export async function getGlobalChromeData(): Promise<GlobalChromeData> {
  const snapshot = await loadSnapshot();

  return {
    tournament: snapshot.tournament,
    sports: snapshot.sports,
    tickerItems: buildTickerItems(snapshot)
  };
}

export async function getHomePageData(): Promise<HomePageData> {
  const snapshot = await loadSnapshot();
  const stats = getTournamentStatsFromSnapshot(snapshot);
  const highlightMatch = buildHighlightMatch(snapshot);
  const featuredMatches = snapshot.matches.filter((match) => match.status !== "completed").slice(0, 5);

  return {
    tournament: snapshot.tournament,
    sports: snapshot.sports,
    stats,
    highlightMatch,
    featuredMatches,
    announcements: getPublicAnnouncements(snapshot).slice(0, 4),
    champions: buildChampionEntries(snapshot),
    championSpotlights: buildChampionSpotlights(snapshot)
  };
}

export async function getSchedulePageData(day?: string, sportId?: SportSlug): Promise<SchedulePageData> {
  const snapshot = await loadSnapshot();
  const days = Array.from(new Set(snapshot.matches.map((match) => match.day))).sort();
  const selectedDay = day && days.includes(day) ? day : days[0];
  const fixtures = snapshot.matches.filter(
    (match) => match.day === selectedDay && (!sportId || match.sportId === sportId)
  );

  return {
    days,
    selectedDay,
    selectedSport: sportId,
    sports: snapshot.sports,
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
  const matches = snapshot.matches.filter((match) => match.sportId === sportId);

  return {
    sport: {
      ...sport,
      format: `${sport.format} | ${getSportStageLabel(matches)}`
    },
    teams,
    matches,
    bracket: buildBracketRounds(matches)
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
    relatedMatches: snapshot.matches.filter((item) => item.sportId === match.sportId && item.id !== match.id).slice(0, 4)
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
  const anchorDay = liveMatch?.day ?? visibleMatches.find((match) => match.status === "scheduled")?.day ?? visibleMatches[0]?.day;
  const todaysMatches = visibleMatches.filter((match) => match.day === anchorDay).slice(0, 6);
  const pendingResults = visibleMatches.filter((match) => match.status !== "completed").slice(0, 6);

  return {
    profile,
    stats: getTournamentStatsFromSnapshot(snapshot),
    todaysMatches,
    pendingResults,
    announcements: snapshot.announcements.slice(0, 5),
    attentionItems: buildAdminAttentionItems(snapshot, visibleMatches)
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

  return {
    profile,
    sports,
    teams: snapshot.teams.filter((team) => team.isActive),
    matches,
    days: Array.from(new Set(matches.map((match) => match.day))).sort()
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
