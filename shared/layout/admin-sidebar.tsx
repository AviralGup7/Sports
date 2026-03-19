"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Profile } from "@/domain/admin/types";

const adminNav = [
  {
    label: "Run today",
    items: [
      { href: "/admin", title: "Dashboard", meta: "Operations overview" },
      { href: "/admin/matches?mode=live", title: "Live Desk", meta: "Fixtures and results" },
      { href: "/admin/announcements", title: "Notices", meta: "Public and admin feed" }
    ]
  },
  {
    label: "Setup and tools",
    items: [
      { href: "/admin/teams", title: "Teams", meta: "Registry and seeds" },
      { href: "/admin/matches?mode=builder", title: "Builder", meta: "Structure and seeding" },
      { href: "/admin/settings", title: "Settings", meta: "Readiness and exports" }
    ]
  }
];

type AdminSidebarProps = {
  profile: Profile;
};

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname() ?? "";

  return (
    <aside className="admin-sidebar">
      <div className="admin-side-top">
        <p className="eyebrow">Organizer lane</p>
        <h2>Control Stack</h2>
        <p className="muted">
          {profile.name} | {profile.role.replace("_", " ")}
        </p>
      </div>

      <div className="admin-side-signal">
        <span>Access profile</span>
        <strong>{profile.role === "super_admin" ? "Global control" : "Sport scoped"}</strong>
      </div>

      <details className="admin-side-group" open>
        <summary className="admin-side-group-summary">
          <span>Navigation</span>
          <strong>Organized by task</strong>
        </summary>
        <nav className="admin-nav" aria-label="Admin">
          {adminNav.map((group) => (
            <section key={group.label} className="admin-nav-group">
              <p className="eyebrow">{group.label}</p>
              <div className="admin-nav-group-links">
                {group.items.map((item) => {
                  const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href.split("?")[0]);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={active ? "admin-link admin-link-active" : "admin-link"}
                      aria-current={active ? "page" : undefined}
                    >
                      <strong>{item.title}</strong>
                      <span>{item.meta}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
      </details>

      <details className="admin-side-group" open={profile.sportIds.length <= 3}>
        <summary className="admin-side-group-summary">
          <span>Sport scope</span>
          <strong>{profile.sportIds.length > 0 ? `${profile.sportIds.length} lanes` : "All sports"}</strong>
        </summary>
        <div className="admin-sport-pills">
          {profile.sportIds.length > 0 ? (
            profile.sportIds.map((sportId) => (
              <span key={sportId} className="admin-sport-pill">
                {sportId}
              </span>
            ))
          ) : (
            <span className="admin-sport-pill">global scope</span>
          )}
        </div>
      </details>

      <details className="operator-guide-card">
        <summary className="admin-side-group-summary">
          <span>How to use</span>
          <strong>Control-room shortcuts</strong>
        </summary>
        <ul className="operator-guide-list">
          <li>Use Live Desk for day-of result locking.</li>
          <li>Open Bracket Manager before finals if any lane looks unresolved.</li>
          <li>Run an export before big builder or reset actions.</li>
        </ul>
      </details>
    </aside>
  );
}

