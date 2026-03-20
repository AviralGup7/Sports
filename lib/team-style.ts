import type { Team } from "@/domain/teams/types";

const TEAM_PALETTE = [
  "#ff7a59",
  "#3ddc97",
  "#38bdf8",
  "#f59e0b",
  "#f472b6",
  "#a78bfa",
  "#22c55e",
  "#fb7185",
  "#60a5fa",
  "#f97316",
  "#14b8a6",
  "#e879f9",
  "#84cc16",
  "#ef4444",
  "#06b6d4",
  "#facc15"
];

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

export function getTeamAccent(team?: Pick<Team, "id" | "name" | "association"> | null) {
  if (!team) {
    return "#9fb6d8";
  }

  const seed = `${team.id}:${team.name}:${team.association}`;
  return TEAM_PALETTE[hashString(seed) % TEAM_PALETTE.length];
}

export function getTeamInitials(team?: Pick<Team, "name"> | null) {
  if (!team?.name) {
    return "TBD";
  }

  return team.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
