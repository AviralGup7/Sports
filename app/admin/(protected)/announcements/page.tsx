import { AdminAnnouncementsScreen } from "@/features/admin/announcements/announcements-screen";
import { requireAdminProfile } from "@/server/auth";
import { getAdminAnnouncementsData } from "@/server/data/admin/announcements-query";

type AdminAnnouncementsPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminAnnouncementsPage({ searchParams }: AdminAnnouncementsPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminAnnouncementsData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return <AdminAnnouncementsScreen data={data} message={params.message} tone={tone} />;
}
