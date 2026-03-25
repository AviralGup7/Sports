import { CSSProperties } from "react";
import Link from "next/link";

import type { SportSlug } from "@/domain/sports/types";
import { getTeamAccent } from "@/lib/team-style";
import type { SportPageData } from "@/server/data/public/types";
import { BracketPreviewCard, BracketTree, FixtureStrip, FreshnessStamp, SportProgressCard, StageSummaryRail, StandingsTable } from "@/shared/ui";
import { BroadcastHero } from "@/shared/layout";
import { DataStateBanner, EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type SportCenterScreenProps = {
  sportSlug: SportSlug;
  selectedTab: string;
  data: SportPageData;
};

export function SportCenterScreen({ sportSlug, selectedTab, data }: SportCenterScreenProps) {
  const liveCount = data.matches.filter((match) => match.status === "live").length;
  const completedCount = data.matches.filter((match) => match.status === "completed").length;
  const activeStageLabel = data.stageSummaries[0]?.stage.label ?? "Current stage";
  const tabHref = (tab: string) => `/sports/${sportSlug}?tab=${tab}`;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "standings", label: "Standings" },
    { id: "bracket", label: "Bracket" },
    { id: "fixtures", label: "Fixtures" }
  ];

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow={data.sport.name}
            kicker={data.sport.format}
            title={`${data.sport.name} Centre`}
            description={data.sport.rulesSummary}
            accent={data.sport.color}
            tone="cyan"
            intensity="premium"
            variant="sport-masthead"
            aside={
              <div className="score-spotlight score-spotlight-tight">
                <p className="eyebrow">This sport</p>
                <h2>{liveCount > 0 ? "Live Now" : activeStageLabel}</h2>
                <strong>{data.teams.length} associations competing</strong>
                <p>
                  {liveCount > 0
                    ? `${liveCount} match${liveCount === 1 ? "" : "es"} are live right now.`
                    : "Use the summary below to check standings, fixtures, and the current title picture."}
                </p>
                <FreshnessStamp generatedAt={data.generatedAt} />
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="filter-rail sport-center-rail filter-rail-sticky" delay={0.07}>
        <div className="filter-rail-summary">
          <div>
            <p className="eyebrow">Sport Snapshot</p>
            <h2>{activeStageLabel}</h2>
            <p className="muted">
              {liveCount > 0
                ? `${liveCount} match${liveCount === 1 ? "" : "es"} live right now, ${completedCount} result${completedCount === 1 ? "" : "s"} already in.`
                : `${completedCount} result${completedCount === 1 ? "" : "s"} recorded so far across ${data.teams.length} associations.`}
            </p>
          </div>
          <div className="page-guide-actions">
            <Link href={`/schedule?sport=${data.sport.id}`} className="button button-ghost">
              View schedule
            </Link>
            <Link href="/standings" className="button button-ghost">
              All standings
            </Link>
          </div>
        </div>

        <div className="filter-rail-meta">
          <span className="pill">{liveCount} live</span>
          <span className="pill">{data.teams.length} teams</span>
          <span className="pill">{completedCount} results</span>
          <DataStateBanner state={data.dataState} compact />
        </div>

        <div className="filter-block">
          <p className="eyebrow">View</p>
          <div className="chip-row">
            {tabs.map((tab) => (
              <Link key={tab.id} href={tabHref(tab.id)} className={selectedTab === tab.id ? "chip chip-active" : "chip"}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Progress</p>
            <h2>Tournament picture</h2>
          </div>
        </div>
        <div className="sport-progress-grid">
          <SportProgressCard card={data.sportProgressCard} />
          {data.bracketPreview ? <BracketPreviewCard card={data.bracketPreview} /> : null}
        </div>
        {data.stageSummaries.length > 0 ? (
          <>
            <div className="spacer-sm" />
            <StageSummaryRail summaries={data.stageSummaries} />
          </>
        ) : null}
      </MotionIn>

      {selectedTab === "overview" ? (
        <MotionIn className="split-stage" delay={0.14}>
          <section className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Featured Matches</p>
                <h2>Current spotlight</h2>
              </div>
            </div>
            <div className="fixture-stack">
              {data.overviewMatches.length > 0 ? (
                data.overviewMatches.map((match) => <FixtureStrip key={match.id} match={match} />)
              ) : (
                <EmptyState compact eyebrow="Overview" title="No matches yet" description="Match details will appear here as soon as this sport begins." />
              )}
            </div>
          </section>

          <section className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Teams</p>
                <h2>Association roster</h2>
              </div>
            </div>
            <div className="team-chip-grid">
              {data.teams.length > 0 ? (
                data.teams.map((team) => (
                  <article
                    key={team.id}
                    className="team-chip-card team-profile-card-accent"
                    style={{ "--sport-accent": data.sport.color, "--team-accent": getTeamAccent(team) } as CSSProperties}
                  >
                    <strong>{team.name}</strong>
                    <span>{team.association}</span>
                    <small>Seed {team.seed}</small>
                    <Link href={`/teams/${team.id}`} className="inline-link">
                      View profile
                    </Link>
                  </article>
                ))
              ) : (
                <EmptyState compact eyebrow="Teams" title="No associations assigned yet" description="Team entries will appear here once organisers publish the roster for this sport." />
              )}
            </div>
          </section>
        </MotionIn>
      ) : null}

      {selectedTab === "standings" ? (
        <MotionIn className="section-shell" delay={0.14}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Standings</p>
              <h2>Current table</h2>
            </div>
          </div>
          {data.standings.length > 0 ? (
            <StandingsTable cards={data.standings} />
          ) : (
            <EmptyState eyebrow="Standings" title="No standings available yet" description="Knockout summary tables appear once enough results are recorded in this sport." />
          )}
        </MotionIn>
      ) : null}

      {selectedTab === "bracket" ? (
        <MotionIn className="section-shell section-shell-bracket" delay={0.14}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Bracket</p>
              <h2>Knockout view</h2>
            </div>
          </div>
          {data.bracket ? (
            <BracketTree bracket={data.bracket} />
          ) : (
            <EmptyState eyebrow="Bracket" title="Bracket is not available yet" description="As knockout rounds are seeded, the bracket view will fill in here." />
          )}
        </MotionIn>
      ) : null}

      {selectedTab === "fixtures" ? (
        <MotionIn className="section-shell" delay={0.14}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fixtures</p>
              <h2>Every match in this sport</h2>
            </div>
            <Link href="/schedule" className="inline-link">
              Back to schedule
            </Link>
          </div>
          <div className="fixture-stack">
            {data.matches.length > 0 ? (
              data.matches.map((match) => <FixtureStrip key={match.id} match={match} />)
            ) : (
              <EmptyState compact eyebrow="Fixtures" title="No fixtures available yet" description="Fixtures for this sport appear here once the schedule is published." />
            )}
          </div>
        </MotionIn>
      ) : null}
    </div>
  );
}
