import Link from "next/link";

import { MatchCard } from "@/components/match-card";
import { getScheduleDays, getScheduleForDay, getTournamentStats, organizers } from "@/lib/data";

export default function AdminDashboardPage() {
  const stats = getTournamentStats();
  const nextOpsDay = getScheduleDays()[1];
  const nextFixtures = getScheduleForDay(nextOpsDay).slice(0, 4);

  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Admin dashboard</p>
        <h1>Operations Snapshot</h1>
        <p>This shell is ready for auth guards, CRUD forms, and live updates once we connect the backend.</p>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Organizers</p>
          <strong>{organizers.length}</strong>
          <span>Role model seeded</span>
        </article>
        <article className="stat-card">
          <p>Matches</p>
          <strong>{stats.matches}</strong>
          <span>{stats.completedMatches} completed</span>
        </article>
        <article className="stat-card">
          <p>Public notices</p>
          <strong>{stats.announcements}</strong>
          <span>Visibility split in data layer</span>
        </article>
        <article className="stat-card">
          <p>Next focus</p>
          <strong>Auth</strong>
          <span>Supabase session guard pending</span>
        </article>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Upcoming day</p>
            <h2>{nextOpsDay}</h2>
          </div>
          <Link href="/admin/matches" className="inline-link">
            Manage matches
          </Link>
        </div>

        <div className="card-grid">
          {nextFixtures.map((match) => (
            <MatchCard key={match.id} match={match} showSport />
          ))}
        </div>
      </section>
    </div>
  );
}
