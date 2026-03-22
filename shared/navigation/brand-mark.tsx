import Image from "next/image";

import leagueLogo from "@/logo/v2.png";

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <Image src={leagueLogo} alt="" width={72} height={72} className="brand-mark-svg" />
      <span className="brand-mark-word">IASL</span>
    </span>
  );
}
