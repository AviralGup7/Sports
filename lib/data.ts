import { unstable_noStore as noStore } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  announcementsSeed,
  matchesSeed,
  profilesSeed,
  resultsSeed,
  sportOrder,
  sportsSeed,
  teamsSeed,
  tournamentSeed
} from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  AdminAnnouncementsData,
  AdminAttentionItem,
  AdminDashboardData,
  AdminMatchesData,
  AdminSettingsData,
  AdminTeamsData,
  Announcement,
  BracketRound,
  ChampionEntry,
  ChampionSpotlight,
  GlobalChromeData,
  HighlightMatch,
  HomePageData,
  Match,
  MatchResult,
  MatchStatus,
  MatchPageData,
  Profile,
  ScheduleGroup,
  SchedulePageData,
  Sport,
  SportPageData,
  SportSlug,
  Team,
  Tournament,
  TournamentStats,
  TickerItem
} from "@/lib/types";

type SportRow = { id: SportSlug; name: string; color: string; rules_summary: string; format: string };
type TeamRow = { id: string; name: string; association: string; seed: number; is_active: boolean };
type TeamSportRow = { team_id: string; sport_id: SportSlug };
type TournamentRow = { id: string; name: string; start_date: string; end_date: string; venue: string };
type MatchRow = {
  id: string;
  sport_id: SportSlug;
  round: string;
  day: string;
  start_time: string;
  venue: string;
  team_a_id: string | null;
  team_b_id: string | null;
  status: MatchStatus;
  next_match_id: string | null;
  next_slot: "team_a" | "team_b" | null;
};
type MatchResultRow = {
  match_id: string;
  winner_team_id: string | null;
  score_summary: string | null;
  note: string | null;
  updated_by: string | null;
  updated_at: string | null;
};
type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  visibility: "public" | "admin";
  pinned: boolean;
  published_at: string;
  is_published: boolean;
};

type RepositorySnapshot = {
  tournament: Tournament;
  sports: Sport[];
  teams: Team[];
  matches: Match[];
  announcements: Announcement[];
};

function hydrateSnapshot(input: {
  tournament: Tournament;
  sports: Sport[];
  teams: Team[];
  results: MatchResult[];
  matches: Match[];
  announcements: Announcement[];
}): RepositorySnapshot {
  const teamsById = new Map(input.teams.map((team) => [team.id, team]));
  const resultsByMatchId = new Map(input.results.map((result) => [result.matchId, result]));

  const matches = input.matches
    .map((match) => {
      const result = resultsByMatchId.get(match.id) ?? null;
      const winner = result?.winnerTeamId ? teamsById.get(result.winnerTeamId) ?? null : null;

      return {
        ...match,
        teamA: match.teamAId ? teamsById.get(match.teamAId) ?? null : null,
        teamB: match.teamBId ? teamsById.get(match.teamBId) ?? null : null,
        result: result
          ? {
              ...result,
              winner
            }
          : null
      };
    })
    .sort((a, b) => `${a.day}T${a.startTime}`.localeCompare(`${b.day}T${b.startTime}`));

  const announcements = [...input.announcements].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );

  return {
    tournament: input.tournament,
    sports: [...input.sports].sort((a, b) => sportOrder.indexOf(a.id) - sportOrder.indexOf(b.id)),
    teams: [...input.teams].sort((a, b) => a.seed - b.seed || a.name.localeCompare(b.name)),
    matches,
    announcements
  };
}

function getFallbackSnapshot() {
  return hydrateSnapshot({
    tournament: tournamentSeed,
    sports: sportsSeed,
    teams: teamsSeed,
    results: resultsSeed,
    matches: matchesSeed,
    announcements: announcementsSeed
  });
}

