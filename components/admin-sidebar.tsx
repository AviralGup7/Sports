"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-side-top">
        <p className="eyebrow">Organizer zone</p>
        <h2>Admin Workspace</h2>
        <p className="muted">Mock UI for auth, CRUD, and live data wiring.</p>
      </div>

      <nav className="admin-nav" aria-label="Admin">
        {adminNav.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? "admin-link admin-link-active" : "admin-link"}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
