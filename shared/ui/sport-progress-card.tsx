import Link from "next/link";

import type { SportProgressCard as SportProgressCardData } from "@/server/data/public/types";

type SportProgressCardProps = {
  card: SportProgressCardData;
  compact?: boolean;
};

export function SportProgressCard({ card, compact = false }: SportProgressCardProps) {
  return (
    <Link href={card.href} className={compact ? "sport-progress-card sport-progress-card-compact" : "sport-progress-card"}>
      <div className="sport-progress-head">
        <div>
          <p className="eyebrow">{card.activeStageLabel}</p>
          <h3>{card.sport.name}</h3>
        </div>
        <strong>{card.completionPercent}%</strong>
      </div>
      <div className="progress-bar-wrap" aria-hidden="true">
        <div className="progress-bar-label">
          <span>
            {card.completedMatches}/{card.totalMatches} locked
          </span>
          <span>{card.liveMatches} live</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${card.completionPercent}%` }} />
        </div>
      </div>
      <div className="sport-progress-meta">
        <span>{card.pendingMatches} pending</span>
        <span>{card.finalsPending} finals pending</span>
      </div>
      <p>{card.note}</p>
    </Link>
  );
}
