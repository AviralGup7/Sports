"use client";

import { usePathname } from "next/navigation";

import { CyberArenaScene } from "@/shared/motion/cyber-arena-scene";
import { useUICapability } from "@/shared/motion/ui-capability";

const scenicRouteMatchers = [/^\/sports\/[^/]+$/];

function shouldRenderScene(pathname: string) {
  return scenicRouteMatchers.some((pattern) => pattern.test(pathname));
}

export function AmbientBackdrop() {
  const pathname = usePathname() ?? "/";
  const capability = useUICapability();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  if (!shouldRenderScene(pathname)) {
    return null;
  }

  if (capability.reducedMotion || capability.effects === "safe" || capability.isMobile) {
    return null;
  }

  return <CyberArenaScene className="site-backdrop-scene" tone="blue" intensity="premium" interactive={false} variant="site-backdrop" />;
}
