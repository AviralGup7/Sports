"use client";
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
          <div className="footer-brand-lockup">
            <BrandMark tournament={chrome.tournament} />
          </div>
          <h2>{chrome.tournament.name}</h2>
          <p>{formatDateRangeLabel(chrome.tournament.startDate, chrome.tournament.endDate)} at {chrome.tournament.venue}</p>
          <div className="stack-sm">
            {chrome.tournament.contacts.map((contact) => (
              <p key={contact.id}>
                {contact.name}
                {contact.role ? `, ${contact.role}` : ""}:{" "}
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="inline-link">
                  {contact.phone}
                </a>
              </p>
            ))}
          </div>
        </section>
      </div>
    </footer>
  );
}
