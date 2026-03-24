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
  return (
    <div className="stack-xl">
      <MotionIn>
        <div className="chip-row">
          <Link href="/teams" className="chip">
            All teams
          </Link>
          <Link href="/standings" className="chip">
            Standings
          </Link>
        </div>
      </MotionIn>

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

      <MotionIn delay={0.04}>
        <DataStateBanner state={data.dataState} compact />
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

      <MotionIn className="section-shell" delay={0.08}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Upcoming</p>
            <h2>Next fixtures</h2>
          </div>
        </div>
        <div className="fixture-stack">
          {data.upcomingMatches.length > 0 ? (
            data.upcomingMatches.map((match) => <FixtureStrip key={match.id} match={match} showSport />)
          ) : (
            <EmptyState eyebrow="Upcoming" title="No upcoming fixtures" description="This team does not have another scheduled match right now." />
          )}
        </div>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Results</p>
            <h2>Completed matches</h2>
          </div>
        </div>
        <div className="fixture-stack">
          {data.completedMatches.length > 0 ? (
            data.completedMatches.map((match) => <FixtureStrip key={match.id} match={match} showSport />)
          ) : (
            <EmptyState eyebrow="Results" title="No results yet" description="Completed matches will appear here once scores are recorded." />
          )}
        </div>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.12}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Standings</p>
            <h2>Where they stand</h2>
          </div>
        </div>
        <div className="stack-lg">
          {data.standings.length > 0 ? (
            data.standings.map((section) => (
              <section key={section.sport.id} className="stack-sm">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{section.sport.name}</p>
                    <h2>Current position</h2>
                  </div>
                </div>
                <StandingsTable cards={section.cards} />
              </section>
            ))
          ) : (
            <EmptyState eyebrow="Standings" title="No standings available yet" description="This team's knockout summary tables will appear once results are recorded." />
          )}
        </div>
      </MotionIn>
    </div>
  );
}
