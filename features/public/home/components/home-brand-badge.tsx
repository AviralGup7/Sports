import type { Tournament } from "@/domain";
import { LogoImage } from "@/shared/navigation";

type HomeBrandBadgeProps = {
  tournament: Tournament;
};

export function HomeBrandBadge({ tournament }: HomeBrandBadgeProps) {
  return (
    <div className="hero-brand-lockup">
      <div className="hero-brand-image-wrap">
        <LogoImage
          tournament={tournament}
          size={220}
          className="hero-brand-image"
          priority
        />
      </div>
      <div className="hero-brand-copy">
        <strong>Official emblem</strong>
      </div>
    </div>
  );
}
