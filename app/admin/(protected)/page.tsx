import { DashboardScreen } from "@/features/admin/dashboard/dashboard-screen";
import { requireAdminProfile } from "@/server/auth";
import { getAdminDashboardData } from "@/server/data/admin/dashboard-query";

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminDashboardData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return <DashboardScreen data={data} message={params.message} tone={tone} />;
}
