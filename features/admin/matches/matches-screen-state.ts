import type { AdminMatchesData, BuilderCard, IntegrityIssue } from "@/server/data/admin/types";

export type MatchesScreenParams = {
  status?: string;
  message?: string;
  sport?: string;
  day?: string;
  stage?: string;
  mode?: string;
  statusFilter?: string;
};

export type MatchesScreenMode = "builder" | "live" | "tree";

export type ResolvedMatchesScreenState = {
  tone: "error" | "success" | "info";
  mode: MatchesScreenMode;
  selectedSport?: string;
  selectedDay?: string;
  selectedStage?: string;
  selectedStatus?: string;
  visibleStages: AdminMatchesData["stages"];
  visibleMatches: AdminMatchesData["matches"];
  visibleBuilderCards: BuilderCard[];
  visibleIntegrityIssues: IntegrityIssue[];
};

export function resolveMatchesScreenState(data: AdminMatchesData, params: MatchesScreenParams): ResolvedMatchesScreenState {
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";
  const mode: MatchesScreenMode = params.mode === "builder" || params.mode === "tree" ? params.mode : "live";
  const selectedSport = data.sports.find((sport) => sport.id === params.sport)?.id;
  const selectedDay = data.days.includes(params.day ?? "") ? params.day : undefined;
  const selectedStage = data.stages.find((stage) => stage.id === params.stage)?.id;
  const selectedStatus = params.statusFilter;

  const visibleStages = selectedSport ? data.stages.filter((stage) => stage.sportId === selectedSport) : data.stages;

  const visibleMatches =
    mode === "live"
      ? data.matches.filter(
          (match) =>
            (!selectedSport || match.sportId === selectedSport) &&
            (!selectedDay || match.day === selectedDay) &&
            (!selectedStage || match.stageId === selectedStage) &&
            (!selectedStatus || match.status === selectedStatus)
        )
      : [];

  const visibleBuilderCards =
    mode === "builder" || mode === "tree"
      ? (selectedSport ? data.builderCards.filter((card) => card.sport.id === selectedSport) : data.builderCards)
      : [];

  const visibleIntegrityIssues =
    mode === "builder" || mode === "tree"
      ? selectedSport
        ? data.integrityIssues.filter((issue) => data.matches.some((match) => match.id === issue.matchId && match.sportId === selectedSport))
        : data.integrityIssues
      : [];

  return {
    tone,
    mode,
    selectedSport,
    selectedDay,
    selectedStage,
    selectedStatus,
    visibleStages,
    visibleMatches,
    visibleBuilderCards,
    visibleIntegrityIssues
  };
}
