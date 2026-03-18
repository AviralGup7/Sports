import { sports, teams } from "@/lib/data";

export default function AdminTeamsPage() {
  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin teams</p>
        <h1>Team Registry</h1>
        <p>Read-only mock list for now. Next step is form-based create/edit backed by the database.</p>
      </section>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Association</th>
              <th>Seed</th>
              <th>Sports</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.association}</td>
                <td>{team.seed}</td>
                <td>{team.sportIds.map((sportId) => sports.find((sport) => sport.id === sportId)?.name).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
