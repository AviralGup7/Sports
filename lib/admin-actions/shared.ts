import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toNullableString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function redirectWithMessage(path: string, tone: "success" | "error", message: string) {
  const encodedMessage = encodeURIComponent(message);
  redirect(`${path}?status=${tone}&message=${encodedMessage}`);
}

export function revalidatePublicTournamentPaths() {
  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/announcements");
}

export function revalidateAdminShellPaths() {
  revalidatePath("/admin");
}
