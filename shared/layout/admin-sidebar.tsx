"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Profile } from "@/domain/admin/types";

const adminNav = [
  { href: "/admin", title: "Dashboard", meta: "Today and priorities" },
  { href: "/admin/assistant", title: "AI Desk", meta: "Type one command" },
  { href: "/admin/matches?mode=live", title: "Matches", meta: "Fixtures and results" },
  { href: "/admin/announcements", title: "Notices", meta: "Write and publish" },
  { href: "/admin/teams", title: "Teams", meta: "Registry and seeds" },
  { href: "/admin/settings", title: "Settings", meta: "Exports and resets" }
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
        <h2>Simple admin</h2>
        <p className="muted">
          {profile.name} | {profile.role.replace("_", " ")}
        </p>
      </div>

      <div className="admin-side-signal">
        <span>Access profile</span>
        <strong>{profile.role === "super_admin" ? "Global control" : "Sport scoped"}</strong>
      </div>

      <nav className="admin-nav" aria-label="Admin">
        {adminNav.map((item) => {
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
      </nav>

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
    </aside>
  );
}

