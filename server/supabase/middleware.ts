import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSafeSupabaseUser } from "@/server/supabase/auth-user";
import { hasSupabaseEnv, supabasePublishableKey, supabaseUrl } from "@/server/supabase/env";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const { user, invalidSession } = await getSafeSupabaseUser(supabase.auth);

  if (invalidSession) {
    request.cookies.getAll().forEach(({ name }) => {
      if (name.startsWith("sb-")) {
        response.cookies.delete(name);
      }
    });
  }
  let hasOrganizerProfile = false;

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle<{ id: string }>();
    hasOrganizerProfile = Boolean(profile);
  }

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isAdminLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("message", "Please sign in to continue.");
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !isAdminLoginRoute && user && !hasOrganizerProfile) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("status", "error");
    url.searchParams.set("message", "This signed-in account is not linked to organizer access.");
    return NextResponse.redirect(url);
  }

  if (isAdminLoginRoute && user && hasOrganizerProfile) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("message");
    return NextResponse.redirect(url);
  }

  if (isAdminLoginRoute && user && !hasOrganizerProfile && !request.nextUrl.searchParams.has("message")) {
    const url = request.nextUrl.clone();
    url.searchParams.set("status", "error");
    url.searchParams.set("message", "This signed-in account is not linked to organizer access.");
    return NextResponse.redirect(url);
  }

  return response;
}

