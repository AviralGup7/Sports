import { Announcement, Match, Sport, SportSlug, Team, Tournament, User } from "@/lib/types";

export const tournament: Tournament = {
  id: "iasl-2026",
  name: "Inter Association Sports League",
  startDate: "2026-04-02",
  endDate: "2026-04-05",
  venue: "Central College Grounds"
};

export const sports: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    color: "#f59e0b",
    rulesSummary: "T20 knockout lanes with quick turnaround between evening fixtures.",
    format: "16 teams, knockout bracket, evening slots"
  },
  {
    id: "football",
    name: "Football",
    color: "#22c55e",
    rulesSummary: "Short-format campus football with rolling substitutions and same-day updates.",
    format: "8 teams, quarter-finals to final"
  },
  {
    id: "volleyball",
    name: "Volleyball",
    color: "#38bdf8",
    rulesSummary: "Best-of-three sets through semis, best-of-five for the championship.",
    format: "8 teams, indoor court rotation"
  },
  {
    id: "athletics",
    name: "Athletics",
    color: "#fb7185",
    rulesSummary: "Heats feed finals automatically once placements are recorded.",
    format: "Track heats plus medal rounds"
  }
];

export const teams: Team[] = [
  { id: "andhra-samithi", name: "Andhra Samithi", association: "A Block", sportIds: ["cricket", "football", "volleyball"], seed: 1 },
  { id: "capitol", name: "Capitol", association: "B Block", sportIds: ["cricket", "football"], seed: 2 },
  { id: "gurjari", name: "Gurjari", association: "C Block", sportIds: ["cricket", "volleyball", "athletics"], seed: 3 },
  { id: "haryana-cultural", name: "Haryana Cultural Association", association: "D Block", sportIds: ["cricket", "athletics"], seed: 4 },
  { id: "punjab-cultural", name: "Punjab Cultural Association", association: "E Block", sportIds: ["cricket", "football", "athletics"], seed: 5 },
  { id: "udgam", name: "Udgam", association: "F Block", sportIds: ["cricket", "volleyball"], seed: 6 },
  { id: "sangam", name: "Sangam", association: "G Block", sportIds: ["football", "volleyball", "athletics"], seed: 7 },
  { id: "kairali", name: "Kairali", association: "H Block", sportIds: ["cricket", "athletics"], seed: 8 },
  { id: "kannada-vedike", name: "Kannada Vedike", association: "I Block", sportIds: ["football", "volleyball"], seed: 9 },
  { id: "pilani-tamil-mandram", name: "Pilani Tamil Mandram", association: "J Block", sportIds: ["football", "volleyball", "athletics"], seed: 10 },
  { id: "madhyansh", name: "Madhyansh", association: "K Block", sportIds: ["cricket", "athletics"], seed: 11 },
  { id: "maurya-vihar", name: "Maurya Vihar", association: "L Block", sportIds: ["cricket", "football"], seed: 12 },
  { id: "marudhara", name: "Marudhara", association: "M Block", sportIds: ["cricket", "volleyball"], seed: 13 },
  { id: "moruchhaya", name: "Moruchhaya", association: "N Block", sportIds: ["cricket", "athletics"], seed: 14 },
  { id: "maharashtra-mandal", name: "Maharashtra Mandal", association: "O Block", sportIds: ["football", "volleyball"], seed: 15 },
  { id: "utkal-samaj", name: "Utkal Samaj", association: "P Block", sportIds: ["cricket", "athletics"], seed: 16 }
];

export const organizers: User[] = [
  {
    id: "user-super-admin",
    name: "Tournament Lead",
    email: "lead@college.edu",
    role: "super_admin",
    sportIds: ["cricket", "football", "volleyball", "athletics"]
  },
  {
    id: "user-cricket-admin",
    name: "Cricket Admin",
    email: "cricket@college.edu",
    role: "sport_admin",
    sportIds: ["cricket"]
  }
];

