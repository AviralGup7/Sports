import Link from "next/link";

import type { AdminDashboardData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast, EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { BracketPreviewCard, DayNoteBanner, FixtureStrip, NewsBulletin, SportProgressCard, StageSummaryRail } from "@/shared/ui";
import { MotionIn } from "@/shared/motion";

type DashboardScreenProps = {
  data: AdminDashboardData;
  message?: string;
  tone: "info" | "success" | "error";
};

export function DashboardScreen({ data, message, tone }: DashboardScreenProps) {
  return (
    <div className="stack-xl">
      <ActionToast message={message} tone={tone} />

      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Operations Board</p>
            <h1>Control room snapshot</h1>
            <p className="hero-text">Prioritize live boards, pending results, and bracket integrity from a denser cyber control deck tuned for fast tournament operations.</p>
          </div>
          <div className="operations-hero-side">
            {data.attentionItems.slice(0, 2).map((item) => (
              <span key={item.id} className="operations-chip">
                {item.label} {item.value}
              </span>
            ))}
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={message} tone={tone} />

      <MotionIn delay={0.04}>
        <DayNoteBanner note={data.dayNote} />
      </MotionIn>

      <MotionIn className="section-shell" delay={0.06}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Attention</p>
            <h2>Priority tiles</h2>
          </div>
        </div>
        <div className="attention-grid">
          {data.attentionItems.map((item) => (
            <Link key={item.id} href={item.href} className={`attention-card attention-${item.tone}`}>
              <p className="eyebrow">{item.label}</p>
              <strong>{item.value}</strong>
              <span>{item.detail}</span>
            </Link>
          ))}
        </div>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.08}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Stage Progress</p>
            <h2>Active tournament lanes</h2>
          </div>
        </div>
        <StageSummaryRail summaries={data.stageSummaries} />
      </MotionIn>

      <MotionIn className="split-stage" delay={0.09}>
        <ControlPanel eyebrow="Progress Snapshot" title="Per-sport completion" description="Use these compact widgets to see which sports still need result locks or finals resolution.">
          <div className="sport-progress-grid">
            {data.sportProgressCards.map((card) => (
              <SportProgressCard key={card.sport.id} card={card} compact />
            ))}
          </div>
        </ControlPanel>

        <ControlPanel eyebrow="Backup Status" title="Data and export readiness" description="Keep one eye on live-read health before a busy operations run.">
          <div className="backup-status-card">
            <div className={data.backupStatus.envReady ? "status-banner status-banner-success" : "status-banner status-banner-error"}>
              {data.backupStatus.envReady ? "Supabase environment is available for this deployment." : "Supabase environment variables are missing for this deployment."}
            </div>
            <div className={data.backupStatus.usingFallbackData ? "status-banner status-banner-alert" : "status-banner status-banner-success"}>
              {data.backupStatus.usingFallbackData
                ? "The app is currently rendering fallback tournament data."
                : "The app is reading live tournament data from Supabase."}
            </div>
            <p className="muted">{data.backupStatus.note}</p>
            <div className="admin-quick-actions">
              <Link href="/admin/settings" className="button button-ghost">
                Open backup tools
              </Link>
              <Link href="/admin/settings/export/matches" className="button button-ghost">
                Export fixtures
              </Link>
            </div>
          </div>
        </ControlPanel>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bracket Preview</p>
            <h2>Finals watch and compact trees</h2>
          </div>
        </div>
        <div className="bracket-preview-grid">
          {data.bracketPreviewCards.length > 0 ? (
            data.bracketPreviewCards.map((card) => <BracketPreviewCard key={card.sport.id} card={card} />)
          ) : (
            <EmptyState compact eyebrow="Bracket Preview" title="Bracket previews are waiting" description="Link knockout lanes and finals routing to unlock compact previews here." />
          )}
        </div>
      </MotionIn>

      <MotionIn className="split-stage" delay={0.1}>
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
    </div>
  );
}
