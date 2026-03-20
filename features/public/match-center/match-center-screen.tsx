import Link from "next/link";

import type { MatchPageData } from "@/server/data/public/types";
import { formatDateTime } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { FixtureStrip, FreshnessStamp, ProgressPathCard, ShareMatchButton, StageBadge } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type MatchCenterScreenProps = {
  data: MatchPageData;
};

export function MatchCenterScreen({ data }: MatchCenterScreenProps) {
  const primaryTargetMatch = data.winnerTargetMatch ?? data.loserTargetMatch;
  const progressionSummary = data.winnerTargetMatch && data.loserTargetMatch
    ? `Winner moves into ${data.match.winnerToSlot} of ${data.winnerTargetMatch.round}; loser moves into ${data.match.loserToSlot} of ${data.loserTargetMatch.round}.`
    : data.winnerTargetMatch
      ? `Winner moves into ${data.match.winnerToSlot} of ${data.winnerTargetMatch.round}.`
      : data.loserTargetMatch
        ? `Loser moves into ${data.match.loserToSlot} of ${data.loserTargetMatch.round}.`
        : "This match does not feed into another bracket fixture.";

  return (
    <div className="stack-xl">
      <MotionIn>
        <div className="chip-row">
          <Link href={`/sports/${data.sport.id}`} className="chip">
            Back to {data.sport.name}
          </Link>
          <Link href={`/schedule?sport=${data.sport.id}`} className="chip">
            {data.sport.name} schedule
          </Link>
          <Link href="/standings" className="chip">
            Standings
          </Link>
        </div>
      </MotionIn>

      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow={`${data.sport.name} | ${data.match.stage?.label ?? data.match.round}`}
            kicker={formatDateTime(data.match.day, data.match.startTime)}
            title={`${data.match.teamA?.name ?? "TBD"} vs ${data.match.teamB?.name ?? "TBD"}`}
            description={`${data.match.venue} | ${data.match.result?.scoreSummary ?? "Result Pending"}`}
            tone={data.match.status === "live" ? "crimson" : data.match.status === "postponed" ? "crimson" : "blue"}
            intensity="premium"
            variant={data.match.winnerToMatchId || data.match.loserToMatchId ? "bracket-showcase" : "sport-masthead"}
            aside={
              <div className="score-spotlight score-spotlight-tight">
                <p className="eyebrow">Match status</p>
                <StageBadge
                  status={data.match.status}
                  label={data.match.status === "live" ? "LIVE" : data.match.status === "completed" ? "Final" : data.match.status === "postponed" ? "Postponed" : "Upcoming"}
                  tone={data.match.status === "live" ? "live" : undefined}
                />
                <h2>{data.match.result?.winner?.name ?? "TBD"}</h2>
                <strong>{data.match.result?.scoreSummary ?? "Result Pending"}</strong>
                <p>{data.match.result?.note ?? "Key updates and score changes will appear here once the match is underway."}</p>
                <FreshnessStamp generatedAt={data.generatedAt} />
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="detail-grid" delay={0.08}>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Match</p>
          <h2>{data.match.isBye ? "Bye" : data.match.status}</h2>
          <p>
            {data.match.venue} | {formatDateTime(data.match.day, data.match.startTime)}
          </p>
        </article>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Stage</p>
          <h2>{data.match.group ? `${data.match.group.code}` : data.match.round}</h2>
          <p>
            {data.match.stage?.label ?? "Standalone match"} | {data.match.result?.winner?.name ?? "Winner TBD"}
          </p>
        </article>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Bracket Path</p>
          <h2>{primaryTargetMatch?.round ?? "Standalone fixture"}</h2>
          <p>{progressionSummary}</p>
        </article>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Share</p>
          <h2>Send this match</h2>
          <p>Copy the match link or share it directly from your phone.</p>
          <ShareMatchButton href={`/matches/${data.match.id}`} title={`${data.match.teamA?.name ?? "TBD"} vs ${data.match.teamB?.name ?? "TBD"}`} />
        </article>
      </MotionIn>

      {data.lineage.length > 0 ? (
        <MotionIn className="detail-grid" delay={0.11}>
          {data.lineage.map((card) => (
            <ProgressPathCard key={card.label} card={card} />
          ))}
        </MotionIn>
      ) : null}

      <MotionIn className="section-shell" delay={0.12}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Related Matches</p>
            <h2>Linked and nearby fixtures</h2>
          </div>
        </div>
        <div className="fixture-stack">
          {data.bracketNeighbors.length > 0 ? (
            data.bracketNeighbors.map((relatedMatch) => <FixtureStrip key={relatedMatch.id} match={relatedMatch} />)
          ) : data.relatedMatches.length > 0 ? (
            data.relatedMatches.map((relatedMatch) => <FixtureStrip key={relatedMatch.id} match={relatedMatch} />)
          ) : (
            <EmptyState
              compact
              eyebrow="Related Matches"
              title="No linked matches yet"
              description="As the tournament fills out, related fixtures from this sport will appear here."
            />
          )}
        </div>
      </MotionIn>
    </div>
  );
}
