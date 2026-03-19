import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { hasSupabaseEnv, supabasePublishableKey, supabaseUrl } from "@/server/supabase/env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are missing.");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components may attempt to write cookies during render.
        }
      }
    }
  });
}

