import type { StageSummary } from "@/server/data/public/types";

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
          <div className="stage-summary-card-top">
            <p className="eyebrow">
              {summary.stage.type} | {summary.stage.label}
            </p>
            <span className={`stage-summary-chip ${summary.liveMatches > 0 ? "stage-summary-chip-live" : ""}`}>
              {summary.liveMatches > 0 ? `${summary.liveMatches} live` : `${summary.pendingMatches} pending`}
            </span>
          </div>
          <strong>{summary.completedMatches}/{summary.totalMatches}</strong>
          <span>{summary.groups.length > 0 ? `${summary.groups.length} groups active` : "Direct elimination lane"}</span>
          <div className="stage-summary-bar" aria-hidden="true">
            <span style={{ width: `${summary.totalMatches > 0 ? (summary.completedMatches / summary.totalMatches) * 100 : 0}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

