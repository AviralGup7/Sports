import Link from "next/link";

import type { MatchPageData } from "@/server/data/public/types";
import { formatDateTime } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { FixtureStrip, ProgressPathCard, StageBadge } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type MatchCenterScreenProps = {
  data: MatchPageData;
};

export function MatchCenterScreen({ data }: MatchCenterScreenProps) {
  const primaryTargetMatch = data.winnerTargetMatch ?? data.loserTargetMatch;
  const progressionSummary = data.winnerTargetMatch && data.loserTargetMatch
    ? `Winner advances into ${data.match.winnerToSlot} of ${data.winnerTargetMatch.round}; loser routes into ${data.match.loserToSlot} of ${data.loserTargetMatch.round}.`
    : data.winnerTargetMatch
      ? `Winner advances into ${data.match.winnerToSlot} of ${data.winnerTargetMatch.round}.`
      : data.loserTargetMatch
        ? `Loser routes into ${data.match.loserToSlot} of ${data.loserTargetMatch.round}.`
        : "No linked progression is configured for this board.";

  return (
    <div className="stack-xl">
      <MotionIn>
        <Link href={`/sports/${data.sport.id}`} className="inline-link">
          Back to {data.sport.name}
        </Link>
      </MotionIn>

      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow={`${data.sport.name} | ${data.match.stage?.label ?? data.match.round}`}
            kicker={formatDateTime(data.match.day, data.match.startTime)}
            title={`${data.match.teamA?.name ?? "TBD"} vs ${data.match.teamB?.name ?? "TBD"}`}
            description={`${data.match.venue} | ${data.match.result?.scoreSummary ?? "Awaiting scoreboard update"}`}
            tone={data.match.status === "live" ? "cyan" : data.match.status === "postponed" ? "crimson" : "blue"}
            intensity="premium"
            variant={data.match.winnerToMatchId || data.match.loserToMatchId ? "bracket-showcase" : "sport-masthead"}
            aside={
              <div className="score-spotlight score-spotlight-tight">
                <p className="eyebrow">Match Center</p>
                <StageBadge status={data.match.status} label={data.match.isBye ? "bye" : data.match.status} tone={data.match.isBye ? "alert" : undefined} />
                <h2>{data.match.result?.winner?.name ?? "No winner yet"}</h2>
                <strong>{data.match.result?.scoreSummary ?? "Score line pending"}</strong>
                <p>{data.match.result?.note ?? "Control room notes will land here once organizers update the result."}</p>
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="detail-grid" delay={0.08}>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Stage Path</p>
          <h2>{data.match.group ? `${data.match.group.code}` : data.match.round}</h2>
          <p>
            {data.match.stage?.label ?? "Standalone board"} | {formatDateTime(data.match.day, data.match.startTime)}
          </p>
        </article>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Feeds Into</p>
          <h2>{primaryTargetMatch?.round ?? "Standalone fixture"}</h2>
          <p>{progressionSummary}</p>
        </article>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Organizer Access</p>
          <h2>Backstage update</h2>
          <p>Officials can save scores, notes, postponements, and winner progression from the admin control room.</p>
          <Link href={`/admin/matches?mode=live&sport=${data.sport.id}`} className="inline-link">
            Open control room
          </Link>
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
            <p className="eyebrow">Bracket Neighbors</p>
            <h2>Linked and nearby boards</h2>
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
              eyebrow="Related Fixtures"
              title="No linked fixtures yet"
              description="Once the stage tree fills out, neighboring boards from this bracket will appear here."
            />
          )}
        </div>
      </MotionIn>
    </div>
  );
}
