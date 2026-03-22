import { revalidatePath } from "next/cache";

import { requireAdminProfile } from "@/server/auth";
import { createSupabaseServerClient } from "@/server/supabase/server";

import { ActionValidationError, getBooleanField, getEnumField, getOptionalString, getRequiredString } from "./form-validation";
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
  let existingId: string | null = null;
  let title = "";
  let body = "";
  let visibility: "public" | "admin" = "public";
  let pinned = false;
  let isPublished = false;

  try {
    existingId = getOptionalString(formData, "id");
    title = getRequiredString(formData, "title", "Announcement title");
    body = getRequiredString(formData, "body", "Announcement body");
    visibility = getEnumField(formData, "visibility", ["public", "admin"] as const, "Announcement visibility", "public");
    pinned = getBooleanField(formData, "pinned");
    isPublished = getBooleanField(formData, "isPublished");
  } catch (error) {
    if (error instanceof ActionValidationError) {
      redirectWithMessage("/admin/announcements", "error", error.message);
    }

    throw error;
  }

  const announcementId = existingId ?? `${slugify(title)}-${Date.now()}`;

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

