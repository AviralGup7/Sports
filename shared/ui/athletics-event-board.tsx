import Link from "next/link";

import type { AthleticsEventBoard as AthleticsEventBoardData } from "@/server/data/public/types";

import { FixtureStrip } from "./fixture-strip";

type AthleticsEventBoardProps = {
  board: AthleticsEventBoardData;
  admin?: boolean;
};

export function AthleticsEventBoard({ board, admin = false }: AthleticsEventBoardProps) {
  return (
    <section className="athletics-event-board">
      <div className="athletics-event-head">
        <div>
          <p className="eyebrow">{board.stageLabel}</p>
          <h3>{board.title}</h3>
          <p>{board.description}</p>
        </div>
        {admin ? (
          <Link href="/admin/matches?mode=live&sport=athletics" className="button button-ghost">
            Control athletics
          </Link>
        ) : null}
      </div>
      <div className="fixture-stack">
        {board.matches.map((match) => (
          <FixtureStrip key={match.id} match={match} compact admin={admin} />
        ))}
      </div>
    </section>
  );
}
