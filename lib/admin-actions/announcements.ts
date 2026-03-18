import { revalidatePath } from "next/cache";

import { requireAdminProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  revalidateAdminShellPaths,
  revalidatePublicTournamentPaths,
  redirectWithMessage,
  slugify,
  toNullableString
} from "./shared";

export async function performUpsertAnnouncement(formData: FormData) {
  await requireAdminProfile();
  const supabase = await createSupabaseServerClient();

  const existingId = toNullableString(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "public");
  const pinned = formData.get("pinned") === "on";
  const isPublished = formData.get("isPublished") === "on";
  const announcementId = existingId ?? `${slugify(title)}-${Date.now()}`;

  if (!title || !body) {
    redirectWithMessage("/admin/announcements", "error", "Announcement title and body are required.");
  }

  const { error } = await supabase.from("announcements").upsert({
    id: announcementId,
    title,
    body,
    visibility,
    pinned,
    is_published: isPublished,
    published_at: new Date().toISOString()
  });

  if (error) {
    redirectWithMessage("/admin/announcements", "error", error.message);
  }

  revalidatePublicTournamentPaths();
  revalidateAdminShellPaths();
  revalidatePath("/admin/announcements");

  redirectWithMessage("/admin/announcements", "success", existingId ? "Announcement updated." : "Announcement created.");
}
