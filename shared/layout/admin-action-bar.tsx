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
      </div>
      <div className="admin-bar-meta">
        <span className="admin-bar-chip">{currentDate}</span>
        <span className="admin-bar-chip">{profile.role.replace("_", " ")}</span>
        <Link href="/admin/matches" className="admin-bar-link">
          Result queue
        </Link>
        <Link href="/admin/announcements" className="admin-bar-link">
          Notice deck
        </Link>
        {onSignOut}
      </div>
    </div>
  );
}

