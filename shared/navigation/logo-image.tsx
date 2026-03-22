import Image from "next/image";

import type { Tournament } from "@/domain";

type LogoImageProps = {
  tournament: Tournament;
  size: number;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function LogoImage({ tournament, size, className, priority = false, alt }: LogoImageProps) {
  return (
    <Image
      src={tournament.logoAssetPath}
      alt={alt ?? `${tournament.name} logo`}
      width={size}
      height={size}
      className={className}
      priority={priority}
      unoptimized
      sizes={`${size}px`}
    />
  );
}
