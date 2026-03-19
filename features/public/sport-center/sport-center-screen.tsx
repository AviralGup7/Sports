import { CSSProperties } from "react";
import Link from "next/link";

import type { SportSlug } from "@/domain/sports/types";
import type { SportPageData } from "@/server/data/public/types";
import { AthleticsEventBoard, BracketPreviewCard, BracketTree, FixtureStrip, SportProgressCard, StageSummaryRail, StandingsTable } from "@/shared/ui";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type SportCenterScreenProps = {
  sportSlug: SportSlug;
  selectedTab: string;
  data: SportPageData;
};

export function SportCenterScreen({ sportSlug, selectedTab, data }: SportCenterScreenProps) {
  const liveCount = data.matches.filter((match) => match.status === "live").length;
  const tabHref = (tab: string) => `/sports/${sportSlug}?tab=${tab}`;
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "standings", label: "Standings" },
    { id: "bracket", label: "Winner Tree" },
    { id: "fixtures", label: "Fixtures" }
  ];

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Sport Center"
            kicker={data.sport.format}
            title={data.sport.name}
            description={data.sport.rulesSummary}
            accent={data.sport.color}
            tone={data.sport.id === "athletics" ? "crimson" : "cyan"}
            intensity="premium"
            variant="sport-masthead"
            aside={
              <div className="score-spotlight score-spotlight-tight">
                <p className="eyebrow">Stage Status</p>
                <h2>{liveCount > 0 ? "Live Round" : data.stageSummaries[0]?.stage.label ?? "Structure Ready"}</h2>
                <strong>{data.teams.length} squads active</strong>
                <p>
                  {data.sport.id === "athletics"
                    ? "Athletics stays on event-result cards rather than a bracket tree."
                    : liveCount > 0
                      ? `${liveCount} boards are active right now.`
                      : "Use the tabs below to move between overview, standings, bracket, and fixtures."}
                </p>
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="filter-rail sport-center-rail" delay={0.06}>
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

      <MotionIn className="section-shell" delay={0.08}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Stage Progress</p>
            <h2>Tournament path</h2>
          </div>
        </div>
        <div className="sport-progress-grid">
          <SportProgressCard card={data.sportProgressCard} />
          {data.bracketPreview ? <BracketPreviewCard card={data.bracketPreview} /> : null}
        </div>
        <div className="spacer-sm" />
        {data.stageSummaries.length > 0 ? (
          <StageSummaryRail summaries={data.stageSummaries} />
        ) : (
          <EmptyState
            compact
            eyebrow="Stage Progress"
            title="Stage map is still being linked"
            description="This sport already has fixtures on the board, but the stage map has not been fully connected yet."
          />
        )}
      </MotionIn>

      {selectedTab === "overview" ? (
        <MotionIn className="split-stage" delay={0.12}>
          <section className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Spotlight</p>
                <h2>Current boards</h2>
              </div>
            </div>
            <div className="fixture-stack">
              {data.overviewMatches.length > 0 ? (
                data.overviewMatches.map((match) => <FixtureStrip key={match.id} match={match} />)
              ) : (
                <EmptyState compact eyebrow="Overview" title="No boards yet" description="Once this sport is seeded, overview boards will show up here." />
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
                  <article key={team.id} className="team-chip-card" style={{ "--sport-accent": data.sport.color } as CSSProperties}>
                    <strong>{team.name}</strong>
                    <span>{team.association}</span>
                    <small>Seed {team.seed}</small>
                  </article>
                ))
              ) : (
                <EmptyState compact eyebrow="Teams" title="No teams assigned yet" description="Attach teams to this sport in the admin roster and they will show up here." />
              )}
            </div>
          </section>
        </MotionIn>
      ) : null}

      {selectedTab === "standings" ? (
        <MotionIn className="section-shell" delay={0.12}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Standings</p>
              <h2>Qualification watch</h2>
            </div>
          </div>
          {data.standings.length > 0 ? (
            <StandingsTable cards={data.standings} />
          ) : (
            <EmptyState
              eyebrow="Standings"
              title={data.sport.id === "athletics" ? "Athletics does not use group standings" : "No standings yet"}
              description={
                data.sport.id === "athletics"
                  ? "Athletics results are tracked as event cards and medal boards, not group tables."
                  : "Complete group-stage results to unlock the qualification tables."
              }
            />
          )}
        </MotionIn>
      ) : null}

      {selectedTab === "bracket" ? (
        <MotionIn className="section-shell section-shell-bracket" delay={0.12}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Winner Tree</p>
              <h2>Interactive bracket</h2>
            </div>
          </div>
          {data.bracket ? (
            <BracketTree bracket={data.bracket} />
          ) : (
            <EmptyState
              eyebrow="Winner Tree"
              title={data.sport.id === "athletics" ? "Athletics stays off the bracket tree" : "Bracket will appear once stages are linked"}
              description={
                data.sport.id === "athletics"
                  ? "Use the fixtures tab for athletics heats and medal rounds."
                  : "Set winner and loser routes in the control room to turn this sport hub into a connected winner tree."
              }
            />
          )}
        </MotionIn>
      ) : null}

      {selectedTab === "fixtures" ? (
        <MotionIn className="section-shell" delay={0.12}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fixtures</p>
              <h2>{data.sport.id === "athletics" ? "Event result cards" : "Every stage on one board"}</h2>
            </div>
            <Link href="/schedule" className="inline-link">
              Return to schedule
            </Link>
          </div>
          {data.sport.id === "athletics" && data.athleticsBoards.length > 0 ? (
            <div className="stack-lg">
              {data.athleticsBoards.map((board) => (
                <AthleticsEventBoard key={board.id} board={board} />
              ))}
            </div>
          ) : (
            <div className="fixture-stack">
              {data.matches.length > 0 ? (
                data.matches.map((match) => <FixtureStrip key={match.id} match={match} />)
              ) : (
                <EmptyState
                  compact
                  eyebrow="Fixture Rail"
                  title="No fixtures for this sport yet"
                  description="Create sport fixtures from the control room to populate this board."
                  action={
                    <Link href="/admin/matches?mode=live" className="button button-ghost">
                      Open match control
                    </Link>
                  }
                />
              )}
            </div>
          )}
        </MotionIn>
      ) : null}
    </div>
  );
}
