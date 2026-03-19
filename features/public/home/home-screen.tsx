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
  const { tournament, sports, stats, highlightMatch, heroSignals, featuredMatches, announcements, championSpotlights, stageSummaries } = data;

  return (
    <div className="stack-hero">
      <MotionIn>
        <BroadcastHero
          eyebrow="Cyber Arena Broadcast"
          kicker={`${tournament.startDate} to ${tournament.endDate} | ${tournament.venue}`}
          title={tournament.name}
          description="A premium tournament experience built like a live broadcast package. Track spotlight fixtures, title pressure, animated winner trees, and headline calls across the arena."
          tone={highlightMatch?.urgency === "live" ? "cyan" : highlightMatch?.urgency === "watch" ? "crimson" : "blue"}
          intensity="cinematic"
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
                  <span className="spotlight-chip">{highlightMatch.urgency === "live" ? "Now Charging" : highlightMatch.urgency === "watch" ? "Delay Watch" : "Next Up"}</span>
                </div>
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
                <div className="spotlight-actions">
                  <Link href={`/matches/${highlightMatch.match.id}`} className="inline-link">
                    Open match center
                  </Link>
                  <Link href={`/sports/${highlightMatch.sport.id}?tab=bracket`} className="inline-link">
                    Open winner tree
                  </Link>
                </div>
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
        <MetricTile label="Sports" value={stats.sports} detail="Color-coded tournament lanes" accent="#f59e0b" href="/schedule" />
        <MetricTile label="Active Teams" value={stats.teams} detail="Associations on the board" accent="#38bdf8" href="/admin/teams" />
        <MetricTile
          label="Live Now"
          value={stats.liveMatches}
          detail={stats.liveMatches > 0 ? "Boards currently active" : "Waiting for the next whistle"}
          accent="#22d3ee"
          pulse={stats.liveMatches > 0}
          href="/schedule?status=live"
        />
        <MetricTile
          label="Results Locked"
          value={stats.completedMatches}
          detail={`${stats.matches} total fixtures in the tournament map`}
          accent="#fb7185"
          href="/schedule?status=completed"
        />
      </MotionIn>

      <MotionIn className="home-showcase-grid" delay={0.1}>
        <section className="section-shell section-shell-holo">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Stage Progress</p>
              <h2>Arena lanes</h2>
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
        </section>

        <section className="section-shell section-shell-radar">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Headlines</p>
              <h2>Signal stack</h2>
            </div>
          </div>
          <div className="signal-stack">
            {heroSignals.map((signal) => (
              <Link key={`${signal.id}-stack`} href={signal.href ?? "/"} className={`signal-card signal-card-${signal.tone}`}>
                <span>{signal.label}</span>
                <strong>{signal.value}</strong>
                <small>{signal.detail}</small>
              </Link>
            ))}
          </div>
        </section>
      </MotionIn>

      <MotionIn className="stack-xl" delay={0.12}>
        <section className="section-shell section-shell-podium">
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

        <section className="section-shell section-shell-posters" id="sports-spotlight">
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
                    <div className="sport-poster-meta">
                      <span>{stage ? "Active stage live" : "Structure ready"}</span>
                      <span>{sport.format}</span>
                    </div>
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

        <section className="section-shell section-shell-broadcast">
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

        <section className="section-shell section-shell-newsdesk">
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
