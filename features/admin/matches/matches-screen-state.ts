import type { AdminMatchesData } from "@/server/data/admin/types";

export type MatchesScreenParams = {
  status?: string;
  message?: string;
  sport?: string;
  day?: string;
  stage?: string;
  statusFilter?: string;
};

export type ResolvedMatchesScreenState = {
  tone: "error" | "success" | "info";
  selectedSport?: string;
  selectedDay?: string;
  selectedStage?: string;
  selectedStatus?: string;
  visibleStages: AdminMatchesData["stages"];
  visibleMatches: AdminMatchesData["matches"];
};

export function resolveMatchesScreenState(data: AdminMatchesData, params: MatchesScreenParams): ResolvedMatchesScreenState {
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";
  const selectedSport = data.sports.find((sport) => sport.id === params.sport)?.id;
  const selectedDay = data.days.includes(params.day ?? "") ? params.day : undefined;
  const selectedStage = data.stages.find((stage) => stage.id === params.stage)?.id;
  const selectedStatus = params.statusFilter;

  const visibleStages = selectedSport ? data.stages.filter((stage) => stage.sportId === selectedSport) : data.stages;
  const visibleMatches = data.matches.filter(
    (match) =>
      (!selectedSport || match.sportId === selectedSport) &&
      (!selectedDay || match.day === selectedDay) &&
      (!selectedStage || match.stageId === selectedStage) &&
      (!selectedStatus || match.status === selectedStatus)
  );

  return {
    tone,
    selectedSport,
    selectedDay,
    selectedStage,
    selectedStatus,
    visibleStages,
    visibleMatches
  };
}
