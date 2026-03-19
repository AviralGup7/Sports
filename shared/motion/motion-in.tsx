"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

import { useUICapability } from "@/shared/motion/ui-capability";

type MotionInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function MotionIn({ children, className, delay = 0, y = 24 }: MotionInProps) {
  const reduceMotion = useReducedMotion();
  const capability = useUICapability();

  if (reduceMotion || capability.effects === "safe") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

