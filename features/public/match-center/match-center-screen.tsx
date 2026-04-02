import Link from "next/link";

import type { MatchPageData } from "@/server/data/public/types";
import { formatDateTime, formatRoundLabel, getMatchDisplayLabel, isMatchCompleteForDisplay, isMatchLiveForDisplay, supportsLiveScoring } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { FixtureStrip, ProgressPathCard } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type MatchCenterScreenProps = {
  data: MatchPageData;
};

export function MatchCenterScreen({ data }: MatchCenterScreenProps) {
  const roundLabel = formatRoundLabel(data.match.round);
  const matchStateLabel = getMatchDisplayLabel(data.match);
  const liveNow = isMatchLiveForDisplay(data.match);
  const liveScoringEnabled = supportsLiveScoring(data.match.sportId);
  const completeNow = isMatchCompleteForDisplay(data.match);
  const primaryTargetMatch = data.winnerTargetMatch ?? data.loserTargetMatch;
  const progressionSummary = data.winnerTargetMatch && data.loserTargetMatch
    ? `Winner moves into ${data.match.winnerToSlot} of ${formatRoundLabel(data.winnerTargetMatch.round)}; loser moves into ${data.match.loserToSlot} of ${formatRoundLabel(data.loserTargetMatch.round)}.`
    : data.winnerTargetMatch
      ? `Winner moves into ${data.match.winnerToSlot} of ${formatRoundLabel(data.winnerTargetMatch.round)}.`
      : data.loserTargetMatch
        ? `Loser moves into ${data.match.loserToSlot} of ${formatRoundLabel(data.loserTargetMatch.round)}.`
        : "This match does not feed into another knockout fixture.";

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow={`${data.sport.name} | ${data.match.stage?.label ?? roundLabel}`}
            kicker={formatDateTime(data.match.day, data.match.startTime)}
            title={`${data.match.teamA?.name ?? "TBD"} vs ${data.match.teamB?.name ?? "TBD"}`}
            description={`${data.match.venue} | ${data.match.result?.scoreSummary ?? "Result Pending"}`}
            tone={matchStateLabel === "Rescheduled" ? "crimson" : liveNow ? "crimson" : "blue"}
            intensity="premium"
            variant={data.match.winnerToMatchId || data.match.loserToMatchId ? "bracket-showcase" : "sport-masthead"}
            actions={
              <>
                <Link href={`/sports/${data.sport.id}`} className="button button-ghost">
                  Back to {data.sport.name}
                </Link>
                <Link href={`/schedule?sport=${data.sport.id}`} className="button button-ghost">
                  {data.sport.name} schedule
                </Link>
              </>
            }
            aside={
              <div className="score-spotlight score-spotlight-tight">
                <p className="eyebrow">Match status</p>
                <span className="pill">{matchStateLabel}</span>
                <h2>{data.match.result?.winner?.name ?? "TBD"}</h2>
                <strong>{data.match.result?.scoreSummary ?? "Result Pending"}</strong>
                <p>{data.match.result?.note ?? progressionSummary}</p>
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="detail-grid detail-grid-compact" delay={0.08}>
        <article className="detail-card detail-card-cyber">
          <p className="eyebrow">Matchday</p>
          <h2>{data.match.stage?.label ?? roundLabel}</h2>
          <p>
            {data.match.venue} | {formatDateTime(data.match.day, data.match.startTime)}
          </p>
        </article>
        {primaryTargetMatch || data.match.winnerToMatchId || data.match.loserToMatchId ? (
          <article className="detail-card detail-card-cyber">
            <p className="eyebrow">Knockout Path</p>
            <h2>{primaryTargetMatch?.round ?? "Linked fixture"}</h2>
            <p>{progressionSummary}</p>
          </article>
        ) : null}
        {!primaryTargetMatch && !data.match.winnerToMatchId && !data.match.loserToMatchId && !completeNow ? (
          <article className="detail-card detail-card-cyber">
            <p className="eyebrow">State</p>
            <h2>{matchStateLabel}</h2>
            <p>
              {liveScoringEnabled
                ? "Cricket live state is derived from the fixture slot and any saved score updates."
                : "This sport shows published fixtures until a final result is saved."}
            </p>
          </article>
        ) : null}
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
