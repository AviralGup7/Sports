import type { CompetitionGroup, CompetitionStage, Profile, Sport, SportSlug, Tournament } from "@/domain";

export const tournamentSeed: Tournament = {
  id: "icl-2026",
  name: "Inter-Assoc Cultural Sports League",
  startDate: "2026-04-02",
  endDate: "2026-04-05",
  venue: "GYMG & MedC Grounds",
  logoAssetPath: "/branding/icasl-logo.png",
  contacts: [
    { id: "moksh-goel", name: "Moksh Goel", phone: "+91-9971019074", role: "Tournament Coordinator" },
    { id: "partho-kumar-das", name: "Partho Kumar Das", phone: "+91-7985898426", role: "Operations Coordinator" },
    { id: "aarav-saxena", name: "Aarav Saxena", phone: "+91-9818650379", role: "Venue Coordinator" }
  ]
};

export const sportsSeed: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    color: "#f59e0b",
    rulesSummary: "T20 knockout draw with quarter-finals, semis, a bronze playoff, and the title match on finals day.",
    format: "8 teams, knockout bracket plus bronze"
  },
  {
    id: "football",
    name: "Football",
    color: "#22c55e",
    rulesSummary: "Campus cup knockout with quarter-finals, penalty-aware results, a third-place playoff, and the grand final.",
    format: "8 teams, knockout bracket plus bronze"
  },
  {
    id: "volleyball",
    name: "Volleyball",
    color: "#38bdf8",
    rulesSummary: "Indoor knockout ladder with straight quarter-finals, semis, a bronze match, and the championship decider.",
    format: "8 teams, knockout bracket plus bronze"
  },
  {
    id: "athletics",
    name: "Athletics",
    color: "#fb7185",
    rulesSummary: "Sprint cup knockout with association head-to-head races feeding semis, a bronze race, and the final.",
    format: "8 teams, knockout bracket plus bronze"
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
  { id: "cricket-knockout-stage", sportId: "cricket", type: "knockout", label: "Championship Bracket", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "cricket-placement-stage", sportId: "cricket", type: "placement", label: "Bronze Match", orderIndex: 2, advancesCount: 0, isActive: true },
  { id: "football-knockout-stage", sportId: "football", type: "knockout", label: "Cup Bracket", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "football-placement-stage", sportId: "football", type: "placement", label: "Third Place", orderIndex: 2, advancesCount: 0, isActive: true },
  { id: "volleyball-knockout-stage", sportId: "volleyball", type: "knockout", label: "Championship Ladder", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "volleyball-placement-stage", sportId: "volleyball", type: "placement", label: "Bronze Match", orderIndex: 2, advancesCount: 0, isActive: true },
  { id: "athletics-knockout-stage", sportId: "athletics", type: "knockout", label: "Sprint Bracket", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "athletics-placement-stage", sportId: "athletics", type: "placement", label: "Bronze Race", orderIndex: 2, advancesCount: 0, isActive: true }
];

export const competitionGroupsSeed: CompetitionGroup[] = [];

export const sportOrder: SportSlug[] = ["cricket", "football", "volleyball", "athletics"];
