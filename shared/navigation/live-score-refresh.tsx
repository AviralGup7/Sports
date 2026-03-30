"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const LIVE_REFRESH_INTERVAL_MS = 20_000;

export function LiveScoreRefresh() {
  const router = useRouter();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      return;
    }

    const interval = window.setInterval(() => {
      if (document.hidden || !window.navigator.onLine) {
        return;
      }

      router.refresh();
    }, LIVE_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [pathname, router]);

  return null;
}
