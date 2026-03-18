import Link from "next/link";

import { formatDateLabel, getStatusTone } from "@/lib/data";
import { Match } from "@/lib/types";

type MatchCardProps = {
  match: Match;
  showSport?: boolean;
};

export function MatchCard({ match, showSport = false }: MatchCardProps) {
  const winner = match.result?.winner;
  const tone = getStatusTone(match.status);

  return (
    <article className="match-card">
      <div className="match-head">
        <div>
          <p className="eyebrow">
            {showSport ? `${match.sportId} · ` : ""}
            {match.round}
          </p>
          <h3>{match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"}</h3>
        </div>
        <span className={`status-badge status-${tone}`}>{match.status}</span>
      </div>

      <dl className="meta-grid">
        <div>
          <dt>When</dt>
          <dd>{formatDateLabel(match.day)} · {match.startTime}</dd>
        </div>
        <div>
          <dt>Venue</dt>
          <dd>{match.venue}</dd>
        </div>
      </dl>

      {match.result?.scoreSummary ? <p className="match-score">{match.result.scoreSummary}</p> : null}
      {winner ? <p className="muted">Winner: <strong>{winner.name}</strong></p> : null}
      {match.result?.note ? <p className="muted">{match.result.note}</p> : null}

      <Link href={`/matches/${match.id}`} className="inline-link">
        View match details
      </Link>
    </article>
  );
}
