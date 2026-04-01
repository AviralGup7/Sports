import type {
  CompetitionGroup,
  CompetitionStage,
  Match
} from "./types";
import type { SportSlug } from "../sports/types";
import type { Team } from "../teams/types";
import { applyWinnerAdvancement } from "./progression";

export type StructureFormat = "knockout" | "group-knockout";

export type GeneratedCompetitionStructure = {
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  matches: Match[];
};

function createMatch(input: Partial<Match> & Pick<Match, "id" | "sportId" | "round" | "day" | "startTime" | "venue">): Match {
  return {
    id: input.id,
    sportId: input.sportId,
    round: input.round,
    day: input.day,
    startTime: input.startTime,
    venue: input.venue,
    stageId: input.stageId ?? null,
    groupId: input.groupId ?? null,
    roundIndex: input.roundIndex ?? 1,
    matchNumber: input.matchNumber ?? 1,
    teamAId: input.teamAId ?? null,
    teamBId: input.teamBId ?? null,
    status: input.status ?? "scheduled",
    winnerToMatchId: input.winnerToMatchId ?? null,
    winnerToSlot: input.winnerToSlot ?? null,
    loserToMatchId: input.loserToMatchId ?? null,
    loserToSlot: input.loserToSlot ?? null,
    nextMatchId: input.nextMatchId ?? input.winnerToMatchId ?? null,
    nextSlot: input.nextSlot ?? input.winnerToSlot ?? null,
    isBye: input.isBye ?? false,
    stage: input.stage ?? null,
    group: input.group ?? null,
    teamA: input.teamA ?? null,
    teamB: input.teamB ?? null,
    result: input.result ?? null
  };
}

function createSerpentineGroups(teams: Team[], groupsCount: number) {
  const buckets = Array.from({ length: groupsCount }, () => [] as Team[]);
  if (buckets.length === 0) {
    return buckets;
  }

  let index = 0;
  let direction = 1;

  for (const team of teams) {
    buckets[index].push(team);

    if (direction === 1 && index === groupsCount - 1) {
      direction = -1;
    } else if (direction === -1 && index === 0) {
      direction = 1;
    } else {
      index += direction;
    }
  }

  return buckets;
}

function buildRoundRobinMatches(sportId: SportSlug, stage: CompetitionStage, groups: CompetitionGroup[], teamBuckets: Team[][]) {
  const matches: Match[] = [];
  const dayCycle = ["2026-04-02", "2026-04-03"];
  const timeCycle = ["09:00", "11:30", "14:00", "16:30", "19:00"];

  groups.forEach((group, groupIndex) => {
    const members = teamBuckets[groupIndex] ?? [];
    let matchNumber = 1;

    for (let teamAIndex = 0; teamAIndex < members.length; teamAIndex += 1) {
      for (let teamBIndex = teamAIndex + 1; teamBIndex < members.length; teamBIndex += 1) {
        const timeIndex = (matchNumber - 1) % timeCycle.length;
        const dayIndex = Math.floor((matchNumber - 1) / timeCycle.length) % dayCycle.length;
        const teamA = members[teamAIndex] ?? null;
        const teamB = members[teamBIndex] ?? null;

        matches.push(
          createMatch({
            id: `${group.id}-match-${matchNumber}`,
            sportId,
            round: `${group.code} Match ${matchNumber}`,
            day: dayCycle[dayIndex],
            startTime: timeCycle[timeIndex],
            venue: `${sportId} Group Court ${groupIndex + 1}`,
            stageId: stage.id,
            groupId: group.id,
            roundIndex: 1,
            matchNumber,
            teamAId: teamA?.id ?? null,
            teamBId: teamB?.id ?? null,
            teamA,
            teamB
          })
        );

        matchNumber += 1;
      }
    }
  });

  return matches;
}

