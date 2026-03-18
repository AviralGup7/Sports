import { CSSProperties } from "react";
import Link from "next/link";

import { BroadcastHero } from "@/components/broadcast-hero";
import { FixtureStrip } from "@/components/fixture-strip";
import { MetricTile } from "@/components/metric-tile";
import { MotionIn } from "@/components/motion-in";
import { NewsBulletin } from "@/components/news-bulletin";
import { PodiumCard } from "@/components/podium-card";
import { getHomePageData } from "@/lib/data";

export default async function HomePage() {
  const { tournament, sports, stats, highlightMatch, featuredMatches, announcements, championSpotlights } =
    await getHomePageData();
  const liveMatches = featuredMatches.filter((match) => match.status === "live").length;

  return (
    <div className="stack-hero">
      <MotionIn>
        <BroadcastHero
          eyebrow="Arena Broadcast"
          kicker={`${tournament.startDate} to ${tournament.endDate} | ${tournament.venue}`}
          title={tournament.name}
          description="One high-voltage board for viewers, squads, and organizers. Track live fixtures, title races, and the latest calls from the control room."
          actions={
            <>
              <Link href="/schedule" className="button">
                Enter live schedule
              </Link>
              <Link href="/announcements" className="button button-ghost">
                Open bulletin feed
              </Link>
            </>
          }
          aside={
            highlightMatch ? (
              <div className="score-spotlight">
                <p className="eyebrow">{highlightMatch.label}</p>
                <div className="score-sport-line">
                  <span>{highlightMatch.sport.name}</span>
                  <span>{highlightMatch.match.round}</span>
                </div>
                <h2>
                  {highlightMatch.match.teamA?.name ?? "TBD"}
                  <span>VS</span>
                  {highlightMatch.match.teamB?.name ?? "TBD"}
                </h2>
                <p>{highlightMatch.headline}</p>
                <strong>{highlightMatch.summary}</strong>
                <Link href={`/matches/${highlightMatch.match.id}`} className="inline-link">
                  Open match board
                </Link>
              </div>
            ) : (
              <div className="score-spotlight">
                <p className="eyebrow">Live desk</p>
                <h2>No featured board yet</h2>
                <p>Once fixtures are seeded, the top live or next-up match will take over this scoreboard panel.</p>
              </div>
            )
          }
        />
      </MotionIn>

      <MotionIn className="metric-grid" delay={0.08}>
        <MetricTile label="Sports" value={stats.sports} detail="Color-coded tournament lanes" accent="#f59e0b" />
        <MetricTile label="Active Teams" value={stats.teams} detail="Associations on the board" accent="#38bdf8" />
        <MetricTile
          label="Live Now"
          value={liveMatches}
          detail={liveMatches > 0 ? "Fixtures currently running" : "Waiting for the next whistle"}
          accent="#22d3ee"
          pulse={liveMatches > 0}
        />
        <MetricTile
          label="Results Locked"
          value={stats.completedMatches}
          detail={`${stats.matches} total fixtures in the tournament map`}
          accent="#fb7185"
        />
      </MotionIn>

      <MotionIn className="stack-xl" delay={0.12}>
        <section className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Title Race</p>
              <h2>Champions podium</h2>
            </div>
            <Link href="/schedule" className="inline-link">
              Follow the full board
            </Link>
          </div>

          <div className="podium-grid">
            {championSpotlights.map((spotlight, index) => (
              <PodiumCard key={spotlight.sport.id} spotlight={spotlight} index={index} />
            ))}
          </div>
        </section>

        <section className="section-shell" id="sports-spotlight">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sport Posters</p>
              <h2>Choose your arena</h2>
            </div>
          </div>

          <div className="poster-grid">
            {sports.map((sport) => (
              <article key={sport.id} className="sport-poster" style={{ "--sport-accent": sport.color } as CSSProperties}>
                <p className="eyebrow">{sport.format}</p>
                <h3>{sport.name}</h3>
                <p>{sport.rulesSummary}</p>
                <Link href={`/sports/${sport.id}`} className="inline-link">
                  Enter {sport.name.toLowerCase()}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Featured Fixtures</p>
              <h2>Broadcast queue</h2>
            </div>
            <Link href="/schedule" className="inline-link">
              Open all timings
            </Link>
          </div>

          <div className="fixture-stack">
            {featuredMatches.map((match) => (
              <FixtureStrip key={match.id} match={match} showSport />
            ))}
          </div>
        </section>

        <section className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">News Desk</p>
              <h2>Latest bulletins</h2>
            </div>
            <Link href="/announcements" className="inline-link">
              See the full feed
            </Link>
          </div>

          <div className="news-grid">
            {announcements.map((announcement, index) => (
              <NewsBulletin
                key={announcement.id}
                announcement={announcement}
                compact={index > 0}
                pinnedHero={index === 0 && announcement.pinned}
              />
            ))}
          </div>
        </section>
      </MotionIn>
    </div>
  );
}
