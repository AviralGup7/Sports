"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import type { GlobalChromeData } from "@/server/data/public/types";

import { BrandMark } from "./brand-mark";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuId = useId();
  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const sportsActive = pathname.startsWith("/sports/") || pathname === "/teams";
  const menuActive = pathname.startsWith("/sports/") || pathname.startsWith("/announcements") || pathname.startsWith("/teams");
  const mobileMenuItems = [
    { href: "/announcements", label: "Notices" },
    { href: "/teams", label: "Teams" },
    ...chrome.sports.map((sport) => ({
      href: `/sports/${sport.id}`,
      label: sport.name
    }))
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className={isAdmin ? "site-header site-header-admin" : "site-header"}>
        {!isAdmin ? <div className="site-header-sponsor">Sponsored by Midtown and Dark Park</div> : null}
        <div className="site-header-bar">
          <Link href="/" className="brand" aria-label="Go to tournament home" prefetch>
            <BrandMark tournament={chrome.tournament} />
            <span className="brand-copy">
              <strong>{isHome ? "ICL Portal" : chrome.tournament.name}</strong>
              <span>{isAdmin ? "Backstage control feed" : chrome.tournament.venue}</span>
            </span>
          </Link>

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
      {!isAdmin ? (
        <nav className="mobile-dock" aria-label="Bottom navigation">
          {mobileNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/menu"
                  ? menuActive || menuOpen
                  : pathname.startsWith(item.href);

            if (item.href === "/menu") {
              return (
                <div key={item.label} className="mobile-dock-menu">
                  <button
                    type="button"
                    className={active ? "mobile-dock-link mobile-dock-link-active mobile-dock-menu-button" : "mobile-dock-link mobile-dock-menu-button"}
                    aria-expanded={menuOpen}
                    aria-controls={mobileMenuId}
                    aria-label="Open sports and notices menu"
                    onClick={() => setMenuOpen((current) => !current)}
                  >
                    <span>{item.label}</span>
                  </button>
                  <div id={mobileMenuId} className={menuOpen ? "mobile-dock-menu-panel mobile-dock-menu-panel-open" : "mobile-dock-menu-panel"} hidden={!menuOpen}>
                    {mobileMenuItems.map((menuItem) => (
                      <Link key={menuItem.href} href={menuItem.href} className="mobile-dock-menu-link" onClick={() => setMenuOpen(false)}>
                        {menuItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch
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
