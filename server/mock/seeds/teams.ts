import type { Team } from "@/domain";

// Tentative regional association labels. Update this seed as participating associations are finalized.
export const teamsSeed: Team[] = [
  { id: "andhra-samithi", name: "Andhra Samiti", association: "AP & TG", sportIds: ["cricket", "football", "volleyball"], seed: 1, isActive: true },
  { id: "capitol", name: "Capitol", association: "Delhi", sportIds: ["cricket", "football"], seed: 2, isActive: true },
  { id: "gurjari", name: "Gurjari", association: "Gujarat", sportIds: ["cricket", "volleyball", "athletics"], seed: 3, isActive: true },
  { id: "haryana-cultural", name: "Haryana Cultural Association", association: "Haryana", sportIds: ["cricket", "athletics"], seed: 4, isActive: true },
  { id: "punjab-cultural", name: "Punjab Cultural Association", association: "Punjab", sportIds: ["cricket", "football", "athletics"], seed: 5, isActive: true },
  { id: "udgam", name: "Udgam", association: "JK, HP, UK", sportIds: ["cricket", "volleyball"], seed: 6, isActive: true },
  { id: "sangam", name: "Sangam", association: "UP", sportIds: ["football", "volleyball", "athletics"], seed: 7, isActive: true },
  { id: "kairali", name: "Kairali", association: "Kerala", sportIds: ["cricket", "athletics"], seed: 8, isActive: true },
  { id: "kannada-vedike", name: "Kannada Vedike", association: "Karnataka", sportIds: ["football", "volleyball"], seed: 9, isActive: true },
  { id: "pilani-tamil-mandram", name: "Pilani Tamil Mandram", association: "Tamil Nadu", sportIds: ["football", "volleyball", "athletics"], seed: 10, isActive: true },
  { id: "madhyansh", name: "Madhyansh", association: "MP & CG", sportIds: ["cricket", "athletics"], seed: 11, isActive: true },
  { id: "maurya-vihar", name: "Maurya Vihar", association: "Bihar & Jharkhand", sportIds: ["cricket", "football"], seed: 12, isActive: true },
  { id: "marudhara", name: "Marudhara", association: "RJ", sportIds: ["cricket", "volleyball"], seed: 13, isActive: true },
  { id: "moruchhaya", name: "Moruchhaya", association: "Bengal", sportIds: ["cricket", "athletics"], seed: 14, isActive: true },
  { id: "maharashtra-mandal", name: "Maharashtra Mandal", association: "Maharashtra", sportIds: ["football", "volleyball"], seed: 15, isActive: true },
  { id: "utkal-samaj", name: "Utkal Samaj", association: "Odisha", sportIds: ["cricket", "athletics"], seed: 16, isActive: true }
];