export const matches: Match[] = [
  {
    id: "cricket-qf-1",
    sportId: "cricket",
    round: "Quarter-Final",
    day: "2026-04-02",
    startTime: "18:00",
    venue: "Main Ground",
    teamAId: "andhra-samithi",
    teamBId: "capitol",
    status: "completed",
    winnerTeamId: "andhra-samithi",
    scoreSummary: "146/6 vs 142/8",
    note: "A tight finish decided in the final over."
  },
  {
    id: "cricket-qf-2",
    sportId: "cricket",
    round: "Quarter-Final",
    day: "2026-04-02",
    startTime: "20:30",
    venue: "Main Ground",
    teamAId: "gurjari",
    teamBId: "haryana-cultural",
    status: "completed",
    winnerTeamId: "gurjari",
    scoreSummary: "151/5 vs 118 all out",
    note: "Gurjari controlled the chase after the powerplay."
  },
  {
    id: "cricket-sf-1",
    sportId: "cricket",
    round: "Semi-Final",
    day: "2026-04-04",
    startTime: "19:00",
    venue: "Main Ground",
    teamAId: "andhra-samithi",
    teamBId: "gurjari",
    status: "scheduled",
    note: "Winner moves into the title match."
  },
  {
    id: "football-qf-1",
    sportId: "football",
    round: "Quarter-Final",
    day: "2026-04-03",
    startTime: "16:00",
    venue: "Football Turf",
    teamAId: "punjab-cultural",
    teamBId: "kannada-vedike",
    status: "completed",
    winnerTeamId: "kannada-vedike",
    scoreSummary: "2 - 1",
    note: "Late counterattack sealed the fixture."
  },
  {
    id: "football-qf-2",
    sportId: "football",
    round: "Quarter-Final",
    day: "2026-04-03",
    startTime: "17:15",
    venue: "Football Turf",
    teamAId: "pilani-tamil-mandram",
    teamBId: "maharashtra-mandal",
    status: "live",
    scoreSummary: "1 - 1",
    note: "Second half in progress."
  },
  {
    id: "football-final",
    sportId: "football",
    round: "Final",
    day: "2026-04-05",
    startTime: "18:30",
    venue: "Football Turf",
    teamAId: "kannada-vedike",
    teamBId: "pilani-tamil-mandram",
    status: "scheduled"
  },
  {
    id: "volleyball-sf-1",
    sportId: "volleyball",
    round: "Semi-Final",
    day: "2026-04-03",
    startTime: "16:30",
    venue: "Indoor Arena",
    teamAId: "udgam",
    teamBId: "sangam",
    status: "completed",
    winnerTeamId: "sangam",
    scoreSummary: "25-19, 18-25, 15-11",
    note: "Sangam recovered after dropping the second set."
  },
  {
    id: "volleyball-sf-2",
    sportId: "volleyball",
    round: "Semi-Final",
    day: "2026-04-03",
    startTime: "18:00",
    venue: "Indoor Arena",
    teamAId: "gurjari",
    teamBId: "marudhara",
    status: "scheduled"
  },
  {
    id: "volleyball-final",
    sportId: "volleyball",
    round: "Final",
    day: "2026-04-05",
    startTime: "17:00",
    venue: "Indoor Arena",
    teamAId: "sangam",
    teamBId: "gurjari",
    status: "scheduled"
  },
  {
    id: "athletics-heat-1",
    sportId: "athletics",
    round: "100m Heat",
    day: "2026-04-03",
    startTime: "16:15",
    venue: "Track Oval",
    teamAId: "punjab-cultural",
    teamBId: "pilani-tamil-mandram",
    status: "completed",
    winnerTeamId: "pilani-tamil-mandram",
    scoreSummary: "11.8s vs 12.1s",
    note: "Top two qualified for the finals pool."
  },
  {
    id: "athletics-heat-2",
    sportId: "athletics",
    round: "100m Heat",
    day: "2026-04-03",
    startTime: "16:30",
    venue: "Track Oval",
    teamAId: "gurjari",
    teamBId: "utkal-samaj",
    status: "completed",
    winnerTeamId: "utkal-samaj",
    scoreSummary: "11.9s vs 12.0s",
    note: "Photo finish separated the field."
  },
  {
    id: "athletics-final",
    sportId: "athletics",
    round: "100m Final",
    day: "2026-04-05",
    startTime: "16:45",
    venue: "Track Oval",
    teamAId: "pilani-tamil-mandram",
    teamBId: "utkal-samaj",
    status: "scheduled"
  }
];

export const announcements: Announcement[] = [
  {
    id: "announce-1",
    title: "Volunteer briefing moved to 3:15 PM",
    body: "All venue volunteers should report at the media desk 15 minutes earlier than planned for access badge pickup.",
    visibility: "public",
    pinned: true,
    publishedAt: "2026-04-02T09:00:00+05:30"
  },
  {
    id: "announce-2",
    title: "Football turf access restricted",
    body: "Only players, coaches, and registered photographers will be allowed near the touchline during knockout fixtures.",
    visibility: "public",
    pinned: false,
    publishedAt: "2026-04-03T12:15:00+05:30"
  },
  {
    id: "announce-3",
    title: "Admin data export check",
    body: "Organizers should verify the evening JSON export after result entry so the backup remains current.",
    visibility: "admin",
    pinned: false,
    publishedAt: "2026-04-03T13:00:00+05:30"
  }
];

export const sportOrder: SportSlug[] = ["cricket", "football", "volleyball", "athletics"];

export function getSportBySlug(slug: string) {
  return sports.find((sport) => sport.id === slug);
}

export function getTeamById(id: string) {
  return teams.find((team) => team.id === id);
}

export function getMatchesForSport(sportId: SportSlug) {
  return matches.filter((match) => match.sportId === sportId);
}

export function getMatchById(id: string) {
  return matches.find((match) => match.id === id);
}

export function getRelatedMatches(match: Match) {
  return matches.filter((item) => item.sportId === match.sportId && item.id !== match.id);
}

export function getVisibleAnnouncements(scope: "public" | "admin" = "public") {
  return announcements
    .filter((announcement) => scope === "admin" || announcement.visibility === "public")
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getScheduleDays() {
  return Array.from(new Set(matches.map((match) => match.day))).sort();
}

export function getScheduleForDay(day: string, sportId?: SportSlug) {
  return matches.filter((match) => match.day === day && (!sportId || match.sportId === sportId));
}

export function getTournamentStats() {
  const completedMatches = matches.filter((match) => match.status === "completed").length;
  return {
    sports: sports.length,
    teams: teams.length,
    matches: matches.length,
    completedMatches,
    announcements: getVisibleAnnouncements("public").length
  };
}

export function formatDateLabel(dateString: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(dateString));
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

export function getStatusTone(status: Match["status"]) {
  if (status === "completed") {
    return "complete";
  }

  if (status === "live") {
    return "live";
  }

  return "scheduled";
}
