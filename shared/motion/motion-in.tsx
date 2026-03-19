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
      initial={{ opacity: 0, y, scale: 0.985, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

