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
  { href: "/standings", label: "Standings" },
  { href: "/schedule", label: "Schedule" },
  { href: "/announcements", label: "Notices" }
];

const mobileNav = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/schedule", label: "Schedule" },
  { href: "/menu", label: "Menu" }
];

export function SiteHeader({ chrome }: SiteHeaderProps) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const rangeLabel = formatDateRangeLabel(chrome.tournament.startDate, chrome.tournament.endDate);
  const sportsActive = pathname.startsWith("/sports/") || pathname === "/teams";
  const menuActive = pathname.startsWith("/sports/") || pathname.startsWith("/announcements") || pathname.startsWith("/teams");
  const currentSectionLabel = isAdmin
    ? "Organizer lane"
    : pathname === "/"
      ? "Home"
      : pathname.startsWith("/standings")
        ? "Standings"
      : pathname.startsWith("/schedule")
        ? "Schedule"
        : pathname.startsWith("/sports/")
          ? "Sports"
          : pathname.startsWith("/teams")
            ? "Teams"
          : pathname.startsWith("/matches/")
            ? "Match Details"
            : pathname.startsWith("/announcements")
              ? "Notices"
              : "Portal";

  return (
    <>
      <header className={isAdmin ? "site-header site-header-admin" : "site-header"}>
        <div className="site-header-bar">
          <Link href="/" className="brand" aria-label="Go to tournament home" prefetch>
            <BrandMark tournament={chrome.tournament} />
            <span className="brand-copy">
              <strong>{chrome.tournament.name}</strong>
              <span>{isAdmin ? "Backstage control feed" : `${chrome.tournament.venue} | Live tournament portal`}</span>
            </span>
          </Link>

          <div className="header-status">
            <span className="header-chip">{rangeLabel}</span>
            <span className="header-chip">{chrome.sports.length} sports</span>
            <span className="header-chip">{currentSectionLabel}</span>
            {!isAdmin ? (
              <Link href="/schedule" className="header-cta">
                View Schedule
              </Link>
            ) : null}
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary">
          {desktopNav.slice(0, 3).map((item) => {
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

          <details className={sportsActive ? "nav-dropdown nav-dropdown-active" : "nav-dropdown"}>
            <summary className={sportsActive ? "nav-dropdown-trigger nav-link nav-link-active" : "nav-dropdown-trigger nav-link"}>Sports</summary>
            <div className="nav-dropdown-panel">
              {chrome.sports.map((sport) => (
                <Link key={sport.id} href={`/sports/${sport.id}`} className="nav-dropdown-link" prefetch>
                  <strong>{sport.name}</strong>
                  <span>{sport.format}</span>
                </Link>
              ))}
              <Link href="/teams" className="nav-dropdown-link" prefetch>
                <strong>Teams</strong>
                <span>Association profiles</span>
              </Link>
            </div>
          </details>

          {desktopNav.slice(3).map((item) => {
            const active = pathname.startsWith(item.href);
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
                : item.href === "/menu"
                  ? menuActive
                  : pathname.startsWith(item.href);
            const href = item.href === "/menu" ? "#" : item.href;
            return (
              item.href === "/menu" ? (
                <details key={item.label} className="mobile-dock-menu">
                  <summary className={active ? "mobile-dock-link mobile-dock-link-active" : "mobile-dock-link"}>
                    <span>{item.label}</span>
                  </summary>
                  <div className="mobile-dock-menu-panel">
                    <Link href="/announcements" className="mobile-dock-menu-link">
                      Notices
                    </Link>
                    {chrome.sports.map((sport) => (
                      <Link key={sport.id} href={`/sports/${sport.id}`} className="mobile-dock-menu-link">
                        {sport.name}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
              <Link
                key={item.label}
                href={href}
                prefetch
                className={active ? "mobile-dock-link mobile-dock-link-active" : "mobile-dock-link"}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.label}</span>
              </Link>
              )
            );
          })}
        </nav>
      ) : null}
    </>
  );
}

