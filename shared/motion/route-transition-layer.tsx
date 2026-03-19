"use client";

import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useUICapability } from "@/shared/motion/ui-capability";

export function RouteTransitionLayer() {
  const pathname = usePathname() ?? "";
  const capability = useUICapability();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    if (capability.reducedMotion) {
      return;
    }

    const overlay = overlayRef.current;
    const bar = barRef.current;
    if (!overlay || !bar) {
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .set(overlay, { autoAlpha: 1 })
      .fromTo(
        bar,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.28, ease: "power3.out" }
      )
      .to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.32,
          ease: "power2.out"
        },
        "-=0.02"
      )
      .to(
        bar,
        {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.34,
          ease: "power2.inOut"
        },
        "<"
      );

    return () => {
      timeline.kill();
    };
  }, [capability.reducedMotion, pathname]);

  return (
    <div ref={overlayRef} className="route-transition-layer" aria-hidden="true">
      <div ref={barRef} className="route-transition-bar" />
    </div>
  );
}
