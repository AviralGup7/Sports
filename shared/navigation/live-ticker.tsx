"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import type { TickerGroup, TickerItem } from "@/server/data/public/types";
import { useUICapability } from "@/shared/motion";

type LiveTickerProps = {
  items: TickerItem[];
  groups?: TickerGroup[];
};

export function LiveTicker({ items, groups = [] }: LiveTickerProps) {
  const capability = useUICapability();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const loopingRail = useMemo(() => items, [items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || capability.tickerMode !== "looping" || items.length === 0) {
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
  }, [capability.tickerMode, items.length, loopingRail]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="ticker-shell" aria-label="Live scores and match alerts">
      <div className="ticker-label">Live Scores</div>
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
        {capability.tickerMode !== "looping" ? (
          <div className={capability.tickerMode === "stepped" ? "ticker-track ticker-track-stepped" : "ticker-track ticker-track-static"}>
            {items.map((item) => (
              <TickerChip key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="ticker-track ticker-track-looping"
            onMouseEnter={() => tweenRef.current?.pause()}
            onMouseLeave={() => tweenRef.current?.resume()}
          >
            <div className="ticker-track-segment">
              {loopingRail.map((item) => (
                <TickerChip key={item.id} item={item} />
              ))}
            </div>
            <div className="ticker-track-segment" aria-hidden="true">
              {loopingRail.map((item) => (
                <TickerChip key={`${item.id}-clone`} item={item} decorative />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TickerChip({ item, decorative = false }: { item: TickerItem; decorative?: boolean }) {
  const content = (
    <span className={`ticker-item ticker-${item.tone}`}>
      <strong>{item.label}</strong>
      <span>{item.message}</span>
    </span>
  );

  if (decorative || !item.href) {
    return content;
  }

  return (
    <Link href={item.href} className="ticker-link">
      {content}
    </Link>
  );
}

