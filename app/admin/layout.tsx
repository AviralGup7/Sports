import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-content">{children}</div>
    </div>
  );
}
