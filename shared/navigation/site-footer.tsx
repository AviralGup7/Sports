"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { GlobalChromeData } from "@/server/data/public/types";
import { formatDateRangeLabel } from "@/server/data/formatters";

type SiteFooterProps = {
  chrome: GlobalChromeData;
};

export function SiteFooter({ chrome }: SiteFooterProps) {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="site-footer" aria-label="Tournament footer">
      <div className="site-footer-grid">
        <section className="site-footer-card">
          <p className="eyebrow">Event</p>
          <h2>{chrome.tournament.name}</h2>
          <p>{formatDateRangeLabel(chrome.tournament.startDate, chrome.tournament.endDate)} at {chrome.tournament.venue}</p>
        </section>

        <section className="site-footer-card">
          <p className="eyebrow">Organiser</p>
          <h2>IASL Organising Committee</h2>
          <p>Official public portal for fixtures, standings, notices, and match updates during the tournament.</p>
        </section>

        <section className="site-footer-card">
          <p className="eyebrow">Queries</p>
          <h2>Need help?</h2>
          <p>Check the latest notices first, then contact the tournament help desk at the venue for event-day queries.</p>
          <div className="site-footer-links">
            <Link href="/announcements" className="inline-link">
              Notices & Alerts
            </Link>
            <Link href="/schedule" className="inline-link">
              View Schedule
            </Link>
          </div>
        </section>
      </div>
    </footer>
  );
}
