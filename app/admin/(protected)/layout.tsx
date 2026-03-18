import { ReactNode } from "react";
import { AdminActionBar } from "@/components/admin-action-bar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdminProfile } from "@/lib/auth";

import { signOutAdminAction } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProtectedLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const { profile } = await requireAdminProfile();

  return (
    <div className="admin-stage">
      <AdminActionBar
        profile={profile}
        onSignOut={
          <form action={signOutAdminAction}>
            <button type="submit" className="button button-ghost">
              Sign out
            </button>
          </form>
        }
      />
      <div className="admin-shell">
        <AdminSidebar profile={profile} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
