import type { User } from "@supabase/supabase-js";

type AuthClientLike = {
  getUser: () => Promise<{
    data: { user: User | null };
    error: Error | null;
  }>;
};

export type SafeUserResult = {
  user: User | null;
  invalidSession: boolean;
};

function isInvalidRefreshTokenError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("refresh token not found") ||
    message.includes("invalid refresh token") ||
    message.includes("auth session missing")
  );
}

export async function getSafeSupabaseUser(auth: AuthClientLike): Promise<SafeUserResult> {
  try {
    const result = await auth.getUser();

    if (result.error) {
      if (isInvalidRefreshTokenError(result.error)) {
        return { user: null, invalidSession: true };
      }

      throw result.error;
    }

    return {
      user: result.data.user,
      invalidSession: false
    };
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      return { user: null, invalidSession: true };
    }

    throw error;
  }
}
