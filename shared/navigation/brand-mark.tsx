import type { Tournament } from "@/domain";

import { LogoImage } from "./logo-image";

type BrandMarkProps = {
  tournament: Tournament;
};

export function BrandMark({ tournament }: BrandMarkProps) {
  return (
    <span className="brand-mark">
      <LogoImage tournament={tournament} size={72} className="brand-mark-svg" alt="" />
      <span className="brand-mark-word">ICL</span>
    </span>
  );
}
