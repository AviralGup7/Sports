import { CSSProperties } from "react";
import Link from "next/link";

import { getTeamAccent } from "@/lib/team-style";
import type { HomePageData } from "@/server/data/public/types";
import { formatDateRangeLabel } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { BracketPreviewCard, CountdownChip, DayNoteBanner, DisclosurePanel, FixtureStrip, FreshnessStamp, MetricTile, NewsBulletin, PodiumCard } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type HomeScreenProps = {
  data: HomePageData;
};

export function HomeScreen({ data }: HomeScreenProps) {
  const { generatedAt, tournament, sports, stats, dayNote, highlightMatch, nextMatch, heroSignals, featuredMatches, announcements, championSpotlights, bracketPreviewCards } = data;
  const headlineAnnouncement = announcements[0] ?? null;
  const headlineMatches = featuredMatches.slice(0, 4);
  const liveMetricHref = highlightMatch?.urgency === "live" ? `/matches/${highlightMatch.match.id}` : "/schedule?status=live";

  return (
    <div className="stack-hero">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Inter Association Sports League"
            kicker={`${formatDateRangeLabel(tournament.startDate, tournament.endDate)} | ${tournament.venue}`}
            title={tournament.name}
            description="Follow live scores, upcoming fixtures, standings, and important notices from one polished tournament portal."
            tone={highlightMatch?.urgency === "live" ? "crimson" : highlightMatch?.urgency === "watch" ? "crimson" : "blue"}
            intensity="premium"
            variant="home-hero"
            actions={
              <>
                <Link href="/schedule" className="button">
                  View Schedule
                </Link>
                <Link href="/announcements" className="button button-ghost">
                  Notices & Alerts
                </Link>
              </>
            }
            signals={heroSignals.map((signal) => (
              <Link key={signal.id} href={signal.href ?? "/"} className={`hero-signal hero-signal-${signal.tone}`}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <small>{signal.detail}</small>
              </Link>
            ))}
            aside={
              highlightMatch ? (
                <div className={`score-spotlight score-spotlight-${highlightMatch.urgency}`}>
                  <div className="spotlight-status-line">
                    <p className="eyebrow">{highlightMatch.label}</p>
                    <span className={highlightMatch.urgency === "live" ? "spotlight-chip spotlight-chip-live" : "spotlight-chip"}>
                      {highlightMatch.urgency === "live" ? "LIVE" : highlightMatch.urgency === "watch" ? "Watch" : "Next Up"}
                    </span>
                  </div>
                  <div className="score-sport-line">
                    <span>{highlightMatch.sport.name}</span>
                    <span>{highlightMatch.match.stage?.label ?? highlightMatch.match.round}</span>
                  </div>
                  <h2 className="spotlight-teamline">
                    <span className="spotlight-team-name" style={{ "--team-accent": getTeamAccent(highlightMatch.match.teamA) } as CSSProperties}>
                      {highlightMatch.match.teamA?.name ?? "TBD"}
                    </span>
                    <span>VS</span>
                    <span className="spotlight-team-name" style={{ "--team-accent": getTeamAccent(highlightMatch.match.teamB) } as CSSProperties}>
                      {highlightMatch.match.teamB?.name ?? "TBD"}
                    </span>
                  </h2>
                  <p>{highlightMatch.headline}</p>
                  <strong>{highlightMatch.summary}</strong>
                  {nextMatch ? <CountdownChip startsAt={nextMatch.startsAt} /> : null}
                  <FreshnessStamp generatedAt={generatedAt} />
                  <div className="spotlight-actions">
                    <Link href={`/matches/${highlightMatch.match.id}`} className="inline-link">
                      Match Details
                    </Link>
                    <Link href={`/sports/${highlightMatch.sport.id}?tab=bracket`} className="inline-link">
                      View Bracket
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="score-spotlight">
                  <p className="eyebrow">Featured Match</p>
                  <h2>No match featured yet</h2>
                  <p>As soon as fixtures are confirmed, the biggest live or upcoming match will appear here.</p>
                  <FreshnessStamp generatedAt={generatedAt} />
                </div>
              )
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="home-essential-grid" delay={0.05}>
        <div className="stack-lg">
          <section className="section-shell section-shell-broadcast section-shell-home-essentials">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Today</p>
                <h2>Follow the tournament in one glance</h2>
              </div>
              <Link href="/schedule" className="inline-link">
                Open full schedule
              </Link>
            </div>

            <DayNoteBanner note={dayNote} />

            <div className="fixture-stack fixture-stack-home">
              {headlineMatches.length > 0 ? (
                headlineMatches.map((match) => <FixtureStrip key={match.id} match={match} showSport />)
              ) : (
                <EmptyState
                  compact
                  eyebrow="Matches"
                  title="No matches to show yet"
                  description="Featured fixtures will appear here as soon as the schedule is published."
                />
              )}
            </div>

            <div className="metric-grid metric-grid-home">
              <MetricTile label="Sports" value={stats.sports} detail="Every sport running in this tournament" accent="#f59e0b" href="/#sports-spotlight" />
              <MetricTile label="Active Teams" value={stats.teams} detail="Associations competing across the event" accent="#38bdf8" href="/teams" />
              <MetricTile
                label="Matches Live"
                value={stats.liveMatches}
                detail={stats.liveMatches > 0 ? "Scores updating right now" : "No live matches at the moment"}
                accent="#ff476e"
                pulse={stats.liveMatches > 0}
                href={liveMetricHref}
              />
              <MetricTile
                label="Results In"
                value={`${stats.completedMatches} of ${stats.matches}`}
                detail="Completed fixtures recorded so far"
                accent="#fb7185"
                href="/standings"
              />
            </div>
          </section>
        </div>

        <section className="section-shell section-shell-newsdesk section-shell-home-headline">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest Notice</p>
              <h2>Important update</h2>
            </div>
            <Link href="/announcements" className="inline-link">
              See all notices
            </Link>
          </div>

          {headlineAnnouncement ? (
            <div className="news-grid news-grid-headline">
              <NewsBulletin announcement={headlineAnnouncement} pinnedHero={headlineAnnouncement.pinned} />
            </div>
          ) : (
            <EmptyState
              compact
              eyebrow="Notices"
              title="No notices yet"
              description="Important updates from organisers will appear here once they are published."
            />
          )}
        </section>
      </MotionIn>

      <MotionIn className="stack-xl" delay={0.12}>
        <ScrollStorySection variant="section">
          <section className="section-shell section-shell-podium">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Title Race</p>
                <h2>Champions podium</h2>
              </div>
              <Link href="/standings" className="inline-link">
                Follow the tables
              </Link>
            </div>

            <div className="podium-grid">
              {championSpotlights.length > 0 ? (
                championSpotlights.map((spotlight, index) => <PodiumCard key={spotlight.sport.id} spotlight={spotlight} index={index} />)
              ) : (
                <EmptyState
                  compact
                  eyebrow="Champions"
                  title="Podium is waiting"
                  description="Finals and medal moments will fill this section as the tournament progresses."
                />
              )}
            </div>
          </section>
        </ScrollStorySection>

        <ScrollStorySection variant="section">
          <section className="section-shell section-shell-posters" id="sports-spotlight">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Sports Overview</p>
                <h2>Choose a sport</h2>
              </div>
            </div>

            <div className="poster-grid">
              {sports.length > 0 ? (
                sports.map((sport) => (
                  <article key={sport.id} className="sport-poster" style={{ "--sport-accent": sport.color } as CSSProperties}>
                    <p className="eyebrow">{sport.name}</p>
                    <h3>{sport.name}</h3>
                    <p>{sport.rulesSummary}</p>
                    <div className="sport-poster-meta">
                      <span>{sport.format}</span>
                    </div>
                    <Link href={`/sports/${sport.id}`} className="inline-link">
                      View {sport.name}
                    </Link>
                  </article>
                ))
              ) : (
                <EmptyState
                  compact
                  eyebrow="Sports"
                  title="Sports will appear here"
                  description="Sport pages show fixtures, standings, and bracket details as the event fills out."
                />
              )}
            </div>
          </section>
        </ScrollStorySection>

        <ScrollStorySection variant="bracket">
          <section className="section-shell section-shell-bracket-preview">
            <DisclosurePanel
              eyebrow="Knockout race"
              title="Follow knockout brackets"
              meta={bracketPreviewCards.length > 0 ? `${bracketPreviewCards.length} sports with bracket views` : "Bracket views appear as knockout rounds fill in"}
              className="section-disclosure"
            >
              <div className="bracket-preview-grid">
                {bracketPreviewCards.length > 0 ? (
                  bracketPreviewCards.map((card) => <BracketPreviewCard key={card.sport.id} card={card} />)
                ) : (
                  <EmptyState compact eyebrow="Bracket" title="Bracket previews will appear soon" description="Knockout views show up here once those rounds begin." />
                )}
              </div>
            </DisclosurePanel>
          </section>
        </ScrollStorySection>
      </MotionIn>
    </div>
  );
}
