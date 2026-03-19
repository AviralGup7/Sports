import Link from "next/link";

import type { CompetitionStage } from "@/domain/matches/types";

type StageTimelineProps = {
  stages: CompetitionStage[];
  selectedStageId?: string;
  hrefBuilder: (stageId?: string) => string;
};

export function StageTimeline({ stages, selectedStageId, hrefBuilder }: StageTimelineProps) {
  return (
    <div className="stage-timeline">
      <Link href={hrefBuilder(undefined)} className={!selectedStageId ? "chip chip-active" : "chip"}>
        All stages
      </Link>
      {stages.map((stage) => (
        <Link
          key={stage.id}
          href={hrefBuilder(stage.id)}
          className={selectedStageId === stage.id ? "chip chip-active" : "chip"}
        >
          {stage.label}
        </Link>
      ))}
    </div>
  );
}

