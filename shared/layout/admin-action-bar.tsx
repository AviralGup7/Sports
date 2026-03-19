import { ReactNode } from "react";
import Link from "next/link";

import type { Profile } from "@/domain/admin/types";

type AdminActionBarProps = {
  profile: Profile;
  onSignOut: ReactNode;
};

export function AdminActionBar({ profile, onSignOut }: AdminActionBarProps) {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date());

  return (
    <div className="admin-action-bar">
      <div>
        <p className="eyebrow">Control room</p>
        <h1>Organizer Deck</h1>
        <p className="muted">High-priority tournament operations, result locks, and structure control.</p>
      </div>
      <div className="admin-bar-meta">
        <span className="admin-bar-chip">{currentDate}</span>
        <span className="admin-bar-chip">{profile.role.replace("_", " ")}</span>
        <Link href="/admin/matches?mode=live&statusFilter=live" className="admin-bar-link">
          Live desk
        </Link>
        <details className="admin-menu">
          <summary className="admin-menu-trigger">Quick jump</summary>
          <div className="admin-menu-panel">
            <Link href="/admin" className="admin-menu-link">
              Dashboard
            </Link>
            <Link href="/admin/teams" className="admin-menu-link">
              Teams
            </Link>
            <Link href="/admin/matches?mode=live" className="admin-menu-link">
              Matches
            </Link>
            <Link href="/admin/announcements" className="admin-menu-link">
              Notices
            </Link>
            <Link href="/admin/settings" className="admin-menu-link">
              Settings
            </Link>
          </div>
        </details>
        <details className="admin-menu">
          <summary className="admin-menu-trigger">Tools</summary>
          <div className="admin-menu-panel">
            <Link href="/admin/matches?mode=tree" className="admin-menu-link">
              Finals watch
            </Link>
            <Link href="/admin/settings/export/matches" className="admin-menu-link">
              Export data
            </Link>
            <Link href="/admin/announcements" className="admin-menu-link">
              Notice deck
            </Link>
            <Link href="/admin/settings" className="admin-menu-link">
              Backup tools
            </Link>
          </div>
        </details>
        {onSignOut}
      </div>
    </div>
  );
}

