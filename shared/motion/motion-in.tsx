"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type MotionInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function MotionIn({ children, className, delay = 0, y = 24 }: MotionInProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

