import { ActionNotice } from "@/components/action-notice";
import { ControlPanel } from "@/components/control-panel";
import { FormCluster } from "@/components/form-cluster";
import { MotionIn } from "@/components/motion-in";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminTeamsData } from "@/lib/data";

import { archiveTeamAction, upsertTeamAction } from "../../actions";

type AdminTeamsPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminTeamsPage({ searchParams }: AdminTeamsPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminTeamsData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";
  const activeTeams = data.teams.filter((team) => team.isActive);
  const archivedTeams = data.teams.filter((team) => !team.isActive);

  return (
    <div className="stack-xl">
      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Team Registry</p>
            <h1>Squad control</h1>
            <p className="hero-text">Create new associations on the left, then work through the registry list without losing context.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Active {activeTeams.length}</span>
            <span className="operations-chip">Archived {archivedTeams.length}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={params.message} tone={tone} />

      <MotionIn className="split-stage" delay={0.08}>
        <ControlPanel eyebrow="Create Team" title="New association" description="Build a squad record with seed and sport assignments.">
          <form action={upsertTeamAction} className="stack-lg">
            <FormCluster label="Identity" title="Who is entering?">
              <div className="form-grid">
                <label className="field">
                  <span>Name</span>
                  <input name="name" required placeholder="New team name" />
                </label>
                <label className="field">
                  <span>Association</span>
                  <input name="association" required placeholder="Association or block" />
                </label>
                <label className="field">
                  <span>Seed</span>
                  <input name="seed" type="number" min="1" required placeholder="1" />
                </label>
              </div>
            </FormCluster>

            <FormCluster label="Assignments" title="Sport lanes">
              <div className="selection-pills">
                {data.sports.map((sport) => (
                  <label key={sport.id} className="selection-pill">
                    <input name="sportIds" type="checkbox" value={sport.id} />
                    <span>{sport.name}</span>
                  </label>
                ))}
              </div>
            </FormCluster>

            <div className="form-actions">
              <button type="submit" className="button">
                Save team
              </button>
            </div>
          </form>
        </ControlPanel>

        <div className="stack-lg">
          {activeTeams.map((team) => (
            <ControlPanel
              key={team.id}
              eyebrow="Active Team"
              title={team.name}
              description={`${team.association} | seed ${team.seed}`}
              dense
            >
              <form action={upsertTeamAction} className="stack-lg">
                <input type="hidden" name="id" value={team.id} />
                <div className="form-grid">
                  <label className="field">
                    <span>Name</span>
                    <input name="name" defaultValue={team.name} required />
                  </label>
                  <label className="field">
                    <span>Association</span>
                    <input name="association" defaultValue={team.association} required />
                  </label>
                  <label className="field">
                    <span>Seed</span>
                    <input name="seed" type="number" min="1" defaultValue={team.seed} required />
                  </label>
                </div>
                <div className="selection-pills">
                  {data.sports.map((sport) => (
                    <label key={`${team.id}-${sport.id}`} className="selection-pill">
                      <input name="sportIds" type="checkbox" value={sport.id} defaultChecked={team.sportIds.includes(sport.id)} />
                      <span>{sport.name}</span>
                    </label>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="submit" className="button">
                    Update team
                  </button>
                </div>
              </form>
              <form action={archiveTeamAction}>
                <input type="hidden" name="id" value={team.id} />
                <button type="submit" className="button button-danger">
                  Archive team
                </button>
              </form>
            </ControlPanel>
          ))}

          {archivedTeams.length > 0 ? (
            <ControlPanel eyebrow="Archive" title="Lower-priority records" dense>
              <div className="archive-stack">
                {archivedTeams.map((team) => (
                  <article key={team.id} className="archived-row">
                    <strong>{team.name}</strong>
                    <span>
                      {team.association} | seed {team.seed}
                    </span>
                  </article>
                ))}
              </div>
            </ControlPanel>
          ) : null}
        </div>
      </MotionIn>
    </div>
  );
}
