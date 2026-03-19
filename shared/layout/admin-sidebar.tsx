"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Profile } from "@/domain/admin/types";

const adminNav = [
  { href: "/admin", label: "Dashboard", meta: "Operations overview" },
  { href: "/admin/teams", label: "Teams", meta: "Registry and seeds" },
  { href: "/admin/matches", label: "Matches", meta: "Fixtures and results" },
  { href: "/admin/announcements", label: "Notices", meta: "Public and admin feed" },
  { href: "/admin/settings", label: "Settings", meta: "Readiness and exports" }
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

      <div className="admin-sport-pills">
        {profile.sportIds.map((sportId) => (
          <span key={sportId} className="admin-sport-pill">
            {sportId}
          </span>
        ))}
      </div>

      <nav className="admin-nav" aria-label="Admin">
        {adminNav.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "admin-link admin-link-active" : "admin-link"}
              aria-current={active ? "page" : undefined}
            >
              <strong>{item.label}</strong>
              <span>{item.meta}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

