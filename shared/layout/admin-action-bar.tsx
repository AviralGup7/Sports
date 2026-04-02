import { ReactNode } from "react";
import Link from "next/link";

import type { Profile } from "@/domain/admin/types";
import { IST_TIME_ZONE } from "@/server/data/formatters";

type AdminActionBarProps = {
  profile: Profile;
  onSignOut: ReactNode;
};

export function AdminActionBar({ profile, onSignOut }: AdminActionBarProps) {
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: IST_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date());

  return (
    <div className="admin-action-bar">
      <div>
        <p className="eyebrow">Admin desk</p>
        <h1>Run the event</h1>
        <p className="muted">Keep live scores, notices, and team updates moving from one clean control lane.</p>
      </div>
      <div className="admin-bar-meta">
        <span className="admin-bar-chip">{currentDate}</span>
        <span className="admin-bar-chip">{profile.role.replace("_", " ")}</span>
        <Link href="/admin/matches?statusFilter=live" className="admin-bar-link">
          Matches
        </Link>
        <Link href="/admin/announcements" className="admin-bar-link">
          Notices
        </Link>
        {onSignOut}
      </div>
    </div>
  );
}

