import Link from "next/link";

import type { BracketPreviewCard as BracketPreviewCardData } from "@/server/data/public/types";

type BracketPreviewCardProps = {
  card: BracketPreviewCardData;
};

export function BracketPreviewCard({ card }: BracketPreviewCardProps) {
  return (
    <Link href={card.href} className="bracket-preview-card">
      <div className="bracket-preview-head">
        <div>
          <p className="eyebrow">{card.stageLabel}</p>
          <h3>{card.sport.name}</h3>
        </div>
        <span className="pill">Preview</span>
      </div>
      <div className="bracket-preview-grid">
        {card.rounds.map((round) => (
          <div key={`${card.sport.id}-${round.label}`} className="bracket-preview-col">
            <span>{round.label}</span>
            <strong>
              {round.filled}/{round.total}
            </strong>
          </div>
        ))}
      </div>
      <p className="bracket-preview-champion">
        <span>Champion</span>
        <strong>{card.championLabel}</strong>
      </p>
    </Link>
  );
}