function buildKnockoutMatches(sportId: SportSlug, stage: CompetitionStage, placementStage: CompetitionStage, seededTeams: Team[]) {
  const bracketSize = seededTeams.length > 4 ? 8 : 4;
  const paddedTeams = Array.from({ length: bracketSize }, (_, index) => seededTeams[index] ?? null);
  const openingPairs =
    bracketSize === 8
      ? [
          [paddedTeams[0], paddedTeams[7]],
          [paddedTeams[3], paddedTeams[4]],
          [paddedTeams[1], paddedTeams[6]],
          [paddedTeams[2], paddedTeams[5]]
        ]
      : [
          [paddedTeams[0], paddedTeams[3]],
          [paddedTeams[1], paddedTeams[2]]
        ];

  const openingLabel = bracketSize === 8 ? "Quarter Final" : "Semi Final";
  const openingRoundIndex = 1;
  const semifinalRoundIndex = bracketSize === 8 ? 2 : 1;
  const championshipRoundIndex = bracketSize === 8 ? 3 : 2;
  const openingMatches = openingPairs.map(([teamA, teamB], index) => {
    const winnerTarget = bracketSize === 8 ? (index < 2 ? `${sportId}-generated-sf-1` : `${sportId}-generated-sf-2`) : `${sportId}-generated-final`;
    const winnerSlot = bracketSize === 8 ? (index % 2 === 0 ? "team_a" : "team_b") : index === 0 ? "team_a" : "team_b";
    const isBye = Boolean((teamA && !teamB) || (!teamA && teamB));

    return createMatch({
      id: `${sportId}-generated-${bracketSize === 8 ? "qf" : "sf"}-${index + 1}`,
      sportId,
      round: `${openingLabel} ${index + 1}`,
      day: "2026-04-04",
      startTime: bracketSize === 8 ? `${12 + index * 2}:00` : `${16 + index * 2}:00`,
      venue: `${sportId} Arena`,
      stageId: stage.id,
      roundIndex: openingRoundIndex,
      matchNumber: index + 1,
      teamAId: teamA?.id ?? null,
      teamBId: teamB?.id ?? null,
      teamA,
      teamB,
      status: isBye ? "completed" : "scheduled",
      winnerToMatchId: winnerTarget,
      winnerToSlot: winnerSlot,
      loserToMatchId: bracketSize === 8 ? null : `${sportId}-generated-third`,
      loserToSlot: bracketSize === 8 ? null : index === 0 ? "team_a" : "team_b",
      isBye
    });
  });

  const semifinalMatches =
    bracketSize === 8
      ? [
          createMatch({
            id: `${sportId}-generated-sf-1`,
            sportId,
            round: "Semi Final 1",
            day: "2026-04-05",
            startTime: "16:00",
            venue: `${sportId} Arena`,
            stageId: stage.id,
            roundIndex: semifinalRoundIndex,
            matchNumber: 1,
            winnerToMatchId: `${sportId}-generated-final`,
            winnerToSlot: "team_a",
            loserToMatchId: `${sportId}-generated-third`,
            loserToSlot: "team_a"
          }),
          createMatch({
            id: `${sportId}-generated-sf-2`,
            sportId,
            round: "Semi Final 2",
            day: "2026-04-05",
            startTime: "18:00",
            venue: `${sportId} Arena`,
            stageId: stage.id,
            roundIndex: semifinalRoundIndex,
            matchNumber: 2,
            winnerToMatchId: `${sportId}-generated-final`,
            winnerToSlot: "team_b",
            loserToMatchId: `${sportId}-generated-third`,
            loserToSlot: "team_b"
          })
        ]
      : [];

  const finalMatch = createMatch({
    id: `${sportId}-generated-final`,
    sportId,
    round: "Grand Final",
    day: "2026-04-05",
    startTime: "20:00",
    venue: `${sportId} Arena`,
    stageId: stage.id,
    roundIndex: championshipRoundIndex,
    matchNumber: 1
  });

  const thirdPlaceMatch = createMatch({
    id: `${sportId}-generated-third`,
    sportId,
    round: "Third Place",
    day: "2026-04-05",
    startTime: "14:00",
    venue: `${sportId} Arena`,
    stageId: placementStage.id,
    roundIndex: championshipRoundIndex,
    matchNumber: 1
  });

  return [...openingMatches, ...semifinalMatches, thirdPlaceMatch, finalMatch];
}

function hydrateByeAdvancement(matches: Match[]) {
  let hydrated = [...matches];

  for (const match of hydrated.filter((item) => item.isBye)) {
    const winnerTeam = match.teamA ?? match.teamB ?? null;
    if (!winnerTeam) {
      continue;
    }

    hydrated = applyWinnerAdvancement(hydrated, match.id, winnerTeam, null).map((item) =>
      item.id === match.id
        ? {
            ...item,
            status: "completed",
            result: {
              matchId: match.id,
              winnerTeamId: winnerTeam.id,
              winner: winnerTeam,
              teamAScore: match.teamA ? 1 : 0,
              teamBScore: match.teamB ? 1 : 0,
              decisionType: "walkover",
              scoreSummary: "Bye to next round",
              note: "Auto-advanced through bracket bye.",
              updatedBy: null,
              updatedAt: null
            }
          }
        : item
    );
  }

  return hydrated;
}

