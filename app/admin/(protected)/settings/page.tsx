import { SettingsScreen } from "@/features/admin/settings/settings-screen";
import { requireAdminProfile } from "@/server/auth";
import { getAdminSettingsData } from "@/server/data/admin/settings-query";

type AdminSettingsPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminSettingsPage({ searchParams }: AdminSettingsPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminSettingsData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return <SettingsScreen data={data} message={params.message} tone={tone} />;
}
