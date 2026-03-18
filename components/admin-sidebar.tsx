"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Profile } from "@/lib/types";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/settings", label: "Settings" }
];

type AdminSidebarProps = {
  profile: Profile;
};

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-side-top">
        <p className="eyebrow">Organizer zone</p>
        <h2>Admin Workspace</h2>
        <p className="muted">{profile.name} · {profile.role.replace("_", " ")}</p>
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
