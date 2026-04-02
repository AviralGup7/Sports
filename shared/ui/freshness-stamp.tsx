"use client";

import { useEffect, useState } from "react";

import { IST_TIME_ZONE } from "@/server/data/formatters";

type FreshnessStampProps = {
  generatedAt: string;
  prefix?: string;
};

function formatRelative(generatedAt: string) {
  const diffMs = Date.now() - new Date(generatedAt).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return "just now";
  }

  if (diffMinutes === 1) {
    return "1 min ago";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) {
    return "1 hour ago";
  }

  return `${diffHours} hours ago`;
}

function formatAbsolute(generatedAt: string) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: IST_TIME_ZONE,
    timeZoneName: "short"
  }).format(new Date(generatedAt));
}

export function FreshnessStamp({ generatedAt, prefix = "Last updated" }: FreshnessStampProps) {
  const [label, setLabel] = useState("recently");
  const absoluteLabel = formatAbsolute(generatedAt);

  useEffect(() => {
    setLabel(formatRelative(generatedAt));
    const interval = window.setInterval(() => {
      setLabel(formatRelative(generatedAt));
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, [generatedAt]);

  return <p className="freshness-stamp" title={absoluteLabel}>{prefix} {label}</p>;
}
