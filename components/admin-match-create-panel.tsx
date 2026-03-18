import { CompetitionGroup, CompetitionStage, Team, Sport } from "@/lib/types";

import { ControlPanel } from "./control-panel";
import { FormCluster } from "./form-cluster";

type AdminMatchCreatePanelProps = {
  sports: Sport[];
  stages: CompetitionStage[];
  groups: CompetitionGroup[];
  teams: Team[];
  action: (formData: FormData) => void | Promise<void>;
};

export function AdminMatchCreatePanel({ sports, stages, groups, teams, action }: AdminMatchCreatePanelProps) {
  return (
    <ControlPanel eyebrow="Create Fixture" title="New board" description="Set stage, lineage, sides, and fallback progression before the match goes live.">
      <form action={action} className="stack-lg">
        <FormCluster label="Fixture" title="Core setup">
          <div className="form-grid">
            <label className="field">
              <span>Sport</span>
              <select name="sportId" required defaultValue="">
                <option value="" disabled>
                  Select sport
                </option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Stage</span>
              <select name="stageId" defaultValue="">
                <option value="">No stage</option>
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Group</span>
              <select name="groupId" defaultValue="">
                <option value="">No group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.code}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Round</span>
              <input name="round" required placeholder="Semi Final 1" />
            </label>
            <label className="field">
              <span>Round index</span>
              <input name="roundIndex" type="number" min="1" defaultValue="1" />
            </label>
            <label className="field">
              <span>Match number</span>
              <input name="matchNumber" type="number" min="1" defaultValue="1" />
            </label>
            <label className="field">
              <span>Day</span>
              <input name="day" type="date" required />
            </label>
            <label className="field">
              <span>Start time</span>
              <input name="startTime" type="time" required />
            </label>
            <label className="field">
              <span>Venue</span>
              <input name="venue" required placeholder="Main Ground" />
            </label>
            <label className="field">
              <span>Status</span>
              <select name="status" defaultValue="scheduled">
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        </FormCluster>

        <FormCluster label="Teams and lineage" title="Slot setup">
          <div className="form-grid">
            <label className="field">
              <span>Team A</span>
              <select name="teamAId" defaultValue="">
                <option value="">TBD</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Team B</span>
              <select name="teamBId" defaultValue="">
                <option value="">TBD</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Winner to match ID</span>
              <input name="winnerToMatchId" placeholder="cricket-final" />
            </label>
            <label className="field">
              <span>Winner slot</span>
              <select name="winnerToSlot" defaultValue="">
                <option value="">No progression</option>
                <option value="team_a">Team A</option>
                <option value="team_b">Team B</option>
              </select>
            </label>
            <label className="field">
              <span>Loser to match ID</span>
              <input name="loserToMatchId" placeholder="cricket-third" />
            </label>
            <label className="field">
              <span>Loser slot</span>
              <select name="loserToSlot" defaultValue="">
                <option value="">No loser route</option>
                <option value="team_a">Team A</option>
                <option value="team_b">Team B</option>
              </select>
            </label>
          </div>
          <div className="selection-pills">
            <label className="selection-pill">
              <input type="checkbox" name="isBye" />
              <span>Bye slot</span>
            </label>
          </div>
        </FormCluster>

        <div className="form-actions">
          <button type="submit" className="button">
            Save fixture
          </button>
        </div>
      </form>
    </ControlPanel>
  );
}
