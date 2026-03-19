"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useLayoutEffect, useRef } from "react";

import { useUICapability } from "@/shared/motion/ui-capability";

gsap.registerPlugin(ScrollTrigger);

type ScrollStorySectionProps = {
  children: ReactNode;
  className?: string;
  variant?: "hero" | "section" | "bracket" | "news";
};

const variantTravel = {
  hero: 48,
  section: 28,
  bracket: 34,
  news: 24
} as const;

export function ScrollStorySection({ children, className, variant = "section" }: ScrollStorySectionProps) {
  const capability = useUICapability();
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || capability.reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0, y: variantTravel[variant], scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 86%",
            once: true
          }
        }
      );

      if (variant !== "section") {
        gsap.to(node, {
          yPercent: variant === "hero" ? -4 : -2.5,
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, ref);

    return () => {
      ctx.revert();
    };
  }, [capability.reducedMotion, variant]);

  return (
    <div ref={ref} className={className ? `scroll-story-section ${className}` : "scroll-story-section"}>
      {children}
    </div>
  );
}
