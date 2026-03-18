import { ControlPanel } from "@/components/control-panel";
import { FormCluster } from "@/components/form-cluster";
import { Team, Sport } from "@/lib/types";

type AdminMatchCreatePanelProps = {
  sports: Sport[];
  teams: Team[];
  action: (formData: FormData) => void | Promise<void>;
};

export function AdminMatchCreatePanel({ sports, teams, action }: AdminMatchCreatePanelProps) {
  return (
    <ControlPanel eyebrow="Create Fixture" title="New board" description="Set the frame, teams, and bracket link before the match goes live.">
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
              <span>Round</span>
              <input name="round" required placeholder="Semi-Final" />
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
              </select>
            </label>
          </div>
        </FormCluster>

        <FormCluster label="Teams and progression" title="Slot setup">
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
              <span>Next match ID</span>
              <input name="nextMatchId" placeholder="volleyball-final" />
            </label>
            <label className="field">
              <span>Next slot</span>
              <select name="nextSlot" defaultValue="">
                <option value="">No progression</option>
                <option value="team_a">Team A</option>
                <option value="team_b">Team B</option>
              </select>
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
