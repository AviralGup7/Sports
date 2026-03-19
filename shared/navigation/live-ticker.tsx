"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { TickerItem } from "@/server/data/public/types";

type LiveTickerProps = {
  items: TickerItem[];
};

export function LiveTicker({ items }: LiveTickerProps) {
  const reduceMotion = useReducedMotion();

  if (items.length === 0) {
    return null;
  }

  const rail = [...items, ...items];

  return (
    <div className="ticker-shell" aria-label="Live tournament ticker">
      <div className="ticker-label">Arena Feed</div>
      <div className="ticker-window">
        {reduceMotion ? (
          <div className="ticker-track ticker-track-static">
            {items.map((item) => (
              <TickerChip key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <motion.div
            className="ticker-track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
          >
            {rail.map((item, index) => (
              <TickerChip key={`${item.id}-${index}`} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function TickerChip({ item }: { item: TickerItem }) {
  const content = (
    <span className={`ticker-item ticker-${item.tone}`}>
      <strong>{item.label}</strong>
      <span>{item.message}</span>
    </span>
  );

  if (!item.href) {
    return content;
  }

  return (
    <Link href={item.href} className="ticker-link">
      {content}
    </Link>
  );
}

