import type { GroupStandingsCard } from "@/server/data/public/types";

type StandingsTableProps = {
  cards: GroupStandingsCard[];
};

export function StandingsTable({ cards }: StandingsTableProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="standings-grid">
      {cards.map((card) => (
        <section key={card.group.id} className="standings-card">
          <div className="standings-head">
            <div>
              <p className="eyebrow">Standings</p>
              <h3>{card.group.code}</h3>
            </div>
          </div>
          <div className="standings-table-shell">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>Pts</th>
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {card.rows.map((row) => (
                  <tr key={row.teamId} className={row.qualified ? "standings-qualified" : undefined}>
                    <td>
                      <strong>{row.team?.name ?? row.teamId}</strong>
                    </td>
                    <td>{row.played}</td>
                    <td>{row.wins}</td>
                    <td>{row.draws}</td>
                    <td>{row.losses}</td>
                    <td>{row.points}</td>
                    <td>{row.scoreDifference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

