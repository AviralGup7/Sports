"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CSSProperties } from "react";

import { CountUpValue } from "@/shared/motion";

type MetricTileProps = {
  label: string;
  value: string | number;
  detail: string;
  accent?: string;
  pulse?: boolean;
  href?: string;
};

export function MetricTile({ label, value, detail, accent, pulse = false, href }: MetricTileProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`metric-tile${pulse ? " metric-tile-pulse" : ""}`}
      style={accent ? ({ "--tile-accent": accent } as CSSProperties) : undefined}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="metric-ornament" aria-hidden="true" />
      <p>{label}</p>
      <strong>
        <CountUpValue value={value} />
      </strong>
      <span>{detail}</span>
      {href ? <span className="metric-link-hint">Open lane</span> : null}
    </motion.article>
  );
}