export function generateCompetitionStructure(
  teams: Team[],
  sportId: SportSlug,
  options: {
    format: StructureFormat;
    groupsCount?: number;
    knockoutSize?: number;
  }
): GeneratedCompetitionStructure {
  const activeTeams = [...teams]
    .filter((team) => team.sportIds.includes(sportId) && team.isActive)
    .sort((a, b) => (a.seed ?? Number.MAX_SAFE_INTEGER) - (b.seed ?? Number.MAX_SAFE_INTEGER));
  const knockoutSize = Math.min(options.knockoutSize ?? 8, 8);
  const seededTeams = activeTeams.slice(0, knockoutSize);

  const knockoutStage: CompetitionStage = {
    id: `${sportId}-builder-knockout`,
    sportId,
    type: "knockout",
    label: "Generated Knockout",
    orderIndex: options.format === "group-knockout" ? 2 : 1,
    advancesCount: 1,
    isActive: true
  };
  const placementStage: CompetitionStage = {
    id: `${sportId}-builder-placement`,
    sportId,
    type: "placement",
    label: "Generated Third Place",
    orderIndex: options.format === "group-knockout" ? 3 : 2,
    advancesCount: 0,
    isActive: true
  };

  if (options.format === "group-knockout") {
    const groupsCount = Math.max(2, Math.min(options.groupsCount ?? 2, 4));
    const groupStage: CompetitionStage = {
      id: `${sportId}-builder-group`,
      sportId,
      type: "group",
      label: "Generated Groups",
      orderIndex: 1,
      advancesCount: Math.max(1, Math.floor((options.knockoutSize ?? 4) / groupsCount)),
      isActive: true
    };
    const groups = Array.from({ length: groupsCount }, (_, index) => ({
      id: `${sportId}-generated-group-${String.fromCharCode(97 + index)}`,
      stageId: groupStage.id,
      sportId,
      code: `Group ${String.fromCharCode(65 + index)}`,
      orderIndex: index + 1
    }));
    const groupTeamBuckets = createSerpentineGroups(seededTeams, groupsCount);
    const groupMatches = buildRoundRobinMatches(sportId, groupStage, groups, groupTeamBuckets);

    const knockoutMatches = [
      createMatch({
        id: `${sportId}-generated-sf-1`,
        sportId,
        round: "Semi Final 1",
        day: "2026-04-04",
        startTime: "17:00",
        venue: `${sportId} Arena`,
        stageId: knockoutStage.id,
        roundIndex: 2,
        matchNumber: 1,
        winnerToMatchId: `${sportId}-generated-final`,
        winnerToSlot: "team_a",
        loserToMatchId: `${sportId}-generated-third`,
        loserToSlot: "team_a"
      }),
      createMatch({
        id: `${sportId}-generated-sf-2`,
        sportId,
        round: "Semi Final 2",
        day: "2026-04-04",
        startTime: "20:00",
        venue: `${sportId} Arena`,
        stageId: knockoutStage.id,
        roundIndex: 2,
        matchNumber: 2,
        winnerToMatchId: `${sportId}-generated-final`,
        winnerToSlot: "team_b",
        loserToMatchId: `${sportId}-generated-third`,
        loserToSlot: "team_b"
      }),
      createMatch({
        id: `${sportId}-generated-third`,
        sportId,
        round: "Third Place",
        day: "2026-04-05",
        startTime: "15:00",
        venue: `${sportId} Arena`,
        stageId: placementStage.id,
        roundIndex: 3,
        matchNumber: 1
      }),
      createMatch({
        id: `${sportId}-generated-final`,
        sportId,
        round: "Grand Final",
        day: "2026-04-05",
        startTime: "19:00",
        venue: `${sportId} Arena`,
        stageId: knockoutStage.id,
        roundIndex: 3,
        matchNumber: 1
      })
    ];

    return {
      stages: [groupStage, knockoutStage, placementStage],
      groups,
      matches: groupMatches.concat(knockoutMatches)
    };
  }

  return {
    stages: [knockoutStage, placementStage],
    groups: [],
    matches: hydrateByeAdvancement(buildKnockoutMatches(sportId, knockoutStage, placementStage, seededTeams))
  };
}

export function generateKnockoutStructure(teams: Team[], sportId: SportSlug) {
  return generateCompetitionStructure(teams, sportId, { format: "knockout", knockoutSize: 8 }).matches;
}
