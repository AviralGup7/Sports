import Link from "next/link";

import { MatchLineageCard } from "@/lib/types";

type ProgressPathCardProps = {
  card: MatchLineageCard;
};

export function ProgressPathCard({ card }: ProgressPathCardProps) {
  return (
    <article className="detail-card progress-path-card">
      <p className="eyebrow">{card.label}</p>
      <h2>{card.matches.length} linked boards</h2>
      <div className="stack-sm">
        {card.matches.map((match) => (
          <Link key={match.id} href={`/matches/${match.id}`} className="progress-link">
            <strong>{match.round}</strong>
            <span>
              {match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"}
            </span>
          </Link>
        ))}
      </div>
    </article>
  );
}
