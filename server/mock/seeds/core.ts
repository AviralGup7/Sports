import type { CompetitionGroup, CompetitionStage, Profile, Sport, SportSlug, Tournament } from "@/domain";

export const tournamentSeed: Tournament = {
  id: "icl-2026",
  name: "Inter-Assoc Cultural Sports League",
  startDate: "2026-04-02",
  endDate: "2026-04-05",
  venue: "GYMG & MedC Grounds",
  logoAssetPath: "/branding/icasl-logo.png",
  contacts: [
    { id: "contact-1", name: "Moksh Goel", phone: "+91-9876543210", role: "Tournament Lead" },
    { id: "contact-2", name: "Aarav Saxena", phone: "+91-9876501234", role: "Fixtures" },
    { id: "contact-3", name: "Partho Kumar Das", phone: "+91-9876505678", role: "Operations" }
  ]
};

export const sportsSeed: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    color: "#f59e0b",
    rulesSummary: "14-team knockout across 2 April to 5 April. Opening day uses 90-minute slots, then the bracket rolls through 105-minute matches with short buffers.",
    format: "15 teams, knockout bracket"
  },
  {
    id: "football",
    name: "Football",
    color: "#22c55e",
    rulesSummary: "11-team knockout scheduled inside the 8 PM to midnight window from 3 April to 5 April with 45-minute matches and rolling buffers.",
    format: "12 teams, knockout bracket"
  },
  {
    id: "volleyball",
    name: "Volleyball",
    color: "#38bdf8",
    rulesSummary: "10-team knockout using one court and one live volleyball match at a time from 3 April to 5 April.",
    format: "11 teams, knockout bracket"
  },
  {
    id: "athletics",
    name: "Athletics",
    color: "#fb7185",
    rulesSummary: "Athletics runs as elimination races between 6 PM and 8 PM from 3 April to 5 April, with at most 8 associations in one run and the top half advancing each round.",
    format: "13 associations, elimination runs"
  }
];

export const profilesSeed: Profile[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Tournament Lead",
    email: "lead@college.edu",
    role: "super_admin",
    sportIds: ["cricket", "football", "volleyball", "athletics"]
  }
];

export const competitionStagesSeed: CompetitionStage[] = [
  { id: "cricket-knockout-stage", sportId: "cricket", type: "knockout", label: "Knockout Bracket", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "football-knockout-stage", sportId: "football", type: "knockout", label: "Cup Bracket", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "volleyball-knockout-stage", sportId: "volleyball", type: "knockout", label: "Championship Ladder", orderIndex: 1, advancesCount: 1, isActive: true },
  { id: "athletics-results-stage", sportId: "athletics", type: "knockout", label: "Elimination Runs", orderIndex: 1, advancesCount: 1, isActive: true }
];

export const competitionGroupsSeed: CompetitionGroup[] = [];

export const sportOrder: SportSlug[] = ["cricket", "football", "volleyball", "athletics"];
