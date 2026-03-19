import { CSSProperties } from "react";
import Link from "next/link";

import type { HomePageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { FixtureStrip, MetricTile, NewsBulletin, PodiumCard, StageSummaryRail } from "@/shared/ui";
import { MotionIn } from "@/shared/motion";

type HomeScreenProps = {
  data: HomePageData;
};

export function HomeScreen({ data }: HomeScreenProps) {
  const { tournament, sports, stats, highlightMatch, featuredMatches, announcements, championSpotlights, stageSummaries } = data;

  return (
    <div className="stack-hero">
      <MotionIn>
        <BroadcastHero
          eyebrow="Arena Broadcast"
          kicker={`${tournament.startDate} to ${tournament.endDate} | ${tournament.venue}`}
          title={tournament.name}
          description="A stage-aware tournament board for viewers, squads, and organizers. Follow live match centers, winner trees, standings swings, and control-room calls."
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
                  <span>{highlightMatch.match.stage?.label ?? highlightMatch.match.round}</span>
                </div>
                <h2>
                  {highlightMatch.match.teamA?.name ?? "TBD"}
                  <span>VS</span>
                  {highlightMatch.match.teamB?.name ?? "TBD"}
                </h2>
                <p>{highlightMatch.headline}</p>
                <strong>{highlightMatch.summary}</strong>
                <Link href={`/matches/${highlightMatch.match.id}`} className="inline-link">
                  Open match center
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
          value={stats.liveMatches}
          detail={stats.liveMatches > 0 ? "Boards currently active" : "Waiting for the next whistle"}
          accent="#22d3ee"
          pulse={stats.liveMatches > 0}
        />
        <MetricTile
          label="Results Locked"
          value={stats.completedMatches}
          detail={`${stats.matches} total fixtures in the tournament map`}
          accent="#fb7185"
        />
      </MotionIn>

      <MotionIn className="section-shell" delay={0.1}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Stage Progress</p>
            <h2>Today in tournament</h2>
          </div>
        </div>
        <StageSummaryRail
          summaries={stageSummaries
            .filter((item) => item.activeStage)
            .map((item) => ({
              stage: item.activeStage!,
              totalMatches: item.totalMatches,
              completedMatches: item.completedMatches,
              liveMatches: item.liveMatches,
              pendingMatches: item.totalMatches - item.completedMatches - item.liveMatches,
              groups: []
            }))}
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
            {championSpotlights.length > 0 ? (
              championSpotlights.map((spotlight, index) => <PodiumCard key={spotlight.sport.id} spotlight={spotlight} index={index} />)
            ) : (
              <EmptyState
                compact
                eyebrow="Champions"
                title="Podium is waiting"
                description="Finals have not been seeded yet, so no title spotlight is on the board."
              />
            )}
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
            {sports.length > 0 ? (
              sports.map((sport) => {
                const stage = stageSummaries.find((item) => item.sport.id === sport.id)?.activeStage;
                return (
                  <article key={sport.id} className="sport-poster" style={{ "--sport-accent": sport.color } as CSSProperties}>
                    <p className="eyebrow">{stage?.label ?? sport.format}</p>
                    <h3>{sport.name}</h3>
                    <p>{sport.rulesSummary}</p>
                    <Link href={`/sports/${sport.id}`} className="inline-link">
                      Enter {sport.name.toLowerCase()}
                    </Link>
                  </article>
                );
              })
            ) : (
              <EmptyState
                compact
                eyebrow="Sport Posters"
                title="Sports will appear here"
                description="Once the control room seeds sports, each arena lane gets its own poster card."
              />
            )}
          </div>
        </section>

        <section className="section-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Today In Tournament</p>
              <h2>Broadcast queue</h2>
            </div>
            <Link href="/schedule" className="inline-link">
              Open all timings
            </Link>
          </div>

          <div className="fixture-stack">
            {featuredMatches.length > 0 ? (
              featuredMatches.map((match) => <FixtureStrip key={match.id} match={match} showSport />)
            ) : (
              <EmptyState
                compact
                eyebrow="Fixture Queue"
                title="No fixtures in the queue"
                description="Add matches from the control room and this broadcast rail will populate automatically."
                action={
                  <Link href="/admin/matches?mode=live" className="button button-ghost">
                    Open match control
                  </Link>
                }
              />
            )}
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
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <NewsBulletin key={announcement.id} announcement={announcement} compact={index > 0} pinnedHero={index === 0 && announcement.pinned} />
              ))
            ) : (
              <EmptyState
                compact
                eyebrow="News Desk"
                title="Bulletins will land here"
                description="Published announcements and pinned headlines from organizers will appear on this feed."
              />
            )}
          </div>
        </section>
      </MotionIn>
    </div>
  );
}
