"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

import type { TickerGroup, TickerItem } from "@/server/data/public/types";

type LiveTickerProps = {
  items: TickerItem[];
  groups?: TickerGroup[];
};

export function LiveTicker({ items, groups = [] }: LiveTickerProps) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const rail = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduceMotion || items.length === 0) {
      return;
    }

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: "none",
      repeat: -1
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [items.length, rail, reduceMotion]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="ticker-shell" aria-label="Live tournament ticker">
      <div className="ticker-label">Arena Feed</div>
      <div className="ticker-window">
        {groups.length > 0 ? (
          <div className="ticker-groups" aria-hidden="true">
            {groups.map((group) => (
              <span key={group.id} className={`ticker-group ticker-group-${group.tone}`}>
                {group.label}
              </span>
            ))}
          </div>
        ) : null}
        {reduceMotion ? (
          <div className="ticker-track ticker-track-static">
            {items.map((item) => (
              <TickerChip key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="ticker-track"
            onMouseEnter={() => tweenRef.current?.pause()}
            onMouseLeave={() => tweenRef.current?.resume()}
          >
            {rail.map((item, index) => (
              <TickerChip key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
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

