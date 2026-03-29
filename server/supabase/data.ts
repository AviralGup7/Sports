import { createClient } from "@supabase/supabase-js";

import { hasSupabaseEnv, supabasePublishableKey, supabaseUrl } from "@/server/supabase/env";

export function createSupabaseDataClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
