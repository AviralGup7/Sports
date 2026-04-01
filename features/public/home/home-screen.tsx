import { CSSProperties } from "react";
import Link from "next/link";

import { getTeamAccent } from "@/lib/team-style";
import type { HomePageData } from "@/server/data/public/types";
import { formatDateRangeLabel } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { CountdownChip, NewsBulletin } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { HomeBrandBadge } from "@/features/public/home/components/home-brand-badge";

type HomeScreenProps = {
  data: HomePageData;
};

export function HomeScreen({ data }: HomeScreenProps) {
  const { tournament, highlightMatch, nextMatch, heroSignals, announcements } = data;
  const headlineAnnouncement = announcements[0] ?? null;
  const keySignals = heroSignals.slice(0, 3);

  return (
    <div className="stack-hero">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Official tournament portal"
            kicker={`${formatDateRangeLabel(tournament.startDate, tournament.endDate)} | ${tournament.venue}`}
            title={tournament.name}
            description="Follow published fixtures, standings, and important notices from one clear tournament portal."
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
                  <div className="spotlight-actions">
                    <Link href={`/matches/${highlightMatch.match.id}`} className="inline-link">
                      Match Details
                    </Link>
                    <Link href={`/sports/${highlightMatch.sport.id}?tab=bracket`} className="inline-link">
                      View Knockouts
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="score-spotlight">
                  <p className="eyebrow">Featured Match</p>
                  <h2>No match featured yet</h2>
                  <p>As soon as fixtures are confirmed, the biggest live or upcoming match will appear here.</p>
                </div>
              )
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn delay={0.05}>
        <section className="section-shell section-shell-newsdesk">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Lead Notice</p>
              <h2>Main update</h2>
            </div>
            <div className="home-inline-meta">
              {nextMatch ? <CountdownChip startsAt={nextMatch.startsAt} /> : null}
              <Link href="/announcements" className="inline-link">
                All notices
              </Link>
            </div>
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
