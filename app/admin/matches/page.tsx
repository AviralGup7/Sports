import { matches, sports } from "@/lib/data";

export default function AdminMatchesPage() {
  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin matches</p>
        <h1>Fixture Control</h1>
        <p>These records are shaped for future result entry, bracket progression, and sport-specific filtering.</p>
      </section>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sport</th>
              <th>Round</th>
              <th>Day</th>
              <th>Time</th>
              <th>Status</th>
              <th>Venue</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{sports.find((sport) => sport.id === match.sportId)?.name}</td>
                <td>{match.round}</td>
                <td>{match.day}</td>
                <td>{match.startTime}</td>
                <td>{match.status}</td>
                <td>{match.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
