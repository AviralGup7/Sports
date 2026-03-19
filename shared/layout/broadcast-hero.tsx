import { CSSProperties, ReactNode } from "react";

type BroadcastHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  kicker?: string;
  accent?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
};

export function BroadcastHero({
  eyebrow,
  title,
  description,
  kicker,
  accent,
  actions,
  aside,
  compact = false
}: BroadcastHeroProps) {
  return (
    <section className={compact ? "broadcast-hero broadcast-hero-compact" : "broadcast-hero"}>
      <div className="broadcast-hero-main">
        <p className="eyebrow">{eyebrow}</p>
        {kicker ? <p className="hero-kicker-line">{kicker}</p> : null}
        <h1>{title}</h1>
        <p className="hero-text">{description}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
      </div>
      <div className="broadcast-hero-side" style={accent ? ({ "--hero-accent": accent } as CSSProperties) : undefined}>
        {aside}
      </div>
    </section>
  );
}

