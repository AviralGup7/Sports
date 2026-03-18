import { FormCluster } from "@/components/form-cluster";
import { StageBadge } from "@/components/stage-badge";
import { Match, Team, Sport } from "@/lib/types";

type AdminMatchOpsCardProps = {
  match: Match;
  sports: Sport[];
  teams: Team[];
  updateAction: (formData: FormData) => void | Promise<void>;
  resultAction: (formData: FormData) => void | Promise<void>;
};

export function AdminMatchOpsCard({ match, sports, teams, updateAction, resultAction }: AdminMatchOpsCardProps) {
  const allowedTeams = teams.filter((team) => team.sportIds.includes(match.sportId));
  const winnerOptions = allowedTeams.filter((team) => team.id === match.teamAId || team.id === match.teamBId);

  return (
    <section className={`match-ops-card match-ops-${match.status}`}>
      <div className="match-ops-head">
        <div>
          <p className="eyebrow">
            {match.sportId} | {match.round}
          </p>
          <h2>
            {match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"}
          </h2>
        </div>
        <div className="match-ops-status">
          <StageBadge status={match.status} label={match.status} />
          <span className="pill">{match.venue}</span>
        </div>
      </div>

      <div className="match-ops-grid">
        <form action={updateAction} className="stack-lg">
          <input type="hidden" name="id" value={match.id} />
          <FormCluster label="Fixture metadata" title="Timing and structure">
            <div className="form-grid">
              <label className="field">
                <span>Sport</span>
                <select name="sportId" defaultValue={match.sportId}>
                  {sports.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Round</span>
                <input name="round" defaultValue={match.round} required />
              </label>
              <label className="field">
                <span>Day</span>
                <input name="day" type="date" defaultValue={match.day} required />
              </label>
              <label className="field">
                <span>Start time</span>
                <input name="startTime" type="time" defaultValue={match.startTime} required />
              </label>
              <label className="field">
                <span>Venue</span>
                <input name="venue" defaultValue={match.venue} required />
              </label>
              <label className="field">
                <span>Status</span>
                <select name="status" defaultValue={match.status}>
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </div>
          </FormCluster>

          <FormCluster label="Team lanes" title="Sides and progression">
            <div className="form-grid">
              <label className="field">
                <span>Team A</span>
                <select name="teamAId" defaultValue={match.teamAId ?? ""}>
                  <option value="">TBD</option>
                  {allowedTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Team B</span>
                <select name="teamBId" defaultValue={match.teamBId ?? ""}>
                  <option value="">TBD</option>
                  {allowedTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Next match ID</span>
                <input name="nextMatchId" defaultValue={match.nextMatchId ?? ""} />
              </label>
              <label className="field">
                <span>Next slot</span>
                <select name="nextSlot" defaultValue={match.nextSlot ?? ""}>
                  <option value="">No progression</option>
                  <option value="team_a">Team A</option>
                  <option value="team_b">Team B</option>
                </select>
              </label>
            </div>
          </FormCluster>

          <div className="form-actions">
            <button type="submit" className="button button-ghost">
              Update fixture
            </button>
          </div>
        </form>

        <form action={resultAction} className="result-bay">
          <input type="hidden" name="matchId" value={match.id} />
          <input type="hidden" name="sportId" value={match.sportId} />
          <FormCluster label="Result bay" title="Lock score and winner">
            <div className="form-grid">
              <label className="field">
                <span>Status</span>
                <select name="status" defaultValue={match.status}>
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
              <label className="field">
                <span>Winner</span>
                <select name="winnerTeamId" defaultValue={match.result?.winnerTeamId ?? ""}>
                  <option value="">Not decided</option>
                  {winnerOptions.map((team) => (
                    <option key={`${match.id}-${team.id}`} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Score summary</span>
                <input name="scoreSummary" defaultValue={match.result?.scoreSummary ?? ""} placeholder="2 - 1" />
              </label>
              <label className="field field-wide">
                <span>Note</span>
                <textarea name="note" defaultValue={match.result?.note ?? ""} rows={4} />
              </label>
            </div>
          </FormCluster>

          <div className="result-bay-footer">
            <p className="muted">When a completed winner is saved, the next-slot progression will auto-fill if this board is linked.</p>
            <button type="submit" className="button">
              Save result
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
