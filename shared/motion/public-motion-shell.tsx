"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const PublicScrollRig = dynamic(() => import("@/shared/motion/public-scroll-rig").then((module) => module.PublicScrollRig), {
  ssr: false,
  loading: () => null
});

const RouteTransitionLayer = dynamic(() => import("@/shared/motion/route-transition-layer").then((module) => module.RouteTransitionLayer), {
  ssr: false,
  loading: () => null
});

function shouldEnableScrollRig(pathname: string) {
  return pathname === "/" || pathname.startsWith("/sports/") || pathname.startsWith("/matches/");
}

export function PublicMotionShell() {
  const pathname = usePathname() ?? "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return null;
  }

  return (
    <>
      {shouldEnableScrollRig(pathname) ? <PublicScrollRig /> : null}
      <RouteTransitionLayer />
    </>
  );
}
