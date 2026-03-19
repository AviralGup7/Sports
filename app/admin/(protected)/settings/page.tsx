import { SettingsScreen } from "@/features/admin/settings/settings-screen";
import { requireAdminProfile } from "@/server/auth";
import { getAdminSettingsData } from "@/server/data/admin/settings-query";

export default async function AdminSettingsPage() {
  const { profile } = await requireAdminProfile();
  const data = await getAdminSettingsData(profile);

  return <SettingsScreen data={data} />;
}
