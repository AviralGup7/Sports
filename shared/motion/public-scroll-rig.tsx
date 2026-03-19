"use client";

import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useUICapability } from "@/shared/motion/ui-capability";

gsap.registerPlugin(ScrollTrigger);

export function PublicScrollRig() {
  const capability = useUICapability();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    const root = document.documentElement;
    const isPublic = !pathname.startsWith("/admin");
    const shouldUseLenis = isPublic && capability.scrollMode === "lenis";

    root.dataset.scrollMode = shouldUseLenis ? "lenis" : "native";

    if (!shouldUseLenis) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: capability.isMobile ? 0.12 : 0.09,
      smoothWheel: true,
      syncTouch: capability.isMobile,
      touchInertiaMultiplier: capability.isMobile ? 24 : 36
    });

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    const handleScroll = () => {
      ScrollTrigger.update();
    };

    lenis.on("scroll", handleScroll);
    frameId = window.requestAnimationFrame(raf);
    ScrollTrigger.refresh();

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [capability.isMobile, capability.scrollMode, pathname]);

  return null;
}
