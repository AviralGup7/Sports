"use client";

import { useState } from "react";

type ShareMatchButtonProps = {
  href: string;
  title: string;
  compact?: boolean;
};

export function ShareMatchButton({ href, title, compact = false }: ShareMatchButtonProps) {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  const handleShare = async () => {
    try {
      const url = new URL(href, window.location.origin).toString();

      if (navigator.share) {
        await navigator.share({
          title,
          url
        });
      } else {
        await navigator.clipboard.writeText(url);
      }

      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <button type="button" onClick={handleShare} className={compact ? "share-button share-button-compact" : "share-button"}>
      {status === "done" ? "Link Copied" : status === "error" ? "Share Failed" : "Share This Match"}
    </button>
  );
}
