"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { useUICapability } from "@/shared/motion/ui-capability";

const CyberArenaScene = dynamic(() => import("@/shared/motion/cyber-arena-scene").then((module) => module.CyberArenaScene), {
  ssr: false,
  loading: () => null
});

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
