import Link from "next/link";

import { ActionNotice } from "@/components/action-notice";
import { MatchCard } from "@/components/match-card";
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
      <section className="banner">
        <p className="eyebrow">Admin dashboard</p>
        <h1>Operations Snapshot</h1>
        <p>Today’s workbench for fixtures, result entry, and tournament messaging.</p>
      </section>

      <ActionNotice message={params.message} tone={tone} />

      <section className="stats-grid">
        <article className="stat-card">
          <p>Your access</p>
          <strong>{profile.role === "super_admin" ? "All" : profile.sportIds.length}</strong>
          <span>{profile.role === "super_admin" ? "All sports" : `${profile.sportIds.join(", ")}`}</span>
        </article>
        <article className="stat-card">
          <p>Matches</p>
          <strong>{data.stats.matches}</strong>
          <span>{data.stats.completedMatches} completed</span>
        </article>
        <article className="stat-card">
          <p>Pending results</p>
          <strong>{data.pendingResults.length}</strong>
          <span>Awaiting admin action</span>
        </article>
        <article className="stat-card">
          <p>Announcements</p>
          <strong>{data.announcements.length}</strong>
          <span>Visible in admin feed</span>
        </article>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Today’s fixtures</p>
            <h2>Live operations</h2>
          </div>
          <Link href="/admin/matches" className="inline-link">
            Manage matches
          </Link>
        </div>

        <div className="card-grid">
          {data.todaysMatches.map((match) => (
            <MatchCard key={match.id} match={match} showSport />
          ))}
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="eyebrow">Quick links</p>
          <h2>Teams</h2>
          <p>Create, edit, and archive teams with sport assignments and seeds.</p>
          <Link href="/admin/teams" className="inline-link">
            Open team registry
          </Link>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Quick links</p>
          <h2>Fixtures</h2>
          <p>Update match details, save results, and auto-advance winners to the next slot.</p>
          <Link href="/admin/matches" className="inline-link">
            Open fixture control
          </Link>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Quick links</p>
          <h2>Announcements</h2>
          <p>Publish or unpublish notices and pin important updates to the public board.</p>
          <Link href="/admin/announcements" className="inline-link">
            Open notices
          </Link>
        </article>
      </section>
    </div>
  );
}
