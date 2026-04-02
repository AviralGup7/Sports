import type { Announcement } from "@/domain/announcements/types";
import type { CompetitionGroup, CompetitionStage, Match, MatchResult } from "@/domain/matches/types";
import type { Sport, SportSlug } from "@/domain/sports/types";
import type { Team } from "@/domain/teams/types";
import type { Tournament, TournamentContact } from "@/domain/tournament/types";
import { sportOrder } from "@/server/mock/tournament-snapshot";
import type {
  AnnouncementRow,
  GroupRow,
  MatchResultRow,
  MatchRow,
  RepositorySnapshot,
  SportRow,
  StageRow,
  TeamRow,
  TeamSportRow,
  TournamentSettingsRow,
  TournamentRow
} from "@/server/data/snapshot/types";

function mapTournamentContacts(value: unknown, fallbackContacts: TournamentContact[]): TournamentContact[] {
  if (!Array.isArray(value)) {
    return fallbackContacts;
  }

  const contacts = value
    .map((entry, index): TournamentContact | null => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const candidate = entry as Record<string, unknown>;
      const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
      const phone = typeof candidate.phone === "string" ? candidate.phone.trim() : "";
      const role = typeof candidate.role === "string" && candidate.role.trim().length > 0 ? candidate.role.trim() : undefined;
      const id = typeof candidate.id === "string" && candidate.id.trim().length > 0 ? candidate.id.trim() : `contact-${index + 1}`;

      if (!name || !phone) {
        return null;
      }

      return {
        id,
        name,
        phone,
        role
      };
    })
    .filter((contact): contact is TournamentContact => contact !== null);

  return contacts.length > 0 ? contacts : fallbackContacts;
}

export function mapTournamentRow(row: TournamentRow, settings: TournamentSettingsRow | null, fallbackTournament: Tournament): Tournament {
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    venue: row.venue,
    logoAssetPath: typeof settings?.logo_asset_path === "string" && settings.logo_asset_path.trim().length > 0 ? settings.logo_asset_path : fallbackTournament.logoAssetPath,
    contacts: mapTournamentContacts(settings?.contacts_json, fallbackTournament.contacts)
  };
}

export function mapSportRows(rows: SportRow[]): Sport[] {
  return rows.map((sport) => ({
    id: sport.id,
    name: sport.name,
    color: sport.color,
    rulesSummary: sport.rules_summary,
    format: sport.format
  }));
}

export function mapStageRows(rows: StageRow[]): CompetitionStage[] {
  return rows.map((stage) => ({
    id: stage.id,
    sportId: stage.sport_id,
    type: stage.type,
    label: stage.label,
    orderIndex: stage.order_index,
    advancesCount: stage.advances_count,
    isActive: stage.is_active
  }));
}

export function mapGroupRows(rows: GroupRow[]): CompetitionGroup[] {
  return rows.map((group) => ({
    id: group.id,
    stageId: group.stage_id,
    sportId: group.sport_id,
    code: group.code,
    orderIndex: group.order_index
  }));
}

export function mapTeamRows(rows: TeamRow[], teamSports: TeamSportRow[]): Team[] {
  const teamSportsByTeamId = new Map<string, SportSlug[]>();
  for (const relation of teamSports) {
    const existing = teamSportsByTeamId.get(relation.team_id) ?? [];
    existing.push(relation.sport_id);
    teamSportsByTeamId.set(relation.team_id, existing);
  }

  return rows.map((team) => ({
    id: team.id,
    name: team.name,
    association: team.association,
    sportIds: teamSportsByTeamId.get(team.id) ?? [],
    seed: team.seed,
    isActive: team.is_active
  }));
}

export function mapMatchRows(rows: MatchRow[]): Match[] {
  return rows.map((match) => ({
    id: match.id,
    sportId: match.sport_id,
    round: match.round,
    day: match.day,
    startTime: match.start_time.slice(0, 5),
    venue: match.venue,
    stageId: match.stage_id,
    groupId: match.group_id,
    roundIndex: match.round_index ?? 1,
    matchNumber: match.match_number ?? 1,
    teamAId: match.team_a_id,
    teamBId: match.team_b_id,
    status: match.status,
    winnerToMatchId: match.winner_to_match_id ?? match.next_match_id,
    winnerToSlot: match.winner_to_slot ?? match.next_slot,
    loserToMatchId: match.loser_to_match_id,
    loserToSlot: match.loser_to_slot,
    nextMatchId: match.next_match_id ?? match.winner_to_match_id,
    nextSlot: match.next_slot ?? match.winner_to_slot,
    isBye: Boolean(match.is_bye)
  }));
}

export function mapResultRows(rows: MatchResultRow[]): MatchResult[] {
  return rows.map((result) => ({
    matchId: result.match_id,
    winnerTeamId: result.winner_team_id,
    teamAScore: result.team_a_score,
    teamBScore: result.team_b_score,
    decisionType: result.decision_type ?? "normal",
    scoreSummary: result.score_summary,
    note: result.note,
    updatedBy: result.updated_by,
    updatedAt: result.updated_at
  }));
}

export function mapAnnouncementRows(rows: AnnouncementRow[]): Announcement[] {
  return rows.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    body: announcement.body,
    visibility: announcement.visibility,
    pinned: announcement.pinned,
    publishedAt: announcement.published_at,
    isPublished: announcement.is_published
  }));
}

export function hydrateSnapshot(input: {
  source?: "supabase" | "fallback";
  tournament: Tournament;
  sports: Sport[];
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  teams: Team[];
  results: MatchResult[];
  matches: Match[];
  announcements: Announcement[];
}): RepositorySnapshot {
  const teamsById = new Map(input.teams.map((team) => [team.id, team]));
  const stagesById = new Map(input.stages.map((stage) => [stage.id, stage]));
  const groupsById = new Map(input.groups.map((group) => [group.id, group]));
  const resultsByMatchId = new Map(input.results.map((result) => [result.matchId, result]));

  const isSmokeTestValue = (value: string | null | undefined) => (value ?? "").toLowerCase().includes("smoke test");

  const matches = input.matches
    .map((match) => {
      const result = resultsByMatchId.get(match.id) ?? null;
      const winner = result?.winnerTeamId ? teamsById.get(result.winnerTeamId) ?? null : null;

      return {
        ...match,
        stage: match.stageId ? stagesById.get(match.stageId) ?? null : null,
        group: match.groupId ? groupsById.get(match.groupId) ?? null : null,
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
    .filter((match) => !isSmokeTestValue(match.round) && !isSmokeTestValue(match.result?.note) && !isSmokeTestValue(match.result?.scoreSummary))
    .sort((a, b) => `${a.day}T${a.startTime}`.localeCompare(`${b.day}T${b.startTime}`));

  const announcements = [...input.announcements].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );

  return {
    source: input.source ?? "supabase",
    tournament: input.tournament,
    sports: [...input.sports].sort((a, b) => sportOrder.indexOf(a.id) - sportOrder.indexOf(b.id)),
    stages: [...input.stages].sort((a, b) => a.orderIndex - b.orderIndex || a.label.localeCompare(b.label)),
    groups: [...input.groups].sort((a, b) => a.orderIndex - b.orderIndex || a.code.localeCompare(b.code)),
    teams: [...input.teams].sort((a, b) => (a.seed ?? Number.MAX_SAFE_INTEGER) - (b.seed ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name)),
    matches,
    announcements
  };
}
