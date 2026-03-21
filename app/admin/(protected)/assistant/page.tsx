import { AdminAssistantScreen } from "@/features/admin/assistant/assistant-screen";
import { requireAdminProfile } from "@/server/auth";
import { getAdminDashboardData } from "@/server/data/admin/dashboard-query";

type AdminAssistantPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminAssistantPage({ searchParams }: AdminAssistantPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminDashboardData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return <AdminAssistantScreen data={data} message={params.message} tone={tone} />;
}
