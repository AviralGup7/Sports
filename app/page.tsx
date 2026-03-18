import Link from "next/link";

import { AnnouncementCard } from "@/components/announcement-card";
import { MatchCard } from "@/components/match-card";
import { getHomePageData } from "@/lib/data";

export default async function HomePage() {
  const { tournament, sports, stats, featuredMatches, announcements, champions } = await getHomePageData();

  return (
    <div className="stack-xl">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Supabase-backed tournament portal</p>
          <h1>{tournament.name}</h1>
          <p className="hero-text">
            Public viewers get live schedules, match details, and announcements. Organizers get a protected admin area
            for teams, fixtures, results, and exports.
          </p>
          <div className="hero-actions">
            <Link href="/schedule" className="button">
              Browse schedule
            </Link>
            <Link href="/admin" className="button button-ghost">
              Organizer login
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <p className="eyebrow">Tournament window</p>
          <div className="hero-kicker">{tournament.startDate} to {tournament.endDate}</div>
          <p>{tournament.venue}</p>
          <ul className="meta-list">
            <li>Schedule and notices read from Supabase when the schema is applied.</li>
            <li>Admin routes are protected with organizer authentication.</li>
            <li>Bracket progression is ready for winner auto-advance.</li>
          </ul>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Sports</p>
          <strong>{stats.sports}</strong>
          <span>Public sport hubs</span>
        </article>
        <article className="stat-card">
          <p>Teams</p>
          <strong>{stats.teams}</strong>
          <span>Active associations</span>
        </article>
        <article className="stat-card">
          <p>Matches</p>
          <strong>{stats.matches}</strong>
          <span>{stats.completedMatches} completed</span>
        </article>
        <article className="stat-card">
          <p>Public notices</p>
          <strong>{stats.announcements}</strong>
          <span>Published announcements</span>
        </article>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Champions board</p>
            <h2>Final results snapshot</h2>
          </div>
        </div>
        <div className="sports-grid">
          {champions.map((entry) => (
            <article key={entry.sport.id} className="sport-card">
              <span className="sport-accent" style={{ backgroundColor: entry.sport.color }} />
              <p className="eyebrow">{entry.sport.name}</p>
              <h3>{entry.winner?.name ?? "TBD"}</h3>
              <p>{entry.winner ? "Champion confirmed from completed final." : "Awaiting final result entry."}</p>
              <Link href={`/sports/${entry.sport.id}`} className="inline-link">
                Open {entry.sport.name.toLowerCase()} bracket
              </Link>
            </article>
          ))}
        </div>
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
            <p className="eyebrow">Featured fixtures</p>
            <h2>What is coming up</h2>
          </div>
        </div>

        <div className="card-grid">
          {featuredMatches.map((match) => (
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
