import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdminProfile } from "@/lib/auth";

import { signOutAdminAction } from "../actions";

export default async function AdminProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = await requireAdminProfile();

  return (
    <div className="admin-shell">
      <div className="stack-lg">
        <AdminSidebar profile={profile} />
        <form action={signOutAdminAction}>
          <button type="submit" className="button button-ghost full-width">
            Sign out
          </button>
        </form>
      </div>
      <div className="admin-content">{children}</div>
    </div>
  );
}
