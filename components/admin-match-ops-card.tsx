import { CompetitionGroup, CompetitionStage, Match, Team, Sport } from "@/lib/types";

import { FormCluster } from "./form-cluster";
import { StageBadge } from "./stage-badge";

type AdminMatchOpsCardProps = {
  match: Match;
  sports: Sport[];
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  teams: Team[];
  updateAction: (formData: FormData) => void | Promise<void>;
  resultAction: (formData: FormData) => void | Promise<void>;
};

export function AdminMatchOpsCard({
  match,
  sports,
  stages,
  groups,
  teams,
  updateAction,
  resultAction
}: AdminMatchOpsCardProps) {
  const allowedTeams = teams.filter((team) => team.sportIds.includes(match.sportId));
  const winnerOptions = allowedTeams.filter((team) => team.id === match.teamAId || team.id === match.teamBId);
  const sportStages = stages.filter((stage) => stage.sportId === match.sportId);
  const stageGroups = groups.filter((group) => group.sportId === match.sportId);

  return (
    <section className={`match-ops-card match-ops-${match.status}`}>
      <div className="match-ops-head">
        <div>
          <p className="eyebrow">
            {match.sportId} | {match.stage?.label ?? "No stage"} {match.group ? `| ${match.group.code}` : ""}
          </p>
          <h2>
            {match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"}
          </h2>
        </div>
        <div className="match-ops-status">
          <StageBadge status={match.status} label={match.isBye ? "bye" : match.status} tone={match.isBye ? "alert" : undefined} />
          <span className="pill">{match.venue}</span>
        </div>
      </div>

      <div className="match-ops-grid">
        <form action={updateAction} className="stack-lg">
          <input type="hidden" name="id" value={match.id} />
          <FormCluster label="Fixture metadata" title="Timing, stage, and routing">
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
                <span>Stage</span>
                <select name="stageId" defaultValue={match.stageId ?? ""}>
                  <option value="">No stage</option>
                  {sportStages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Group</span>
                <select name="groupId" defaultValue={match.groupId ?? ""}>
                  <option value="">No group</option>
                  {stageGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.code}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Round</span>
                <input name="round" defaultValue={match.round} required />
              </label>
              <label className="field">
                <span>Round index</span>
                <input name="roundIndex" type="number" min="1" defaultValue={match.roundIndex} />
              </label>
              <label className="field">
                <span>Match number</span>
                <input name="matchNumber" type="number" min="1" defaultValue={match.matchNumber} />
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
                  <option value="postponed">Postponed</option>
                  <option value="cancelled">Cancelled</option>
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
                <span>Winner to match ID</span>
                <input name="winnerToMatchId" defaultValue={match.winnerToMatchId ?? ""} />
              </label>
              <label className="field">
                <span>Winner slot</span>
                <select name="winnerToSlot" defaultValue={match.winnerToSlot ?? ""}>
                  <option value="">No progression</option>
                  <option value="team_a">Team A</option>
                  <option value="team_b">Team B</option>
                </select>
              </label>
              <label className="field">
                <span>Loser to match ID</span>
                <input name="loserToMatchId" defaultValue={match.loserToMatchId ?? ""} />
              </label>
              <label className="field">
                <span>Loser slot</span>
                <select name="loserToSlot" defaultValue={match.loserToSlot ?? ""}>
                  <option value="">No loser route</option>
                  <option value="team_a">Team A</option>
                  <option value="team_b">Team B</option>
                </select>
              </label>
            </div>
            <div className="selection-pills">
              <label className="selection-pill">
                <input name="isBye" type="checkbox" defaultChecked={match.isBye} />
                <span>Bye slot</span>
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
                  <option value="postponed">Postponed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label className="field">
                <span>Decision</span>
                <select name="decisionType" defaultValue={match.result?.decisionType ?? "normal"}>
                  <option value="normal">Normal</option>
                  <option value="walkover">Walkover</option>
                  <option value="penalties">Penalties</option>
                  <option value="retired">Retired</option>
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
                <span>Team A score</span>
                <input name="teamAScore" type="number" step="1" defaultValue={match.result?.teamAScore ?? undefined} />
              </label>
              <label className="field">
                <span>Team B score</span>
                <input name="teamBScore" type="number" step="1" defaultValue={match.result?.teamBScore ?? undefined} />
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
            <p className="muted">
              Completed results immediately push winner and loser routes where the tree is linked. Postponed boards stay in the integrity watchlist until rescheduled.
            </p>
            <button type="submit" className="button">
              Save result
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
