import { CSSProperties, ReactNode } from "react";

import { CyberArenaScene } from "@/shared/motion";

type BroadcastHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  kicker?: string;
  accent?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
  tone?: "cyan" | "blue" | "amber" | "crimson";
  intensity?: "cinematic" | "premium" | "functional";
  signals?: ReactNode;
};

export function BroadcastHero({
  eyebrow,
  title,
  description,
  kicker,
  accent,
  actions,
  aside,
  compact = false,
  tone = "cyan",
  intensity = "premium",
  signals
}: BroadcastHeroProps) {
  return (
    <section className={compact ? "broadcast-hero broadcast-hero-compact" : "broadcast-hero"}>
      <CyberArenaScene className="broadcast-hero-scene" tone={tone} intensity={intensity} />
      <div className="broadcast-hero-shine" aria-hidden="true" />
      <div className="broadcast-hero-main">
        <p className="eyebrow">{eyebrow}</p>
        {kicker ? <p className="hero-kicker-line">{kicker}</p> : null}
        <h1>{title}</h1>
        <p className="hero-text">{description}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
        {signals ? <div className="hero-signal-grid">{signals}</div> : null}
      </div>
      <div className="broadcast-hero-side" style={accent ? ({ "--hero-accent": accent } as CSSProperties) : undefined}>
        {aside}
      </div>
    </section>
  );
}

