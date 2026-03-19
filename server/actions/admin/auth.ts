import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeSupabaseUser } from "@/server/supabase/auth-user";
import { createSupabaseServerClient } from "@/server/supabase/server";

import { redirectWithMessage } from "./shared";

export async function performAdminLogin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectWithMessage("/admin/login", "error", error.message);
  }

  const { user } = await getSafeSupabaseUser(supabase.auth);

  if (!user) {
    redirectWithMessage("/admin/login", "error", "The session could not be established. Please try again.");
  }

  const userId = user?.id;

  if (!userId) {
    redirectWithMessage("/admin/login", "error", "The session could not be established. Please try again.");
  }

  const { data: profile } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle<{ id: string }>();

  if (!profile) {
    await supabase.auth.signOut();
    redirectWithMessage("/admin/login", "error", "This account is authenticated but is not linked to organizer access.");
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function performAdminSignOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login?status=success&message=Signed%20out.");
}

