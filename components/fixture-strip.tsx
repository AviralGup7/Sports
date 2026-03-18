import Link from "next/link";

import { formatDateLabel, formatTimeLabel } from "@/lib/data";
import { Match } from "@/lib/types";

import { StageBadge } from "./stage-badge";

type FixtureStripProps = {
  match: Match;
  showSport?: boolean;
  compact?: boolean;
  admin?: boolean;
};

export function FixtureStrip({ match, showSport = false, compact = false, admin = false }: FixtureStripProps) {
  return (
    <article className={compact ? "fixture-strip fixture-strip-compact" : "fixture-strip"}>
      <div className="fixture-time-block">
        <span>{formatTimeLabel(match.startTime)}</span>
        <small>{formatDateLabel(match.day)}</small>
      </div>

      <div className="fixture-main">
        <div className="fixture-headline">
          <div className="fixture-copy">
            <p className="eyebrow">
              {showSport ? `${match.sportId} | ` : ""}
              {match.round}
            </p>
            <h3>
              {match.teamA?.name ?? "TBD"}
              <span>vs</span>
              {match.teamB?.name ?? "TBD"}
            </h3>
          </div>
          <StageBadge status={match.status} label={match.status} />
        </div>

        <div className="fixture-meta-row">
          <span>{match.venue}</span>
          {match.result?.scoreSummary ? <span>{match.result.scoreSummary}</span> : <span>Awaiting score line</span>}
          {match.result?.winner ? <span>Winner: {match.result.winner.name}</span> : <span>No winner locked</span>}
        </div>

        {match.result?.note ? <p className="fixture-note">{match.result.note}</p> : null}
      </div>

      <div className="fixture-tail">
        <Link href={admin ? "/admin/matches" : `/matches/${match.id}`} className="fixture-link">
          {admin ? "Control match" : "Open board"}
        </Link>
      </div>
    </article>
  );
}
