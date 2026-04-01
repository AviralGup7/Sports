import type { Team } from "@/domain";

export const teamsSeed: Team[] = [
  { id: "andhra-samithi", name: "Andhra Samithi", association: "Andhra Samithi", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 1, isActive: true },
  { id: "capitol", name: "Capitol", association: "Capitol", sportIds: ["cricket", "football", "athletics"], seed: 2, isActive: true },
  { id: "gurjari", name: "GUJARAT TITANS", association: "Gurjari", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 3, isActive: true },
  { id: "haryana-cultural", name: "HCA", association: "Haryana Cultural Association", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 4, isActive: true },
  { id: "punjab-cultural", name: "PCA", association: "Punjab Cultural Association", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 5, isActive: true },
  { id: "udgam", name: "Ambulance club", association: "Udgam", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 6, isActive: true },
  { id: "sangam", name: "Sangam", association: "Sangam", sportIds: ["athletics"], seed: 7, isActive: true },
  { id: "kairali", name: "Abrahaminde Sandhadhikal", association: "Kairali", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 8, isActive: true },
  { id: "kannada-vedike", name: "Royal Challengers KV", association: "Kannada Vedike", sportIds: ["cricket", "football", "volleyball"], seed: 9, isActive: true },
  { id: "pilani-tamil-mandram", name: "PTM", association: "Pilani Tamil Mandram", sportIds: ["cricket", "football", "athletics"], seed: 10, isActive: true },
  { id: "madhyansh", name: "Tigers of MP", association: "Madhyansh", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 11, isActive: true },
  { id: "maurya-vihar", name: "MV7", association: "Maurya Vihar", sportIds: ["cricket", "athletics"], seed: 12, isActive: true },
  { id: "marudhara", name: "Marudhara", association: "Marudhara", sportIds: ["cricket", "volleyball", "athletics"], seed: 13, isActive: true },
  { id: "moruchhaya", name: "Moruchhaya", association: "Moruchhaya", sportIds: ["cricket"], seed: 14, isActive: true },
  { id: "maharashtra-mandal", name: "Maharashtra Mandal", association: "Maharashtra Mandal", sportIds: ["cricket", "football", "volleyball", "athletics"], seed: 15, isActive: true }
];
