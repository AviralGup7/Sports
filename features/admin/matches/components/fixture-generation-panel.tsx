import type { Sport } from "@/domain/sports/types";
import type { Team } from "@/domain/teams/types";

type FixtureGenerationPanelProps = {
  sports: Sport[];
  teams: Team[];
  action: (formData: FormData) => void | Promise<void>;
};

export function FixtureGenerationPanel({ sports, teams, action }: FixtureGenerationPanelProps) {
  return (
    <form action={action} className="stack-lg">
      <div className="form-grid">
        <label className="field">
          <span>Sport</span>
          <select name="sportId" required defaultValue="">
            <option value="" disabled>
              Select sport
            </option>
            {sports.filter((sport) => sport.id !== "athletics").map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>
        </label>
        <input type="hidden" name="format" value="knockout" />
        <label className="field">
          <span>Knockout teams</span>
          <input name="knockoutSize" type="number" min="4" max="8" step="2" defaultValue="4" />
        </label>
      </div>
      <div className="builder-preview">
        <p className="muted">
          Uses the top active seeded teams from the selected sport in knockout mode. Current roster: {teams.filter((team) => team.isActive).length} active teams.
        </p>
      </div>
      <div className="form-actions">
        <button type="submit" className="button">
          Generate fixture structure
        </button>
      </div>
    </form>
  );
}

