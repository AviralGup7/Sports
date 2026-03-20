"use client";

import { useEffect, useState } from "react";

type CountdownChipProps = {
  startsAt: string;
};

function formatCountdown(target: string) {
  const diffMs = new Date(target).getTime() - Date.now();

  if (diffMs <= 0 || diffMs > 60 * 60 * 1000) {
    return null;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `Next match in ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function CountdownChip({ startsAt }: CountdownChipProps) {
  const [label, setLabel] = useState(() => formatCountdown(startsAt));

  useEffect(() => {
    setLabel(formatCountdown(startsAt));
    const interval = window.setInterval(() => {
      setLabel(formatCountdown(startsAt));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [startsAt]);

  if (!label) {
    return null;
  }

  return <p className="countdown-chip">{label}</p>;
}
