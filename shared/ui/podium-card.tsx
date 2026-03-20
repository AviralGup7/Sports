import { CSSProperties } from "react";
import Link from "next/link";

import type { ChampionSpotlight } from "@/server/data/public/types";

type PodiumCardProps = {
  spotlight: ChampionSpotlight;
  index: number;
};

export function PodiumCard({ spotlight, index }: PodiumCardProps) {
  return (
    <article className={`podium-card podium-rank-${index + 1}`} style={{ "--sport-accent": spotlight.sport.color } as CSSProperties}>
      <p className="eyebrow">{spotlight.sport.name}</p>
      <h3>{spotlight.winner?.name ?? "TBD"}</h3>
      <span className="podium-status">{spotlight.statusLabel}</span>
      <p>{spotlight.note}</p>
      <Link href={`/sports/${spotlight.sport.id}`} className="inline-link">
        View {spotlight.sport.name}
      </Link>
    </article>
  );
}

