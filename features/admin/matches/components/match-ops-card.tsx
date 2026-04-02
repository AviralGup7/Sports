import type { Match } from "@/domain/matches/types";
import type { Team } from "@/domain/teams/types";
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
  const scoreLine =
    match.result?.teamAScore !== null && match.result?.teamAScore !== undefined && match.result?.teamBScore !== null && match.result?.teamBScore !== undefined
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
              <span>{match.teamA?.name ?? "Team A"} score</span>
              <input name="teamAScore" type="number" min="0" step="1" defaultValue={match.result?.teamAScore ?? undefined} />
            </label>

            <label className="field">
              <span>{match.teamB?.name ?? "Team B"} score</span>
              <input name="teamBScore" type="number" min="0" step="1" defaultValue={match.result?.teamBScore ?? undefined} />
            </label>

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
              <span>Score summary</span>
              <input
                name="scoreSummary"
                defaultValue={match.result?.scoreSummary ?? ""}
                placeholder={
                  cricketLiveScoring
                    ? "168/5 vs 149/8"
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
              ? "Cricket can use live score updates. Keep numeric team scores filled for winner logic, and use score summary for cricket notation like 168/5 vs 149/8."
              : "For non-cricket sports, boards stay fixture-only until a final result is saved. Use score summary for the final result format you want shown publicly."}
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
