import { Announcement, Match, MatchResult, Profile, Sport, SportSlug, Team, Tournament } from "@/lib/types";

export const tournamentSeed: Tournament = {
  id: "iasl-2026",
  name: "Inter Association Sports League",
  startDate: "2026-04-02",
  endDate: "2026-04-05",
  venue: "Central College Grounds"
};

export const sportsSeed: Sport[] = [
  { id: "cricket", name: "Cricket", color: "#f59e0b", rulesSummary: "T20 knockout lanes with quick turnaround between evening fixtures.", format: "16 teams, knockout bracket, evening slots" },
  { id: "football", name: "Football", color: "#22c55e", rulesSummary: "Short-format campus football with rolling substitutions and same-day updates.", format: "8 teams, knockout to final" },
  { id: "volleyball", name: "Volleyball", color: "#38bdf8", rulesSummary: "Best-of-three sets through semis, best-of-five for the championship.", format: "8 teams, indoor court rotation" },
  { id: "athletics", name: "Athletics", color: "#fb7185", rulesSummary: "Association-level heats feed finals after results are entered.", format: "Track heats plus medal rounds" }
];

export const teamsSeed: Team[] = [
  { id: "andhra-samithi", name: "Andhra Samithi", association: "A Block", sportIds: ["cricket", "football", "volleyball"], seed: 1, isActive: true },
  { id: "capitol", name: "Capitol", association: "B Block", sportIds: ["cricket", "football"], seed: 2, isActive: true },
  { id: "gurjari", name: "Gurjari", association: "C Block", sportIds: ["cricket", "volleyball", "athletics"], seed: 3, isActive: true },
  { id: "haryana-cultural", name: "Haryana Cultural Association", association: "D Block", sportIds: ["cricket", "athletics"], seed: 4, isActive: true },
  { id: "punjab-cultural", name: "Punjab Cultural Association", association: "E Block", sportIds: ["cricket", "football", "athletics"], seed: 5, isActive: true },
  { id: "udgam", name: "Udgam", association: "F Block", sportIds: ["cricket", "volleyball"], seed: 6, isActive: true },
  { id: "sangam", name: "Sangam", association: "G Block", sportIds: ["football", "volleyball", "athletics"], seed: 7, isActive: true },
  { id: "kairali", name: "Kairali", association: "H Block", sportIds: ["cricket", "athletics"], seed: 8, isActive: true },
  { id: "kannada-vedike", name: "Kannada Vedike", association: "I Block", sportIds: ["football", "volleyball"], seed: 9, isActive: true },
  { id: "pilani-tamil-mandram", name: "Pilani Tamil Mandram", association: "J Block", sportIds: ["football", "volleyball", "athletics"], seed: 10, isActive: true },
  { id: "madhyansh", name: "Madhyansh", association: "K Block", sportIds: ["cricket", "athletics"], seed: 11, isActive: true },
  { id: "maurya-vihar", name: "Maurya Vihar", association: "L Block", sportIds: ["cricket", "football"], seed: 12, isActive: true },
  { id: "marudhara", name: "Marudhara", association: "M Block", sportIds: ["cricket", "volleyball"], seed: 13, isActive: true },
  { id: "moruchhaya", name: "Moruchhaya", association: "N Block", sportIds: ["cricket", "athletics"], seed: 14, isActive: true },
  { id: "maharashtra-mandal", name: "Maharashtra Mandal", association: "O Block", sportIds: ["football", "volleyball"], seed: 15, isActive: true },
  { id: "utkal-samaj", name: "Utkal Samaj", association: "P Block", sportIds: ["cricket", "athletics"], seed: 16, isActive: true }
];

export const profilesSeed: Profile[] = [
  { id: "00000000-0000-0000-0000-000000000001", name: "Tournament Lead", email: "lead@college.edu", role: "super_admin", sportIds: ["cricket", "football", "volleyball", "athletics"] },
  { id: "00000000-0000-0000-0000-000000000002", name: "Cricket Admin", email: "cricket@college.edu", role: "sport_admin", sportIds: ["cricket"] }
];

