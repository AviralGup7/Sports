"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type CountUpValueProps = {
  value: number | string;
  duration?: number;
  className?: string;
};

export function CountUpValue({ value, duration = 1.4, className }: CountUpValueProps) {
  const reduceMotion = useReducedMotion();
  const nodeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || reduceMotion || typeof value !== "number") {
      if (node) {
        node.textContent = String(value);
      }
      return;
    }

    const state = { current: 0 };
    const tween = gsap.to(state, {
      current: value,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.round(state.current).toLocaleString("en-IN");
        }
      }
    });

    return () => {
      tween.kill();
    };
  }, [duration, reduceMotion, value]);

  return (
    <span ref={nodeRef} className={className}>
      {typeof value === "number" ? value.toLocaleString("en-IN") : value}
    </span>
  );
}
