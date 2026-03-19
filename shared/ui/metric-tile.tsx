"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CSSProperties } from "react";

type MetricTileProps = {
  label: string;
  value: string | number;
  detail: string;
  accent?: string;
  pulse?: boolean;
};

export function MetricTile({ label, value, detail, accent, pulse = false }: MetricTileProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`metric-tile${pulse ? " metric-tile-pulse" : ""}`}
      style={accent ? ({ "--tile-accent": accent } as CSSProperties) : undefined}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </motion.article>
  );
}

