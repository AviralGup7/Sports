"use client";

import { createBrowserClient } from "@supabase/ssr";

import { hasSupabaseEnv, supabasePublishableKey, supabaseUrl } from "@/server/supabase/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}

