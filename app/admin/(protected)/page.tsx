import Link from "next/link";

import { ActionNotice } from "@/components/action-notice";
import { ControlPanel } from "@/components/control-panel";
import { EmptyState } from "@/components/empty-state";
import { FixtureStrip } from "@/components/fixture-strip";
import { MotionIn } from "@/components/motion-in";
import { NewsBulletin } from "@/components/news-bulletin";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";

type AdminDashboardPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminDashboardData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";

  return (
    <div className="stack-xl">
      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Operations Snapshot</p>
            <h1>Control room focus</h1>
            <p className="hero-text">Urgent match work first, setup work second. Keep scores moving, brackets correct, and the public board clean.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Pending {data.pendingResults.length}</span>
            <span className="operations-chip">Visible matches {data.stats.matches}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={params.message} tone={tone} />

      <MotionIn className="attention-grid" delay={0.08}>
        {data.attentionItems.map((item) => (
          <Link key={item.id} href={item.href} className={`attention-tile tone-${item.tone}`}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.detail}</span>
          </Link>
        ))}
      </MotionIn>

      <MotionIn className="admin-two-speed" delay={0.12}>
        <ControlPanel
          eyebrow="Urgent Work"
          title="Today's fixture deck"
          description="Jump into the boards most likely to need a score save or status change."
          actions={
            <Link href="/admin/matches" className="inline-link">
              Open match control
            </Link>
          }
        >
          <div className="fixture-stack">
            {data.todaysMatches.length > 0 ? (
              data.todaysMatches.map((match) => <FixtureStrip key={match.id} match={match} showSport admin />)
            ) : (
              <EmptyState
                compact
                eyebrow="Urgent Work"
                title="No fixtures on today’s deck"
                description="Seed matches or adjust day filters in the match control area to populate this queue."
                action={
                  <Link href="/admin/matches" className="button button-ghost">
                    Open match control
                  </Link>
                }
              />
            )}
          </div>
        </ControlPanel>

        <div className="stack-lg">
          <ControlPanel
            eyebrow="Setup"
            title="Quick links"
            description="Jump to the areas most organizers touch throughout the day."
            dense
          >
            <div className="quick-tile-grid">
              <Link href="/admin/teams" className="quick-tile">
                <strong>Teams</strong>
                <span>Create, edit, archive, and reseed squads.</span>
              </Link>
              <Link href="/admin/matches" className="quick-tile">
                <strong>Matches</strong>
                <span>Fixture setup, live status, and winner progression.</span>
              </Link>
              <Link href="/admin/announcements" className="quick-tile">
                <strong>Notices</strong>
                <span>Publish and pin public or organizer updates.</span>
              </Link>
              <Link href="/admin/settings" className="quick-tile">
                <strong>Settings</strong>
                <span>Exports, environment checks, and event backup prep.</span>
              </Link>
            </div>
          </ControlPanel>

          <ControlPanel eyebrow="Feed Monitor" title="Recent notices" dense>
            <div className="news-feed news-feed-tight">
              {data.announcements.length > 0 ? (
                data.announcements.map((announcement) => (
                  <NewsBulletin key={announcement.id} announcement={announcement} compact showAdminMeta />
                ))
              ) : (
                <EmptyState
                  compact
                  eyebrow="Feed Monitor"
                  title="No notices have been published"
                  description="Create the first announcement to start the public and admin feeds."
                />
              )}
            </div>
          </ControlPanel>
        </div>
      </MotionIn>
    </div>
  );
}
