import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Profile, SportSlug } from "@/lib/types";

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: "super_admin" | "sport_admin";
};

type AdminSportRow = {
  sport_id: SportSlug;
};

export async function getAdminProfile() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (profileError || !profileRow) {
    return null;
  }

  const { data: adminSports, error: adminSportsError } = await supabase
    .from("admin_sports")
    .select("sport_id")
    .eq("profile_id", user.id)
    .returns<AdminSportRow[]>();

  if (adminSportsError) {
    return null;
  }

  const profile: Profile = {
    id: profileRow.id,
    name: profileRow.name ?? user.user_metadata?.name ?? "Organizer",
    email: profileRow.email ?? user.email ?? "",
    role: profileRow.role,
    sportIds: profileRow.role === "super_admin" ? ["cricket", "football", "volleyball", "athletics"] : adminSports.map((item) => item.sport_id)
  };

  return {
    user,
    profile,
    supabase
  };
}

export async function requireAdminProfile() {
  const context = await getAdminProfile();

  if (!context) {
    redirect("/admin/login?message=Please sign in with an organizer account.");
  }

  return context;
}

export function canManageSport(profile: Profile, sportId: SportSlug) {
  return profile.role === "super_admin" || profile.sportIds.includes(sportId);
}
