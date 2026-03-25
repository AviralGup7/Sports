import { CSSProperties } from "react";
import Link from "next/link";

import { getTeamAccent } from "@/lib/team-style";
import type { HomePageData } from "@/server/data/public/types";
import { formatDateRangeLabel } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { DataStateBanner, EmptyState } from "@/shared/feedback";
import { CountdownChip, DayNoteBanner, FixtureStrip, FreshnessStamp, NewsBulletin } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { HomeBrandBadge } from "@/features/public/home/components/home-brand-badge";

type HomeScreenProps = {
  data: HomePageData;
};

export function HomeScreen({ data }: HomeScreenProps) {
  const { generatedAt, tournament, dayNote, highlightMatch, nextMatch, heroSignals, featuredMatches, announcements } = data;
  const headlineAnnouncement = announcements[0] ?? null;
  const headlineMatches = featuredMatches.slice(0, 4);
  const keySignals = heroSignals.slice(0, 3);
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
            <DataStateBanner state={data.dataState} compact />
          </div>

          <div className="stack-lg">
            <DayNoteBanner note={dayNote} />

            {nextMatch ? (
              <div className="home-inline-meta">
                <CountdownChip startsAt={nextMatch.startsAt} />
                <FreshnessStamp generatedAt={generatedAt} />
                <Link href={liveMetricHref} className="inline-link">
                  Follow live scores
                </Link>
              </div>
            ) : (
              <div className="home-inline-meta">
                <FreshnessStamp generatedAt={generatedAt} />
                <Link href="/schedule" className="inline-link">
                  Full schedule
                </Link>
              </div>
            )}

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
        </section>
      </MotionIn>
    </div>
  );
}