async function loadSnapshot(): Promise<RepositorySnapshot> {
  noStore();

  if (!hasSupabaseEnv()) {
    return getFallbackSnapshot();
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [
      preferredTournamentRes,
      fallbackTournamentRes,
      sportsRes,
      teamsRes,
      teamSportsRes,
      matchesRes,
      resultsRes,
      announcementsRes
    ] = await Promise.all([
      supabase
        .from("tournaments")
        .select("id, name, start_date, end_date, venue")
        .eq("id", tournamentSeed.id)
        .maybeSingle<TournamentRow>(),
      supabase
        .from("tournaments")
        .select("id, name, start_date, end_date, venue")
        .order("start_date", { ascending: true })
        .limit(1)
        .returns<TournamentRow[]>(),
      supabase.from("sports").select("id, name, color, rules_summary, format").returns<SportRow[]>(),
      supabase.from("teams").select("id, name, association, seed, is_active").returns<TeamRow[]>(),
      supabase.from("team_sports").select("team_id, sport_id").returns<TeamSportRow[]>(),
      supabase
        .from("matches")
        .select("id, sport_id, round, day, start_time, venue, team_a_id, team_b_id, status, next_match_id, next_slot")
        .returns<MatchRow[]>(),
      supabase
        .from("match_results")
        .select("match_id, winner_team_id, score_summary, note, updated_by, updated_at")
        .returns<MatchResultRow[]>(),
      supabase
        .from("announcements")
        .select("id, title, body, visibility, pinned, published_at, is_published")
        .returns<AnnouncementRow[]>()
    ]);

    const tournamentRow = preferredTournamentRes.data ?? fallbackTournamentRes.data?.[0] ?? null;

    if (
      preferredTournamentRes.error ||
      fallbackTournamentRes.error ||
      sportsRes.error ||
      teamsRes.error ||
      teamSportsRes.error ||
      matchesRes.error ||
      resultsRes.error ||
      announcementsRes.error ||
      !tournamentRow
    ) {
      throw new Error(
        [
          preferredTournamentRes.error?.message,
          fallbackTournamentRes.error?.message,
          sportsRes.error?.message,
          teamsRes.error?.message,
          teamSportsRes.error?.message,
          matchesRes.error?.message,
          resultsRes.error?.message,
          announcementsRes.error?.message
        ]
          .filter(Boolean)
          .join(" | ")
      );
    }

    const teamSportsByTeamId = new Map<string, SportSlug[]>();
    for (const relation of teamSportsRes.data) {
      const existing = teamSportsByTeamId.get(relation.team_id) ?? [];
      existing.push(relation.sport_id);
      teamSportsByTeamId.set(relation.team_id, existing);
    }

    const tournament: Tournament = {
      id: tournamentRow.id,
      name: tournamentRow.name,
      startDate: tournamentRow.start_date,
      endDate: tournamentRow.end_date,
      venue: tournamentRow.venue
    };

    const sports: Sport[] = sportsRes.data.map((sport) => ({
      id: sport.id,
      name: sport.name,
      color: sport.color,
      rulesSummary: sport.rules_summary,
      format: sport.format
    }));

    const teams: Team[] = teamsRes.data.map((team) => ({
      id: team.id,
      name: team.name,
      association: team.association,
      sportIds: teamSportsByTeamId.get(team.id) ?? [],
      seed: team.seed,
      isActive: team.is_active
    }));

    const matches: Match[] = matchesRes.data.map((match) => ({
      id: match.id,
      sportId: match.sport_id,
      round: match.round,
      day: match.day,
      startTime: match.start_time.slice(0, 5),
      venue: match.venue,
      teamAId: match.team_a_id,
      teamBId: match.team_b_id,
      status: match.status,
      nextMatchId: match.next_match_id,
      nextSlot: match.next_slot
    }));

    const results: MatchResult[] = resultsRes.data.map((result) => ({
      matchId: result.match_id,
      winnerTeamId: result.winner_team_id,
      scoreSummary: result.score_summary,
      note: result.note,
      updatedBy: result.updated_by,
      updatedAt: result.updated_at
    }));

    const announcements: Announcement[] = announcementsRes.data.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      visibility: announcement.visibility,
      pinned: announcement.pinned,
      publishedAt: announcement.published_at,
      isPublished: announcement.is_published
    }));

    return hydrateSnapshot({
      tournament,
      sports,
      teams,
      results,
      matches,
      announcements
    });
  } catch (error) {
    console.error("Falling back to local seed data:", error);
    return getFallbackSnapshot();
  }
}

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

function getSportMap(snapshot: RepositorySnapshot) {
  return new Map(snapshot.sports.map((sport) => [sport.id, sport]));
}

function buildHighlightMatch(snapshot: RepositorySnapshot): HighlightMatch | null {
  const sportsById = getSportMap(snapshot);
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

  const summary =
    match.result?.scoreSummary ??
    `${formatDateLabel(match.day)} at ${match.startTime} from ${match.venue}`;

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

export function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
}

export function formatTimeLabel(timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const date = new Date("2026-01-01T00:00:00");
  date.setHours(Number(hours), Number(minutes));
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function formatDateTime(dateString: string, timeString: string) {
  const [hours, minutes] = timeString.split(":");
  const date = new Date(dateString);
  date.setHours(Number(hours), Number(minutes));
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function getStatusTone(status: MatchStatus) {
  if (status === "completed") {
    return "complete";
  }

  if (status === "live") {
    return "live";
  }

  return "scheduled";
}

export function getSportBySlugFromCollection(sports: Sport[], sportId?: SportSlug) {
  return sports.find((sport) => sport.id === sportId);
}

export function getAdminSeedProfile() {
  return profilesSeed[0];
}
