"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useUICapability } from "@/shared/motion/ui-capability";

gsap.registerPlugin(ScrollTrigger);

export function PublicScrollRig() {
  const { scrollMode } = useUICapability();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    const root = document.documentElement;
    const isPublic = !pathname.startsWith("/admin");
    const shouldUseLenis = isPublic && scrollMode === "lenis";

    root.dataset.scrollMode = shouldUseLenis ? "lenis" : "native";

    ScrollTrigger.getAll().forEach((trigger) => trigger.update());
    ScrollTrigger.refresh();
  }, [pathname, scrollMode]);

  return null;
}
