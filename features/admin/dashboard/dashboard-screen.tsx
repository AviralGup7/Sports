import Link from "next/link";

import type { AdminDashboardData } from "@/server/data/admin/types";
import { ActionNotice, EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { FixtureStrip, NewsBulletin, StageSummaryRail } from "@/shared/ui";
import { MotionIn } from "@/shared/motion";

type DashboardScreenProps = {
  data: AdminDashboardData;
  message?: string;
  tone: "info" | "success" | "error";
};

export function DashboardScreen({ data, message, tone }: DashboardScreenProps) {
  return (
    <div className="stack-xl">
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
