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
          Pending results
        </Link>
        <Link href="/admin/matches?mode=tree" className="admin-bar-link">
          Finals watch
        </Link>
        <Link href="/admin/settings/export/matches" className="admin-bar-link">
          Export data
        </Link>
        <Link href="/admin/announcements" className="admin-bar-link">
          Notice deck
        </Link>
        <Link href="/admin/settings" className="admin-bar-link">
          Backup tools
        </Link>
        {onSignOut}
      </div>
    </div>
  );
}

