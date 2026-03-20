type CookieNameRecord = {
  name: string;
};

type CookieDeleteLike = {
  delete: (name: string) => void;
};

const SUPABASE_AUTH_COOKIE_PREFIX = "sb-";

export function isSupabaseAuthCookieName(name: string) {
  return name.startsWith(SUPABASE_AUTH_COOKIE_PREFIX);
}

export function hasSupabaseAuthCookies(cookies: readonly CookieNameRecord[]) {
  return cookies.some((cookie) => isSupabaseAuthCookieName(cookie.name));
}

export function clearSupabaseAuthCookies(cookies: readonly CookieNameRecord[], target: CookieDeleteLike) {
  const uniqueNames = new Set(cookies.map((cookie) => cookie.name).filter(isSupabaseAuthCookieName));

  uniqueNames.forEach((name) => {
    target.delete(name);
  });
}
