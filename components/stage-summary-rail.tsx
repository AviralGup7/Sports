import { StageSummary } from "@/lib/types";

type StageSummaryRailProps = {
  summaries: StageSummary[];
};

export function StageSummaryRail({ summaries }: StageSummaryRailProps) {
  if (summaries.length === 0) {
    return null;
  }

  return (
    <div className="stage-summary-rail">
      {summaries.map((summary) => (
        <article key={summary.stage.id} className="stage-summary-card">
          <p className="eyebrow">
            {summary.stage.type} | {summary.stage.label}
          </p>
          <strong>{summary.completedMatches}/{summary.totalMatches}</strong>
          <span>{summary.liveMatches > 0 ? `${summary.liveMatches} live` : `${summary.pendingMatches} pending`}</span>
        </article>
      ))}
    </div>
  );
}
