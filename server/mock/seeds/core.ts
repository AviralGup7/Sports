import type { CompetitionGroup, CompetitionStage, Profile, Sport, SportSlug, Tournament } from "@/domain";

export const tournamentSeed: Tournament = {
  id: "iasl-2026",
  name: "Inter Association Sports League",
  startDate: "2026-04-02",
  endDate: "2026-04-05",
  venue: "Central College Grounds"
};

export const sportsSeed: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    color: "#f59e0b",
    rulesSummary: "T20 pool play narrows into knockout nights with a third-place board and seeded crossovers.",
    format: "8 teams, 2 groups, knockout plus bronze"
  },
  {
    id: "football",
    name: "Football",
    color: "#22c55e",
    rulesSummary: "Campus cup knockout with a third-place playoff and explicit penalty/late-change result handling.",
    format: "8 teams, knockout plus bronze"
  },
  {
    id: "volleyball",
    name: "Volleyball",
    color: "#38bdf8",
    rulesSummary: "Indoor bracket with byes, compact quarter-finals, and a live finals path.",
    format: "7 teams, bye-aware knockout plus bronze"
  },
  {
    id: "athletics",
    name: "Athletics",
    color: "#fb7185",
    rulesSummary: "Association result cards for heats and medal rounds, kept separate from bracket generation.",
    format: "Track heats plus medal rounds"
  }
];

export const profilesSeed: Profile[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Tournament Lead",
    email: "lead@college.edu",
    role: "super_admin",
    sportIds: ["cricket", "football", "volleyball", "athletics"]
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Cricket Admin",
    email: "cricket@college.edu",
    role: "sport_admin",
    sportIds: ["cricket"]
  }
];

export const competitionStagesSeed: CompetitionStage[] = [
  { id: "cricket-group-stage", sportId: "cricket", type: "group", label: "Pool Stage", orderIndex: 1, advancesCount: 2, isActive: true },
  { id: "cricket-knockout-stage", sportId: "cricket", type: "knockout", label: "Championship Bracket", orderIndex: 2, advancesCount: 1, isActive: true },
  { id: "cricket-placement-stage", sportId: "cricket", type: "placement", label: "Bronze Match", orderIndex: 3, advancesCount: 0, isActive: true },
  { id: "football-knockout-stage", sportId: "football", type: "knockout", label: "Cup Bracket", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "football-placement-stage", sportId: "football", type: "placement", label: "Third Place", orderIndex: 2, advancesCount: 0, isActive: true },
  { id: "volleyball-knockout-stage", sportId: "volleyball", type: "knockout", label: "Championship Ladder", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "volleyball-placement-stage", sportId: "volleyball", type: "placement", label: "Bronze Match", orderIndex: 2, advancesCount: 0, isActive: true },
  { id: "athletics-results-stage", sportId: "athletics", type: "group", label: "Results Cards", orderIndex: 1, advancesCount: 0, isActive: true }
];

export const competitionGroupsSeed: CompetitionGroup[] = [
  { id: "cricket-group-a", stageId: "cricket-group-stage", sportId: "cricket", code: "Group A", orderIndex: 1 },
  { id: "cricket-group-b", stageId: "cricket-group-stage", sportId: "cricket", code: "Group B", orderIndex: 2 }
];

export const sportOrder: SportSlug[] = ["cricket", "football", "volleyball", "athletics"];
