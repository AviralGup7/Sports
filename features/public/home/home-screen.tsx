import { CSSProperties } from "react";
import Link from "next/link";

import { getTeamAccent } from "@/lib/team-style";
import type { HomePageData } from "@/server/data/public/types";
import { formatDateRangeLabel } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { DataStateBanner, EmptyState } from "@/shared/feedback";
import { BracketPreviewCard, CountdownChip, DayNoteBanner, FixtureStrip, FreshnessStamp, NewsBulletin, PodiumCard, SportProgressCard } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { HomeBrandBadge } from "@/features/public/home/components/home-brand-badge";
import { HomeContactCard } from "@/features/public/home/components/home-contact-card";

type HomeScreenProps = {
  data: HomePageData;
};

export function HomeScreen({ data }: HomeScreenProps) {
  const { generatedAt, tournament, stats, dayNote, highlightMatch, nextMatch, heroSignals, featuredMatches, announcements, championSpotlights, bracketPreviewCards, sportProgressCards } = data;
  const headlineAnnouncement = announcements[0] ?? null;
  const headlineMatches = featuredMatches.slice(0, 4);
  const keySignals = heroSignals.slice(0, 3);
  const exploreCards = sportProgressCards.slice(0, 4);
  const liveMetricHref = highlightMatch?.urgency === "live" ? `/matches/${highlightMatch.match.id}` : "/schedule?status=live";

  return (
    <div className="stack-hero">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Inter Cultural League"
            kicker={`${formatDateRangeLabel(tournament.startDate, tournament.endDate)} | ${tournament.venue}`}
            title={tournament.name}
            description="Follow live scores, upcoming fixtures, standings, and important notices from one polished tournament portal."
            badge={<HomeBrandBadge tournament={tournament} />}
            tone={highlightMatch?.urgency === "live" ? "crimson" : highlightMatch?.urgency === "watch" ? "crimson" : "blue"}
            intensity="premium"
            variant="home-hero"
            signals={keySignals.map((signal) => (
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

      <MotionIn delay={0.05}>
        <section className="section-shell section-shell-broadcast section-shell-home-command">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live Desk</p>
              <h2>Live now and next up</h2>
            </div>
            <Link href={liveMetricHref} className="inline-link">
              Follow live scores
            </Link>
          </div>

          <div className="home-command-grid">
            <div className="stack-lg">
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
            </div>

            <div className="home-command-aside">
              <article className="home-summary-card">
                <p className="eyebrow">Snapshot</p>
                <h3>What matters right now</h3>
                <div className="home-summary-grid">
                  <div>
                    <span>Live matches</span>
                    <strong>{stats.liveMatches}</strong>
                  </div>
                  <div>
                    <span>Upcoming</span>
                    <strong>{Math.max(stats.matches - stats.completedMatches - stats.liveMatches, 0)}</strong>
                  </div>
                  <div>
                    <span>Results in</span>
                    <strong>{stats.completedMatches}</strong>
                  </div>
                  <div>
                    <span>Teams active</span>
                    <strong>{stats.teams}</strong>
                  </div>
                </div>
              </article>

              <article className="home-summary-card">
                <p className="eyebrow">Freshness</p>
                <h3>Live data context</h3>
                <DataStateBanner state={data.dataState} compact />
                {nextMatch ? <CountdownChip startsAt={nextMatch.startsAt} /> : null}
                <FreshnessStamp generatedAt={generatedAt} />
              </article>

              <article className="home-summary-card">
                <p className="eyebrow">Explore</p>
                <h3>Jump to the right view</h3>
                <div className="home-link-stack">
                  <Link href="/schedule" className="inline-link">
                    Full schedule
                  </Link>
                  <Link href="/standings" className="inline-link">
                    Tournament standings
                  </Link>
                  <Link href="/announcements" className="inline-link">
                    Notice board
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </MotionIn>

      <MotionIn delay={0.08}>
        <section className="section-shell section-shell-newsdesk">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lead Notice</p>
              <h2>Key update and context</h2>
            </div>
            <Link href="/announcements" className="inline-link">
              All notices
            </Link>
          </div>

          <div className="home-news-grid">
            <div className="news-grid news-grid-headline">
              {headlineAnnouncement ? (
                <NewsBulletin announcement={headlineAnnouncement} pinnedHero={headlineAnnouncement.pinned} />
              ) : (
                <EmptyState
                  compact
                  eyebrow="Notices"
                  title="No notices yet"
                  description="Important updates from organisers will appear here once they are published."
                />
              )}
            </div>

            <div className="home-news-aside">
              <article className="home-summary-card">
                <p className="eyebrow">Tournament status</p>
                <h3>One-line context</h3>
                <p className="muted">
                  {stats.liveMatches > 0
                    ? `${stats.liveMatches} live match${stats.liveMatches === 1 ? "" : "es"} are updating right now across ${stats.sports} sports.`
                    : `No matches are live right now. The portal is tracking ${stats.matches} fixtures across ${stats.sports} sports.`}
                </p>
              </article>

              <article className="home-summary-card">
                <p className="eyebrow">At a glance</p>
                <h3>Current tournament numbers</h3>
                <div className="home-kpi-list">
                  <span>
                    <strong>{stats.sports}</strong>
                    Sports running
                  </span>
                  <span>
                    <strong>{stats.announcements}</strong>
                    Public notices
                  </span>
                  <span>
                    <strong>{stats.completedMatches}</strong>
                    Results recorded
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.12}>
        <ScrollStorySection variant="section">
          <section className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Explore</p>
                <h2>Sports, standings, and knockout races</h2>
              </div>
              <Link href="/sports/cricket" className="inline-link">
                Open sports centre
              </Link>
            </div>

            <div className="sport-progress-grid">
              {exploreCards.length > 0 ? (
                exploreCards.map((card) => <SportProgressCard key={card.sport.id} card={card} />)
              ) : (
                <EmptyState
                  compact
                  eyebrow="Sports"
                  title="Sport progress will appear soon"
                  description="As fixtures and results settle in, each sport summary will show up here."
                />
              )}
            </div>
            <div className="spacer-sm" />
            <div className="bracket-preview-grid">
              {bracketPreviewCards.length > 0 ? (
                bracketPreviewCards.map((card) => <BracketPreviewCard key={card.sport.id} card={card} />)
              ) : (
                <EmptyState compact eyebrow="Bracket" title="Bracket previews will appear soon" description="Knockout views show up here once those rounds begin." />
              )}
            </div>
          </section>
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="home-secondary-grid" delay={0.16}>
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
          <section className="section-shell section-shell-home-support">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Support</p>
                <h2>Tournament help and venue info</h2>
              </div>
            </div>

            <HomeContactCard tournament={tournament} />
          </section>
        </ScrollStorySection>
      </MotionIn>
    </div>
  );
}
