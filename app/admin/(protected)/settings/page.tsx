import Link from "next/link";

import { requireAdminProfile } from "@/lib/auth";
import { getAdminSettingsData } from "@/lib/data";

export default async function AdminSettingsPage() {
  const { profile } = await requireAdminProfile();
  const data = await getAdminSettingsData(profile);

  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin settings</p>
        <h1>Readiness And Export</h1>
        <p>Check environment readiness, apply SQL, and export core tournament data for backup.</p>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="eyebrow">Environment</p>
          <h2>{data.envReady ? "Connected" : "Missing env"}</h2>
          <p>Supabase URL and publishable key are {data.envReady ? "configured in the project environment." : "not configured yet."}</p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">SQL source</p>
          <h2>Checked in</h2>
          <p>Apply `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL editor before going live.</p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Export timestamp</p>
          <h2>{data.exportedAt.slice(0, 10)}</h2>
          <p>Use the export links below for offline backups during the event.</p>
        </article>
      </section>

      <section className="editor-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Backup export</p>
            <h2>JSON downloads</h2>
          </div>
        </div>
        <div className="chip-row">
          <Link href="/admin/settings/export/teams" className="chip chip-active">Teams JSON</Link>
          <Link href="/admin/settings/export/matches" className="chip chip-active">Matches JSON</Link>
          <Link href="/admin/settings/export/results" className="chip chip-active">Results JSON</Link>
          <Link href="/admin/settings/export/announcements" className="chip chip-active">Announcements JSON</Link>
        </div>
      </section>
    </div>
  );
}
