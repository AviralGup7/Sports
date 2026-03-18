"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GlobalChromeData } from "@/lib/types";

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
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const rangeLabel = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric"
  }).formatRange(new Date(chrome.tournament.startDate), new Date(chrome.tournament.endDate));

  return (
    <>
      <header className={isAdmin ? "site-header site-header-admin" : "site-header"}>
        <div className="site-header-bar">
          <Link href="/" className="brand" aria-label="Go to tournament home">
            <span className="brand-mark">IASL</span>
            <span className="brand-copy">
              <strong>{chrome.tournament.name}</strong>
              <span>{isAdmin ? "Backstage control feed" : `${chrome.tournament.venue} | Arena broadcast mode`}</span>
            </span>
          </Link>

          <div className="header-status">
            <span className="header-chip">{rangeLabel}</span>
            <span className="header-chip">{chrome.sports.length} sports</span>
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
              <Link key={item.href} href={item.href} className={active ? "nav-link nav-link-active" : "nav-link"}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {!isAdmin ? <LiveTicker items={chrome.tickerItems} /> : null}

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
              <Link key={item.label} href={item.href} className={active ? "mobile-dock-link mobile-dock-link-active" : "mobile-dock-link"}>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      ) : null}
    </>
  );
}
