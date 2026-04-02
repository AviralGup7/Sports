import type { Match } from "@/domain/matches/types";
import type { Team } from "@/domain/teams/types";
import { getCricketScoreboardEntries } from "@/lib/cricket-score";
import { getMatchDisplayLabel, supportsLiveScoring } from "@/server/data/formatters";
import { FormCluster, SubmitButton } from "@/shared/ui";

type AdminMatchOpsCardProps = {
  match: Match;
  teams: Team[];
  resultAction: (formData: FormData) => void | Promise<void>;
};

function formatDecisionLabel(decisionType: string | null | undefined) {
  if (!decisionType) {
    return "Normal";
  }

  return decisionType.charAt(0).toUpperCase() + decisionType.slice(1);
}

export function AdminMatchOpsCard({ match, teams, resultAction }: AdminMatchOpsCardProps) {
  const allowedTeams = teams.filter((team) => team.sportIds.includes(match.sportId));
  const winnerOptions = allowedTeams.filter((team) => team.id === match.teamAId || team.id === match.teamBId);
  const stateLabel = getMatchDisplayLabel(match);
  const cricketLiveScoring = supportsLiveScoring(match.sportId);
  const cricketEntries = getCricketScoreboardEntries(match);
  const scoreLine =
    cricketLiveScoring
      ? match.result?.scoreSummary ?? "0/0 (0.0 ov) vs 0/0 (0.0 ov)"
      : match.result?.teamAScore !== null && match.result?.teamAScore !== undefined && match.result?.teamBScore !== null && match.result?.teamBScore !== undefined
      ? `${match.result.teamAScore} - ${match.result.teamBScore}`
      : "No score saved";

  return (
    <section className="match-ops-card">
      <div className="match-ops-head">
        <div>
          <p className="eyebrow">
            {match.sportId} | {match.stage?.label ?? match.round}
          </p>
          <h2>
            {match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"}
          </h2>
          <p className="muted">
            {match.day} at {match.startTime} | {match.venue}
          </p>
        </div>
        <div className="match-ops-status">
          <span className="pill">{stateLabel}</span>
          <span className="pill">{scoreLine}</span>
        </div>
      </div>

      <form action={resultAction} className="stack-lg">
        <input type="hidden" name="matchId" value={match.id} />
        <input type="hidden" name="sportId" value={match.sportId} />

        <FormCluster label="Live Desk" title="Update score and result">
          <div className="form-grid">
            <label className="field">
              <span>Decision type</span>
              <select name="decisionType" defaultValue={match.result?.decisionType ?? "normal"}>
                <option value="normal">Normal</option>
                <option value="walkover">Walkover</option>
                <option value="penalties">Penalties</option>
                <option value="retired">Retired</option>
              </select>
            </label>

            <label className="field">
              <span>{match.teamA?.name ?? "Team A"} {cricketLiveScoring ? "runs" : "score"}</span>
              <input name="teamAScore" type="number" min="0" step="1" defaultValue={match.result?.teamAScore ?? undefined} />
            </label>

            <label className="field">
              <span>{match.teamB?.name ?? "Team B"} {cricketLiveScoring ? "runs" : "score"}</span>
              <input name="teamBScore" type="number" min="0" step="1" defaultValue={match.result?.teamBScore ?? undefined} />
            </label>

            {cricketLiveScoring ? (
              <>
                <label className="field">
                  <span>{match.teamA?.name ?? "Team A"} wickets</span>
                  <input name="teamAWickets" type="number" min="0" step="1" defaultValue={cricketEntries[0]?.line.wickets ?? 0} />
                </label>

                <label className="field">
                  <span>{match.teamB?.name ?? "Team B"} wickets</span>
                  <input name="teamBWickets" type="number" min="0" step="1" defaultValue={cricketEntries[1]?.line.wickets ?? 0} />
                </label>

                <label className="field">
                  <span>{match.teamA?.name ?? "Team A"} overs</span>
                  <input name="teamAOvers" inputMode="decimal" defaultValue={cricketEntries[0]?.line.overs ?? "0.0"} />
                </label>

                <label className="field">
                  <span>{match.teamB?.name ?? "Team B"} overs</span>
                  <input name="teamBOvers" inputMode="decimal" defaultValue={cricketEntries[1]?.line.overs ?? "0.0"} />
                </label>
              </>
            ) : null}

            <label className="field">
              <span>Winner override</span>
              <select name="winnerTeamId" defaultValue={match.result?.winnerTeamId ?? ""}>
                <option value="">Infer from score</option>
                {winnerOptions.map((team) => (
                  <option key={`${match.id}-${team.id}`} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Match state</span>
              <label className="field-checkbox">
                <input type="checkbox" name="matchOngoing" defaultChecked={match.status === "live"} />
                <span>Match ongoing, do not declare winner yet</span>
              </label>
            </label>

            <label className="field">
              <span>Score summary</span>
              <input
                name="scoreSummary"
                defaultValue={match.result?.scoreSummary ?? ""}
                placeholder={
                  cricketLiveScoring
                    ? "168/5 (20.0 ov) vs 149/8 (20.0 ov)"
                    : match.result?.decisionType === "penalties"
                      ? "1 - 1, 4 - 3 pens"
                      : "2 - 1"
                }
              />
            </label>

            <label className="field field-wide">
              <span>Note</span>
              <textarea
                name="note"
                defaultValue={match.result?.note ?? ""}
                rows={3}
                placeholder="Optional match note"
              />
            </label>
          </div>
        </FormCluster>

        <div className="result-bay-footer">
          <p className="muted">
            {cricketLiveScoring
              ? "Use match ongoing while play is in progress. That saves runs, wickets, and overs without inferring a winner."
              : "Use match ongoing to save an in-progress update without declaring a winner yet. Final results can still be saved later."}
          </p>
          <div className="admin-quick-actions">
            <span className="pill">{formatDecisionLabel(match.result?.decisionType)}</span>
            <SubmitButton className="button" pendingLabel="Saving result...">
              Save result
            </SubmitButton>
          </div>
        </div>
      </form>
    </section>
  );
}
