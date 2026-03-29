"use client";

import Image from "next/image";

const sponsors = [
  {
    name: "Midtown",
    assetPath: "/sponsors/midtown.jpeg"
  },
  {
    name: "Dark Park Bakers",
    assetPath: "/sponsors/dark-park-bakers.jpeg"
  }
] as const;

type SponsorShowcaseProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  compact?: boolean;
};

export function SponsorShowcase({
  eyebrow = "Sponsors",
  title = "Supported by our local partners",
  description = "Thanks to the businesses helping power the tournament experience.",
  compact = false
}: SponsorShowcaseProps) {
  return (
    <div className={`sponsor-showcase${compact ? " sponsor-showcase-compact" : ""}`}>
      <div className="sponsor-showcase-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p>{description}</p>
      </div>

      <div className="sponsor-showcase-grid" role="list" aria-label="Tournament sponsors">
        {sponsors.map((sponsor) => (
          <article key={sponsor.name} className="sponsor-logo-card" role="listitem">
            <div className="sponsor-logo-frame">
              <Image
                src={sponsor.assetPath}
                alt={`${sponsor.name} sponsor logo`}
                width={176}
                height={176}
                className="sponsor-logo-image"
                unoptimized
              />
            </div>
            <div className="sponsor-logo-copy">
              <strong>{sponsor.name}</strong>
              <span>Event sponsor</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
