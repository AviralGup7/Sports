import { CSSProperties } from "react";
import Link from "next/link";

import type { StandingsCard } from "@/server/data/public/types";
import { getTeamAccent } from "@/lib/team-style";

type StandingsTableProps = {
  cards: StandingsCard[];
};

export function StandingsTable({ cards }: StandingsTableProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="standings-grid">
      {cards.map((card) => (
        <section key={card.id} className="standings-card">
          <div className="standings-head">
            <div>
              <p className="eyebrow">Standings</p>
              <h3>{card.label}</h3>
            </div>
          </div>
          <div className="standings-table-shell">
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Association</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                </tr>
              </thead>
              <tbody>
                {card.rows.map((row) => {
                  const teamLabel = row.team?.name ?? row.teamId;
                  const teamAccent = getTeamAccent(row.team ?? { id: row.teamId, name: teamLabel, association: "" });

                  return (
                    <tr key={row.teamId} className={row.qualified ? "standings-qualified" : undefined}>
                      <td>
                        <Link
                          href={`/teams/${row.teamId}`}
                          className="standings-team-link"
                          style={{ "--team-accent": teamAccent } as CSSProperties}
                        >
                          <strong>{teamLabel}</strong>
                        </Link>
                      </td>
                      <td>{row.played}</td>
                      <td>{row.wins}</td>
                      <td>{row.draws}</td>
                      <td>{row.losses}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

