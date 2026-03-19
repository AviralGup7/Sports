"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { GlobalChromeData } from "@/server/data/public/types";
import { formatDateRangeLabel } from "@/server/data/formatters";

import { BrandMark } from "./brand-mark";
import { LiveTicker } from "./live-ticker";

type SiteHeaderProps = {
  chrome: GlobalChromeData;
};

const desktopNav = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/announcements", label: "Notices" },
  { href: "/admin", label: "Admin" }
];

const mobileNav = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/#sports-spotlight", label: "Sports" },
  { href: "/announcements", label: "Notices" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader({ chrome }: SiteHeaderProps) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const rangeLabel = formatDateRangeLabel(chrome.tournament.startDate, chrome.tournament.endDate);

  return (
    <>
      <header className={isAdmin ? "site-header site-header-admin" : "site-header"}>
        <div className="site-header-bar">
          <Link href="/" className="brand" aria-label="Go to tournament home" prefetch>
            <BrandMark />
            <span className="brand-copy">
              <strong>{chrome.tournament.name}</strong>
              <span>{isAdmin ? "Backstage control feed" : `${chrome.tournament.venue} | Cyber arena broadcast`}</span>
            </span>
          </Link>

          <div className="header-status">
            <span className="header-chip">{rangeLabel}</span>
            <span className="header-chip">{chrome.sports.length} sports</span>
            {!isAdmin ? <span className="header-chip header-chip-live">Signal locked</span> : null}
            {!isAdmin ? (
              <Link href="/schedule" className="header-cta">
                Open fixture board
              </Link>
            ) : null}
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary">
          {desktopNav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={active ? "nav-link nav-link-active" : "nav-link"}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {!isAdmin ? <LiveTicker items={chrome.tickerItems} groups={chrome.tickerGroups} /> : null}

      {!isAdmin ? (
        <nav className="mobile-dock" aria-label="Bottom navigation">
          {mobileNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/#")
                  ? pathname === "/"
                  : pathname.startsWith(item.href.replace("/#", "/"));
            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={!item.href.startsWith("/#")}
                className={active ? "mobile-dock-link mobile-dock-link-active" : "mobile-dock-link"}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}

