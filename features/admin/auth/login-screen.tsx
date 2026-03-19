import { loginAdminAction } from "@/app/admin/actions";
import { ActionNotice } from "@/shared/feedback";

type LoginScreenProps = {
  envReady: boolean;
  message?: string;
  tone: "info" | "success" | "error";
};

export function LoginScreen({ envReady, message, tone }: LoginScreenProps) {
  return (
    <div className="auth-shell">
      <section className="backstage-card">
        <div className="backstage-copy">
          <p className="eyebrow">Protected Organizer Area</p>
          <h1>Backstage access</h1>
          <p className="hero-text">Sign in with a pre-created organizer account to run fixture control, results, announcements, and exports.</p>
          {!envReady ? (
            <ActionNotice
              message="Supabase environment variables are missing on this deployment. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel."
              tone="error"
            />
          ) : null}
          <ActionNotice message={message} tone={tone} />
        </div>

        <form action={loginAdminAction} className="backstage-form">
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required placeholder="lead@college.edu" autoComplete="email" />
          </label>
          <label className="field">
            <span>Password</span>
            <input name="password" type="password" required placeholder="********" autoComplete="current-password" />
          </label>
          <button type="submit" className="button" disabled={!envReady}>
            Sign in to control room
          </button>
        </form>
      </section>
    </div>
  );
}
