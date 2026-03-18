import { BracketRound } from "@/lib/types";

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
          <p className="eyebrow">{round.label}</p>
          <div className="stack-sm">
            {round.matches.map((match) => (
              <article key={match.id} className="bracket-card">
                <strong>{match.teamA?.name ?? "TBD"}</strong>
                <span>{match.teamB?.name ?? "TBD"}</span>
                <small className="muted">
                  {match.status}
                  {match.result?.winner ? ` · Winner: ${match.result.winner.name}` : ""}
                </small>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
