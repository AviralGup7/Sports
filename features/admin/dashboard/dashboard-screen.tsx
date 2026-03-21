import Link from "next/link";

import type { AdminDashboardData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast, EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { DayNoteBanner, FixtureStrip, NewsBulletin } from "@/shared/ui";
import { MotionIn } from "@/shared/motion";

import { AdminAiCommandPanel } from "@/features/admin/assistant/components/admin-ai-command-panel";

type DashboardScreenProps = {
  data: AdminDashboardData;
  message?: string;
  tone: "info" | "success" | "error";
};

export function DashboardScreen({ data, message, tone }: DashboardScreenProps) {
  const liveCount = data.attentionItems.find((item) => item.id === "live-matches")?.value ?? "0";
  const pendingCount = data.attentionItems.find((item) => item.id === "pending-results")?.value ?? "0";

  return (
    <div className="stack-xl">
      <ActionToast message={message} tone={tone} />

      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Admin home</p>
            <h1>Run today from one place</h1>
            <p className="hero-text">Start with the AI desk, keep an eye on live boards, and jump into notices or matches only when you need a full editor.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Live {liveCount}</span>
            <span className="operations-chip">Pending {pendingCount}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={message} tone={tone} />

      <MotionIn className="admin-summary-grid" delay={0.03}>
        <article className="admin-summary-card">
          <p className="eyebrow">Live now</p>
          <strong>{liveCount}</strong>
          <span>Boards active right now</span>
        </article>
        <article className="admin-summary-card">
          <p className="eyebrow">Pending</p>
          <strong>{pendingCount}</strong>
          <span>Boards still needing action</span>
        </article>
        <article className="admin-summary-card">
          <p className="eyebrow">Notices</p>
          <strong>{data.stats.announcements}</strong>
          <span>Published or draft updates</span>
        </article>
        <article className="admin-summary-card">
          <p className="eyebrow">Data</p>
          <strong>{data.backupStatus.usingFallbackData ? "Seed" : "Live"}</strong>
          <span>{data.backupStatus.usingFallbackData ? "Fallback snapshot active" : "Supabase connected"}</span>
        </article>
      </MotionIn>

      <MotionIn className="split-stage" delay={0.04}>
        <ControlPanel eyebrow="AI Desk" title="Type a task instead of hunting for a form" description="Use one command to write notices, move fixtures, or update match state.">
          <AdminAiCommandPanel
            redirectTo="/admin"
            recentMatches={data.todaysMatches.length > 0 ? data.todaysMatches : data.pendingResults}
            recentAnnouncements={data.announcements}
          />
        </ControlPanel>

        <ControlPanel eyebrow="Quick jumps" title="Open the full tool only when needed" description="These links keep the admin side lighter for day-of work.">
          <div className="quick-tile-grid">
            <Link href="/admin/matches?mode=live" className="quick-tile">
              <strong>Matches</strong>
              <span>Run live boards, score updates, and time changes.</span>
            </Link>
            <Link href="/admin/announcements" className="quick-tile">
              <strong>Notices</strong>
              <span>Open the full composer and edit published updates.</span>
            </Link>
            <Link href="/admin/teams" className="quick-tile">
              <strong>Teams</strong>
              <span>Maintain the registry and team-sport setup.</span>
            </Link>
            <Link href="/admin/settings" className="quick-tile">
              <strong>Settings</strong>
              <span>Handle exports, resets, and deployment readiness.</span>
            </Link>
            <Link href="/admin/assistant" className="quick-tile">
              <strong>Groq AI desk</strong>
              <span>Connect your own API key and turn plain language into admin actions.</span>
            </Link>
          </div>
        </ControlPanel>
      </MotionIn>

      <MotionIn delay={0.05}>
        <DayNoteBanner note={data.dayNote} />
      </MotionIn>

      <MotionIn className="split-stage" delay={0.08}>
        <ControlPanel eyebrow="Today" title="Today's boards" description="Fixtures that matter most for the current operations cycle.">
          <div className="fixture-stack">
            {data.todaysMatches.length > 0 ? (
              data.todaysMatches.map((match) => <FixtureStrip key={match.id} match={match} admin />)
            ) : (
              <EmptyState compact eyebrow="Today" title="No fixtures today" description="Seed or reschedule boards to populate the daily operations queue." />
            )}
          </div>
        </ControlPanel>

        <div className="stack-lg">
          <ControlPanel eyebrow="Pending Results" title="Unresolved boards" description="Matches still waiting on a final result, live closeout, or postponement resolution." dense>
            <div className="fixture-stack">
              {data.pendingResults.length > 0 ? (
                data.pendingResults.map((match) => <FixtureStrip key={match.id} match={match} admin />)
              ) : (
                <EmptyState compact eyebrow="Pending Results" title="Result queue is clear" description="There are no unresolved boards in the current admin view." />
              )}
            </div>
          </ControlPanel>

          <ControlPanel eyebrow="Recent Notices" title="Editorial feed" description="Latest announcement activity from the control room." dense>
            <div className="news-feed">
              {data.announcements.length > 0 ? (
                data.announcements.map((announcement) => <NewsBulletin key={announcement.id} announcement={announcement} compact showAdminMeta />)
              ) : (
                <EmptyState compact eyebrow="Notices" title="No announcements yet" description="Compose a bulletin to populate the editorial feed." />
              )}
            </div>
          </ControlPanel>
        </div>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">System</p>
            <h2>Data readiness</h2>
          </div>
        </div>
        <div className="backup-status-card">
          <div className={data.backupStatus.envReady ? "status-banner status-banner-success" : "status-banner status-banner-error"}>
            {data.backupStatus.envReady ? "Supabase environment is connected." : "Supabase environment variables are missing."}
          </div>
          <div className={data.backupStatus.usingFallbackData ? "status-banner status-banner-alert" : "status-banner status-banner-success"}>
            {data.backupStatus.usingFallbackData ? "Fallback tournament snapshot is active." : "Live tournament data is active."}
          </div>
          <p className="muted">{data.backupStatus.note}</p>
        </div>
      </MotionIn>
    </div>
  );
}
