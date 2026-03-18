import Link from "next/link";

import { ControlPanel } from "@/components/control-panel";
import { MotionIn } from "@/components/motion-in";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminSettingsData } from "@/lib/data";

export default async function AdminSettingsPage() {
  const { profile } = await requireAdminProfile();
  const data = await getAdminSettingsData(profile);

  return (
    <div className="stack-xl">
      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Settings And Readiness</p>
            <h1>Event backup desk</h1>
            <p className="hero-text">Check environment health, verify SQL prep, and keep offline JSON exports ready during the tournament.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">{data.envReady ? "Environment ready" : "Env missing"}</span>
            <span className="operations-chip">{data.exportedAt.slice(0, 10)}</span>
          </div>
        </section>
      </MotionIn>

      <MotionIn className="attention-grid" delay={0.08}>
        <article className="attention-tile tone-success">
          <p>Environment</p>
          <strong>{data.envReady ? "Connected" : "Missing env"}</strong>
          <span>Supabase URL and publishable key are {data.envReady ? "configured." : "not configured yet."}</span>
        </article>
        <article className="attention-tile tone-neutral">
          <p>SQL source</p>
          <strong>Checked in</strong>
          <span>Run `supabase/schema.sql` then `supabase/seed.sql` before production use.</span>
        </article>
        <article className="attention-tile tone-live">
          <p>Export stamp</p>
          <strong>{data.exportedAt.slice(0, 10)}</strong>
          <span>Use the export links below for offline backups during the event.</span>
        </article>
      </MotionIn>

      <MotionIn delay={0.12}>
        <ControlPanel eyebrow="Backup Export" title="JSON downloads" description="Keep an offline mirror of core tournament data during every event day.">
          <div className="quick-tile-grid">
            <Link href="/admin/settings/export/teams" className="quick-tile">
              <strong>Teams JSON</strong>
              <span>Registry, seeds, and status.</span>
            </Link>
            <Link href="/admin/settings/export/matches" className="quick-tile">
              <strong>Matches JSON</strong>
              <span>Fixtures, timings, and status board.</span>
            </Link>
            <Link href="/admin/settings/export/results" className="quick-tile">
              <strong>Results JSON</strong>
              <span>Winner locks, notes, and timestamps.</span>
            </Link>
            <Link href="/admin/settings/export/announcements" className="quick-tile">
              <strong>Announcements JSON</strong>
              <span>Public and admin feed backup.</span>
            </Link>
          </div>
        </ControlPanel>
      </MotionIn>
    </div>
  );
}
