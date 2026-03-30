import { CSSProperties } from "react";
import Link from "next/link";

import { formatDateLabel, formatStatusLabel, formatTimeLabel } from "@/server/data/formatters";
import type { Match } from "@/domain/matches/types";
import { getTeamAccent, getTeamInitials } from "@/lib/team-style";

import { ShareMatchButton } from "./share-match-button";
import { StageBadge } from "./stage-badge";

type FixtureStripProps = {
  match: Match;
  showSport?: boolean;
  compact?: boolean;
  admin?: boolean;
  emphasizeTeamSpacing?: boolean;
};

export function FixtureStrip({ match, showSport = false, compact = false, admin = false, emphasizeTeamSpacing = false }: FixtureStripProps) {
  const sportLabel = match.sportId.charAt(0).toUpperCase() + match.sportId.slice(1);
  const teamAAccent = getTeamAccent(match.teamA);
  const teamBAccent = getTeamAccent(match.teamB);

  return (
    <article className={compact ? "fixture-strip fixture-strip-compact" : "fixture-strip"}>
      <div className="fixture-strip-glow" aria-hidden="true" />
      <div className="fixture-time-block">
        <span>{formatTimeLabel(match.startTime)}</span>
        <small>{formatDateLabel(match.day)}</small>
      </div>

      <div className="fixture-main">
        <div className="fixture-headline">
          <div className="fixture-copy">
            <p className="eyebrow">
              {showSport ? `${sportLabel} | ` : ""}
              {match.stage?.label ?? match.round}
            </p>
            <h3 className="fixture-teamline">
              <span
                className={emphasizeTeamSpacing ? "fixture-team-name fixture-team-name-spaced" : "fixture-team-name"}
                style={{ "--team-accent": teamAAccent } as CSSProperties}
              >
                <i className="fixture-team-badge" aria-hidden="true">
                  {getTeamInitials(match.teamA)}
                </i>
                <b>{match.teamA?.name ?? "TBD"}</b>
              </span>
              <span>vs</span>
              <span
                className={emphasizeTeamSpacing ? "fixture-team-name fixture-team-name-spaced" : "fixture-team-name"}
                style={{ "--team-accent": teamBAccent } as CSSProperties}
              >
                <i className="fixture-team-badge" aria-hidden="true">
                  {getTeamInitials(match.teamB)}
                </i>
                <b>{match.teamB?.name ?? "TBD"}</b>
              </span>
            </h3>
          </div>
          <StageBadge status={match.status} label={formatStatusLabel(match.status)} />
        </div>

        <div className="fixture-meta-row">
          <span>{match.venue}</span>
          <span>{match.round}</span>
          {match.result?.scoreSummary ? <span>{match.result.scoreSummary}</span> : <span>Result Pending</span>}
          {match.result?.winner ? <span>Winner: {match.result.winner.name}</span> : match.isBye ? <span>Bye</span> : <span>TBD</span>}
        </div>

        {match.result?.note ? <p className="fixture-note">{match.result.note}</p> : null}
      </div>

      <div className="fixture-tail">
        <span className="fixture-tail-line">{match.status === "live" ? "LIVE" : match.status === "completed" ? "Result In" : match.status === "postponed" ? "Postponed" : "Coming Up"}</span>
        <div className="fixture-actions">
          <Link href={admin ? "/admin/matches" : `/matches/${match.id}`} className="fixture-link">
            {admin ? "Control match" : "Match Details"}
          </Link>
          {!admin ? <ShareMatchButton href={`/matches/${match.id}`} title={`${match.teamA?.name ?? "TBD"} vs ${match.teamB?.name ?? "TBD"}`} compact /> : null}
        </div>
      </div>
    </article>
  );
}

