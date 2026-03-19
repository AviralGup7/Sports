import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  revalidatePath("/admin");
  redirect("/admin");
}

export async function performAdminSignOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login?status=success&message=Signed%20out.");
}

