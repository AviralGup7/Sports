import { ActionNotice } from "@/components/action-notice";
import { hasSupabaseEnv } from "@/lib/supabase/env";

import { loginAdminAction } from "../actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminLoginPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = (await searchParams) ?? {};
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";
  const envReady = hasSupabaseEnv();

  return (
    <div className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Protected organizer area</p>
        <h1>Admin Login</h1>
        <p className="hero-text">Use your pre-created organizer account to manage teams, fixtures, results, and announcements.</p>
        {!envReady ? (
          <ActionNotice
            message="Supabase environment variables are missing on this deployment. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel."
            tone="error"
          />
        ) : null}
        <ActionNotice message={params.message} tone={tone} />
        <form action={loginAdminAction} className="stack-lg">
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required placeholder="lead@college.edu" />
          </label>
          <label className="field">
            <span>Password</span>
            <input name="password" type="password" required placeholder="********" />
          </label>
          <button type="submit" className="button" disabled={!envReady}>
            Sign in
          </button>
        </form>
      </section>
    </div>
  );
}
