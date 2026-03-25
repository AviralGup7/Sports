import { CSSProperties } from "react";
import Link from "next/link";

import { getTeamAccent } from "@/lib/team-style";
import type { TeamProfilePageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { DataStateBanner, EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { FixtureStrip, FreshnessStamp, StandingsTable } from "@/shared/ui";

type TeamProfileScreenProps = {
  data: TeamProfilePageData;
};

export function TeamProfileScreen({ data }: TeamProfileScreenProps) {
  const hasFixtureActivity = data.liveMatches.length > 0 || data.upcomingMatches.length > 0 || data.completedMatches.length > 0;

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow={data.team.association}
            title={data.team.name}
            description={`Entered in ${data.sports.map((sport) => sport.name).join(", ")}.`}
            compact
            tone="amber"
            intensity="premium"
            variant="sport-masthead"
            actions={
              <>
                <Link href="/teams" className="button button-ghost">
                  All teams
                </Link>
                <Link href="/standings" className="button button-ghost">
                  Standings
                </Link>
              </>
            }
            aside={
              <div className="hero-aside-list hero-aside-list-cyber team-hero-summary" style={{ "--team-accent": getTeamAccent(data.team) } as CSSProperties}>
                <div>
                  <span className="aside-label">Live now</span>
                  <strong>{data.liveMatches.length}</strong>
                </div>
                <div>
                  <span className="aside-label">Upcoming</span>
                  <strong>{data.upcomingMatches.length}</strong>
                </div>
                <div>
                  <span className="aside-label">Results in</span>
                  <strong>{data.completedMatches.length}</strong>
                </div>
                <FreshnessStamp generatedAt={data.generatedAt} />
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.04}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Current picture</p>
            <h2>Quick team context</h2>
          </div>
        </div>
        <div className="home-news-grid">
          <article className="home-summary-card">
            <p className="eyebrow">Sports entered</p>
            <h3>Where they are competing</h3>
            <div className="team-tag-row">
              {data.sports.map((sport) => (
                <span key={sport.id} className="pill">
                  {sport.name}
                </span>
              ))}
            </div>
          </article>

          <article className="home-summary-card">
            <p className="eyebrow">Live data</p>
            <h3>Freshness and source</h3>
            <DataStateBanner state={data.dataState} compact />
            <FreshnessStamp generatedAt={data.generatedAt} />
          </article>
        </div>
      </MotionIn>

      {data.liveMatches.length > 0 ? (
        <MotionIn className="section-shell" delay={0.06}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live</p>
              <h2>Matches in progress</h2>
            </div>
          </div>
          <div className="fixture-stack">
            {data.liveMatches.map((match) => (
              <FixtureStrip key={match.id} match={match} showSport />
            ))}
          </div>
        </MotionIn>
      ) : null}

      {data.upcomingMatches.length > 0 ? (
        <MotionIn className="section-shell" delay={0.08}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Upcoming</p>
              <h2>Next fixtures</h2>
            </div>
          </div>
          <div className="fixture-stack">
            {data.upcomingMatches.map((match) => <FixtureStrip key={match.id} match={match} showSport />)}
          </div>
        </MotionIn>
      ) : null}

      {data.completedMatches.length > 0 ? (
        <MotionIn className="section-shell" delay={0.1}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Results</p>
              <h2>Completed matches</h2>
            </div>
          </div>
          <div className="fixture-stack">
            {data.completedMatches.map((match) => <FixtureStrip key={match.id} match={match} showSport />)}
          </div>
        </MotionIn>
      ) : null}

      {!hasFixtureActivity ? (
        <MotionIn className="section-shell" delay={0.08}>
          <EmptyState eyebrow="Fixtures" title="No fixture activity yet" description="Live, upcoming, and completed matches for this association will appear here once organisers publish them." />
        </MotionIn>
      ) : null}

      {data.standings.length > 0 ? (
        <MotionIn className="section-shell" delay={0.12}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Standings</p>
              <h2>Where they stand</h2>
            </div>
          </div>
          <div className="stack-lg">
            {data.standings.map((section) => (
              <section key={section.sport.id} className="stack-sm">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{section.sport.name}</p>
                    <h2>Current position</h2>
                  </div>
                </div>
                <StandingsTable cards={section.cards} />
              </section>
            ))}
          </div>
        </MotionIn>
      ) : null}
    </div>
  );
}
