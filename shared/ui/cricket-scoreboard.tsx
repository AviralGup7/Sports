import type { Match } from "@/domain/matches/types";
import { getCricketScoreboardEntries } from "@/lib/cricket-score";

type CricketScoreboardProps = {
  match: Match;
  compact?: boolean;
};

export function CricketScoreboard({ match, compact = false }: CricketScoreboardProps) {
  const lines = getCricketScoreboardEntries(match);

  return (
    <div className={compact ? "cricket-scoreboard cricket-scoreboard-compact" : "cricket-scoreboard"}>
      {lines.map(({ teamName, line }) => (
        <section key={`${match.id}-${teamName}`} className="cricket-scoreboard-team">
          <strong className="cricket-scoreboard-name">{teamName}</strong>
          <div className="cricket-scoreboard-metrics" aria-label={`${teamName} cricket score`}>
            <div className="cricket-scoreboard-metric">
              <span className="cricket-scoreboard-label">Runs</span>
              <strong className="cricket-scoreboard-value">{line.runs}</strong>
            </div>
            <div className="cricket-scoreboard-metric">
              <span className="cricket-scoreboard-label">Wkts</span>
              <strong className="cricket-scoreboard-value">{line.wickets}</strong>
            </div>
            <div className="cricket-scoreboard-metric">
              <span className="cricket-scoreboard-label">Overs</span>
              <strong className="cricket-scoreboard-value">{line.overs}</strong>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
