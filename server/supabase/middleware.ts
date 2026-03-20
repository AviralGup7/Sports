import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSafeSupabaseUser } from "@/server/supabase/auth-user";
import { clearSupabaseAuthCookies, hasSupabaseAuthCookies } from "@/server/supabase/auth-cookies";
import { hasSupabaseEnv, supabasePublishableKey, supabaseUrl } from "@/server/supabase/env";

function redirectToLogin(request: NextRequest, message: string, status?: "error") {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("message", message);

  if (status) {
    url.searchParams.set("status", status);
  }

  return NextResponse.redirect(url);
}

function withClearedAuthCookies(response: NextResponse, request: NextRequest, shouldClear: boolean) {
  if (shouldClear) {
    clearSupabaseAuthCookies(request.cookies.getAll(), response.cookies);
  }

  return response;
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv()) {
    return NextResponse.next({ request });
  }

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname === "/admin/login";
  const authCookies = request.cookies.getAll();

  if (!hasSupabaseAuthCookies(authCookies)) {
    if (isAdminRoute && !isAdminLoginRoute) {
      return redirectToLogin(request, "Please sign in to continue.");
    }

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
  const shouldClearAuthCookies = invalidSession;
  let hasOrganizerProfile = false;

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle<{ id: string }>();
    hasOrganizerProfile = Boolean(profile);
  }

  if (isAdminRoute && !isAdminLoginRoute && !user) {
    return withClearedAuthCookies(redirectToLogin(request, "Please sign in to continue."), request, shouldClearAuthCookies);
  }

  if (isAdminRoute && !isAdminLoginRoute && user && !hasOrganizerProfile) {
    return withClearedAuthCookies(
      redirectToLogin(request, "This signed-in account is not linked to organizer access.", "error"),
      request,
      shouldClearAuthCookies
    );
  }

  if (isAdminLoginRoute && user && hasOrganizerProfile) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("message");
    return withClearedAuthCookies(NextResponse.redirect(url), request, shouldClearAuthCookies);
  }

  if (isAdminLoginRoute && user && !hasOrganizerProfile && !request.nextUrl.searchParams.has("message")) {
    return withClearedAuthCookies(
      redirectToLogin(request, "This signed-in account is not linked to organizer access.", "error"),
      request,
      shouldClearAuthCookies
    );
  }

  return withClearedAuthCookies(response, request, shouldClearAuthCookies);
}

