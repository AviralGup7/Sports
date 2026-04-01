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
    { id: "contact-2", name: "Aarav Sharma", phone: "+91-9876501234", role: "Fixtures" },
    { id: "contact-3", name: "Nisha Verma", phone: "+91-9876505678", role: "Operations" }
  ]
};

export const sportsSeed: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    color: "#f59e0b",
    rulesSummary: "14-team knockout with two byes into the quarter-finals and a venue-tight closeout that still needs one extra cricket slot.",
    format: "14 teams, Round 1 plus quarter-finals, semis, and final"
  },
  {
    id: "football",
    name: "Football",
    color: "#22c55e",
    rulesSummary: "11-team cup bracket with five byes into the quarter-finals and a full finals-night finish that fits the evening plan.",
    format: "11 teams, Round 1 plus quarter-finals, semis, and final"
  },
  {
    id: "volleyball",
    name: "Volleyball",
    color: "#38bdf8",
    rulesSummary: "10-team ladder with six byes into the quarter-finals; the bracket is exact, but three extra court slots or a second court are still required.",
    format: "10 teams, Round 1 plus quarter-finals, semis, and final"
  },
  {
    id: "athletics",
    name: "Athletics",
    color: "#fb7185",
    rulesSummary: "Two heat cards feed an 8-association final round, then top 4, top 2, and the final winner run.",
    format: "14 entries, 2 heats into a three-step final ladder"
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
  { id: "athletics-results-stage", sportId: "athletics", type: "group", label: "Heat and Finals Cards", orderIndex: 1, advancesCount: 0, isActive: true }
];

export const competitionGroupsSeed: CompetitionGroup[] = [];

export const sportOrder: SportSlug[] = ["cricket", "football", "volleyball", "athletics"];
