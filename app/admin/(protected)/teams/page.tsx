import { ActionNotice } from "@/components/action-notice";
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

  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin teams</p>
        <h1>Team Registry</h1>
        <p>Create, edit, or archive teams while keeping their sport assignments and seeds in sync.</p>
      </section>

      <ActionNotice message={params.message} tone={tone} />

      <section className="editor-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Create team</p>
            <h2>New association</h2>
          </div>
        </div>
        <form action={upsertTeamAction} className="stack-lg">
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
          <div className="checkbox-grid">
            {data.sports.map((sport) => (
              <label key={sport.id} className="checkbox-pill">
                <input name="sportIds" type="checkbox" value={sport.id} />
                <span>{sport.name}</span>
              </label>
            ))}
          </div>
          <div className="form-actions">
            <button type="submit" className="button">
              Save team
            </button>
          </div>
        </form>
      </section>

      <div className="stack-lg">
        {data.teams.map((team) => (
          <article key={team.id} className="editor-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{team.isActive ? "Active" : "Archived"}</p>
                <h2>{team.name}</h2>
              </div>
              <span className="pill">{team.association}</span>
            </div>
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
              <div className="checkbox-grid">
                {data.sports.map((sport) => (
                  <label key={`${team.id}-${sport.id}`} className="checkbox-pill">
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
            {team.isActive ? (
              <form action={archiveTeamAction}>
                <input type="hidden" name="id" value={team.id} />
                <button type="submit" className="button button-danger">
                  Archive team
                </button>
              </form>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