export const matchesSeed: Match[] = [
  { id: "cricket-qf-1", sportId: "cricket", round: "Quarter-Final", day: "2026-04-02", startTime: "18:00", venue: "Main Ground", teamAId: "andhra-samithi", teamBId: "capitol", status: "completed", nextMatchId: "cricket-sf-1", nextSlot: "team_a" },
  { id: "cricket-qf-2", sportId: "cricket", round: "Quarter-Final", day: "2026-04-02", startTime: "20:30", venue: "Main Ground", teamAId: "gurjari", teamBId: "haryana-cultural", status: "completed", nextMatchId: "cricket-sf-1", nextSlot: "team_b" },
  { id: "cricket-sf-1", sportId: "cricket", round: "Semi-Final", day: "2026-04-04", startTime: "19:00", venue: "Main Ground", teamAId: "andhra-samithi", teamBId: "gurjari", status: "scheduled", nextMatchId: "cricket-final", nextSlot: "team_a" },
  { id: "cricket-final", sportId: "cricket", round: "Final", day: "2026-04-05", startTime: "21:00", venue: "Main Ground", teamAId: null, teamBId: null, status: "scheduled", nextMatchId: null, nextSlot: null },
  { id: "football-qf-1", sportId: "football", round: "Quarter-Final", day: "2026-04-03", startTime: "16:00", venue: "Football Turf", teamAId: "punjab-cultural", teamBId: "kannada-vedike", status: "completed", nextMatchId: "football-final", nextSlot: "team_a" },
  { id: "football-qf-2", sportId: "football", round: "Quarter-Final", day: "2026-04-03", startTime: "17:15", venue: "Football Turf", teamAId: "pilani-tamil-mandram", teamBId: "maharashtra-mandal", status: "live", nextMatchId: "football-final", nextSlot: "team_b" },
  { id: "football-final", sportId: "football", round: "Final", day: "2026-04-05", startTime: "18:30", venue: "Football Turf", teamAId: "kannada-vedike", teamBId: null, status: "scheduled", nextMatchId: null, nextSlot: null },
  { id: "volleyball-sf-1", sportId: "volleyball", round: "Semi-Final", day: "2026-04-03", startTime: "16:30", venue: "Indoor Arena", teamAId: "udgam", teamBId: "sangam", status: "completed", nextMatchId: "volleyball-final", nextSlot: "team_a" },
  { id: "volleyball-sf-2", sportId: "volleyball", round: "Semi-Final", day: "2026-04-03", startTime: "18:00", venue: "Indoor Arena", teamAId: "gurjari", teamBId: "marudhara", status: "scheduled", nextMatchId: "volleyball-final", nextSlot: "team_b" },
  { id: "volleyball-final", sportId: "volleyball", round: "Final", day: "2026-04-05", startTime: "17:00", venue: "Indoor Arena", teamAId: "sangam", teamBId: null, status: "scheduled", nextMatchId: null, nextSlot: null },
  { id: "athletics-heat-1", sportId: "athletics", round: "100m Heat", day: "2026-04-03", startTime: "16:15", venue: "Track Oval", teamAId: "punjab-cultural", teamBId: "pilani-tamil-mandram", status: "completed", nextMatchId: "athletics-final", nextSlot: "team_a" },
  { id: "athletics-heat-2", sportId: "athletics", round: "100m Heat", day: "2026-04-03", startTime: "16:30", venue: "Track Oval", teamAId: "gurjari", teamBId: "utkal-samaj", status: "completed", nextMatchId: "athletics-final", nextSlot: "team_b" },
  { id: "athletics-final", sportId: "athletics", round: "100m Final", day: "2026-04-05", startTime: "16:45", venue: "Track Oval", teamAId: "pilani-tamil-mandram", teamBId: "utkal-samaj", status: "scheduled", nextMatchId: null, nextSlot: null }
];

export const resultsSeed: MatchResult[] = [
  { matchId: "cricket-qf-1", winnerTeamId: "andhra-samithi", scoreSummary: "146/6 vs 142/8", note: "A tight finish decided in the final over.", updatedBy: profilesSeed[0].id, updatedAt: "2026-04-02T21:40:00+05:30" },
  { matchId: "cricket-qf-2", winnerTeamId: "gurjari", scoreSummary: "151/5 vs 118 all out", note: "Gurjari controlled the chase after the powerplay.", updatedBy: profilesSeed[0].id, updatedAt: "2026-04-02T23:10:00+05:30" },
  { matchId: "football-qf-1", winnerTeamId: "kannada-vedike", scoreSummary: "2 - 1", note: "Late counterattack sealed the fixture.", updatedBy: profilesSeed[0].id, updatedAt: "2026-04-03T17:00:00+05:30" },
  { matchId: "football-qf-2", winnerTeamId: null, scoreSummary: "1 - 1", note: "Second half in progress.", updatedBy: profilesSeed[0].id, updatedAt: "2026-04-03T17:40:00+05:30" },
  { matchId: "volleyball-sf-1", winnerTeamId: "sangam", scoreSummary: "25-19, 18-25, 15-11", note: "Sangam recovered after dropping the second set.", updatedBy: profilesSeed[0].id, updatedAt: "2026-04-03T18:10:00+05:30" },
  { matchId: "athletics-heat-1", winnerTeamId: "pilani-tamil-mandram", scoreSummary: "11.8s vs 12.1s", note: "Top two qualified for the finals pool.", updatedBy: profilesSeed[0].id, updatedAt: "2026-04-03T16:20:00+05:30" },
  { matchId: "athletics-heat-2", winnerTeamId: "utkal-samaj", scoreSummary: "11.9s vs 12.0s", note: "Photo finish separated the field.", updatedBy: profilesSeed[0].id, updatedAt: "2026-04-03T16:35:00+05:30" }
];

export const announcementsSeed: Announcement[] = [
  { id: "announce-1", title: "Volunteer briefing moved to 3:15 PM", body: "All venue volunteers should report at the media desk 15 minutes earlier than planned for access badge pickup.", visibility: "public", pinned: true, publishedAt: "2026-04-02T09:00:00+05:30", isPublished: true },
  { id: "announce-2", title: "Football turf access restricted", body: "Only players, coaches, and registered photographers will be allowed near the touchline during knockout fixtures.", visibility: "public", pinned: false, publishedAt: "2026-04-03T12:15:00+05:30", isPublished: true },
  { id: "announce-3", title: "Admin data export check", body: "Organizers should verify the evening JSON export after result entry so the backup remains current.", visibility: "admin", pinned: false, publishedAt: "2026-04-03T13:00:00+05:30", isPublished: true }
];

export const sportOrder: SportSlug[] = ["cricket", "football", "volleyball", "athletics"];
