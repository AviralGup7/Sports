"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { GlobalChromeData } from "@/server/data/public/types";
import { formatDateRangeLabel } from "@/server/data/formatters";

import { BrandMark } from "./brand-mark";

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
          <div className="footer-brand-lockup">
            <BrandMark tournament={chrome.tournament} />
          </div>
          <h2>{chrome.tournament.name}</h2>
          <p>{formatDateRangeLabel(chrome.tournament.startDate, chrome.tournament.endDate)} at {chrome.tournament.venue}</p>
        </section>

        <section className="site-footer-card">
          <p className="eyebrow">Organiser</p>
          <h2>Inter Cultural Assoc Sports League Committee</h2>
          <p>Official public portal for fixtures, standings, notices, and match updates during the tournament.</p>
          <div className="stack-sm">
            {chrome.tournament.contacts.map((contact) => (
              <p key={contact.id}>
                {contact.name}{contact.role ? `, ${contact.role}` : ""}
              </p>
            ))}
          </div>
        </section>

        <section className="site-footer-card">
          <p className="eyebrow">Queries</p>
          <h2>Need help?</h2>
          <p>Check the latest notices first, then reach the organising team for event-day queries and coordination support.</p>
          <p>Venue desk: {chrome.tournament.venue}, main entry control booth</p>
          {chrome.tournament.contacts.map((contact) => (
            <p key={contact.id}>
              {contact.name}: <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="inline-link">{contact.phone}</a>
            </p>
          ))}
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
