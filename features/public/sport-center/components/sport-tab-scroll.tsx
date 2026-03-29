"use client";

import { useEffect } from "react";

type SportTabScrollProps = {
  targetId?: string;
};

export function SportTabScroll({ targetId }: SportTabScrollProps) {
  useEffect(() => {
    if (!targetId) {
      return;
    }

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ block: "start" });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [targetId]);

  return null;
}
