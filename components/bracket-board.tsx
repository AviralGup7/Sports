import { BracketRound } from "@/lib/types";

import { StageBadge } from "./stage-badge";

type BracketBoardProps = {
  rounds: BracketRound[];
};

export function BracketBoard({ rounds }: BracketBoardProps) {
  if (rounds.length === 0) {
    return null;
  }

  return (
    <div className="bracket-board">
      {rounds.map((round) => (
        <section key={round.label} className="bracket-column">
          <div className="bracket-column-head">
            <p className="eyebrow">{round.label}</p>
            <span className="bracket-count">{round.matches.length} fixtures</span>
          </div>
          <div className="stack-sm">
            {round.matches.map((match) => (
              <article key={match.id} className="bracket-card">
                <div className="bracket-team-line">
                  <strong>{match.teamA?.name ?? "TBD"}</strong>
                  {match.result?.winnerTeamId === match.teamAId ? <span className="winner-dot" /> : null}
                </div>
                <div className="bracket-team-line">
                  <span>{match.teamB?.name ?? "TBD"}</span>
                  {match.result?.winnerTeamId === match.teamBId ? <span className="winner-dot" /> : null}
                </div>
                <div className="bracket-meta">
                  <StageBadge status={match.status} label={match.status} />
                  {match.result?.winner ? <small className="muted">Winner: {match.result.winner.name}</small> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
