import Link from "next/link";

import { AnnouncementCard } from "@/components/announcement-card";
import { MatchCard } from "@/components/match-card";
import { getScheduleDays, getScheduleForDay, getTournamentStats, getVisibleAnnouncements, sports, tournament } from "@/lib/data";

export default function HomePage() {
  const stats = getTournamentStats();
  const openingDay = getScheduleDays()[0];
  const openingFixtures = getScheduleForDay(openingDay).slice(0, 4);
  const announcements = getVisibleAnnouncements("public").slice(0, 2);

  return (
    <div className="stack-xl">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Phase 1 foundation</p>
          <h1>{tournament.name}</h1>
          <p className="hero-text">
            A single responsive portal for students, teams, and organizers. This first implementation replaces the
            one-file prototype with a real app structure, shared data layer, and public/admin route system.
          </p>
          <div className="hero-actions">
            <Link href="/schedule" className="button">
              Browse schedule
            </Link>
            <Link href="/admin" className="button button-ghost">
              Open admin area
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <p className="eyebrow">Tournament window</p>
          <div className="hero-kicker">{tournament.startDate} to {tournament.endDate}</div>
          <p>{tournament.venue}</p>
          <ul className="meta-list">
            <li>Public pages are read-only and mobile-first.</li>
            <li>Admin screens are scaffolded for auth and CRUD next.</li>
            <li>Mock data already matches the planned domain model.</li>
          </ul>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Sports</p>
          <strong>{stats.sports}</strong>
          <span>Structured routes are ready</span>
        </article>
        <article className="stat-card">
          <p>Teams</p>
          <strong>{stats.teams}</strong>
          <span>Shared roster for the first mock build</span>
        </article>
        <article className="stat-card">
          <p>Matches</p>
          <strong>{stats.matches}</strong>
          <span>{stats.completedMatches} already marked complete</span>
        </article>
        <article className="stat-card">
          <p>Notices</p>
          <strong>{stats.announcements}</strong>
          <span>Public bulletin flow in place</span>
        </article>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Sports overview</p>
            <h2>Public route foundation</h2>
          </div>
          <Link href="/schedule" className="inline-link">
            View the full timetable
          </Link>
        </div>

        <div className="sports-grid">
          {sports.map((sport) => (
            <article key={sport.id} className="sport-card">
              <span className="sport-accent" style={{ backgroundColor: sport.color }} />
              <p className="eyebrow">{sport.format}</p>
              <h3>{sport.name}</h3>
              <p>{sport.rulesSummary}</p>
              <Link href={`/sports/${sport.id}`} className="inline-link">
                Open {sport.name.toLowerCase()} page
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Opening fixtures</p>
            <h2>{openingDay}</h2>
          </div>
        </div>

        <div className="card-grid">
          {openingFixtures.map((match) => (
            <MatchCard key={match.id} match={match} showSport />
          ))}
        </div>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bulletin board</p>
            <h2>Announcements</h2>
          </div>
          <Link href="/announcements" className="inline-link">
            See all notices
          </Link>
        </div>

        <div className="card-grid">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
