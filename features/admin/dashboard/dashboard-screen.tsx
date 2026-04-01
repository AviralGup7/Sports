import Link from "next/link";

import type { AdminDashboardData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast, EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { DayNoteBanner, FixtureStrip, NewsBulletin } from "@/shared/ui";
import { MotionIn } from "@/shared/motion";

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
            <p className="hero-text">Start with the live desk, keep notices tight, and leave the public site clean and explicit.</p>
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
          <span>Boards still needing a saved result</span>
        </article>
        <article className="admin-summary-card">
          <p className="eyebrow">Notices</p>
          <strong>{data.stats.announcements}</strong>
          <span>Published or draft updates</span>
        </article>
      </MotionIn>

      <MotionIn className="split-stage" delay={0.04}>
        <ControlPanel eyebrow="Quick jumps" title="Open the right desk fast" description="Keep day-of work focused on the few screens staff actually need.">
          <div className="quick-tile-grid">
            <Link href="/admin/matches" className="quick-tile">
              <strong>Live Desk</strong>
              <span>Update scores, statuses, and completed results.</span>
            </Link>
            <Link href="/admin/announcements" className="quick-tile">
              <strong>Notices</strong>
              <span>Publish a short update for players and spectators.</span>
            </Link>
            <Link href="/admin/teams" className="quick-tile">
              <strong>Teams</strong>
              <span>Review the registry and team participation.</span>
            </Link>
            <Link href="/admin/settings" className="quick-tile">
              <strong>Settings</strong>
              <span>Handle resets, exports, and back-office tasks.</span>
            </Link>
          </div>
        </ControlPanel>

        <ControlPanel eyebrow="Today" title="Current focus" description="Keep an eye on the boards and notices that need immediate attention.">
          <DayNoteBanner note={data.dayNote} />
        </ControlPanel>
      </MotionIn>

      <MotionIn className="split-stage" delay={0.08}>
        <ControlPanel eyebrow="Today" title="Today's boards" description="Fixtures that matter most for the current operations cycle.">
          <div className="fixture-stack">
            {data.todaysMatches.length > 0 ? (
              data.todaysMatches.map((match) => <FixtureStrip key={match.id} match={match} admin />)
            ) : (
              <EmptyState compact eyebrow="Today" title="No fixtures today" description="No matches are scheduled for the current day." />
            )}
          </div>
        </ControlPanel>

        <div className="stack-lg">
          <ControlPanel eyebrow="Pending Results" title="Unresolved boards" description="Matches still waiting on a final result or status update." dense>
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
    </div>
  );
}
