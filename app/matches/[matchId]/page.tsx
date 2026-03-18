import Link from "next/link";
import { notFound } from "next/navigation";

import { BroadcastHero } from "@/components/broadcast-hero";
import { EmptyState } from "@/components/empty-state";
import { FixtureStrip } from "@/components/fixture-strip";
import { MotionIn } from "@/components/motion-in";
import { StageBadge } from "@/components/stage-badge";
import { formatDateTime, getMatchPageData } from "@/lib/data";

type MatchPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;
  const data = await getMatchPageData(matchId);

  if (!data) {
    notFound();
  }

  return (
    <div className="stack-xl">
      <MotionIn>
        <BroadcastHero
          eyebrow={`${data.sport.name} | ${data.match.round}`}
          kicker={formatDateTime(data.match.day, data.match.startTime)}
          title={`${data.match.teamA?.name ?? "TBD"} vs ${data.match.teamB?.name ?? "TBD"}`}
          description={`${data.match.venue} | ${data.match.result?.scoreSummary ?? "Awaiting scoreboard update"}`}
          aside={
            <div className="score-spotlight score-spotlight-tight">
              <p className="eyebrow">Result Status</p>
              <StageBadge status={data.match.status} label={data.match.status} />
              <h2>{data.match.result?.winner?.name ?? "No winner yet"}</h2>
              <strong>{data.match.result?.scoreSummary ?? "Score line pending"}</strong>
              <p>{data.match.result?.note ?? "Control room notes will land here once organizers update the result."}</p>
            </div>
          }
        />
      </MotionIn>

      <MotionIn className="detail-grid" delay={0.08}>
        <article className="detail-card">
          <p className="eyebrow">Venue</p>
          <h2>{data.match.venue}</h2>
          <p>{formatDateTime(data.match.day, data.match.startTime)}</p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Progression</p>
          <h2>{data.match.nextMatchId ?? "Standalone fixture"}</h2>
          <p>
            {data.match.nextMatchId
              ? `Winner advances into ${data.match.nextSlot} of ${data.match.nextMatchId}.`
              : "No next-slot link is configured for this board."}
          </p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Organizer Access</p>
          <h2>Backstage update</h2>
          <p>Officials can save scores, notes, and winner progression from the admin control room.</p>
          <Link href="/admin/matches" className="inline-link">
            Open control room
          </Link>
        </article>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.12}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Same Sport</p>
            <h2>More from this bracket</h2>
          </div>
        </div>
        <div className="fixture-stack">
          {data.relatedMatches.length > 0 ? (
            data.relatedMatches.map((relatedMatch) => <FixtureStrip key={relatedMatch.id} match={relatedMatch} />)
          ) : (
            <EmptyState
              compact
              eyebrow="Related Fixtures"
              title="No linked fixtures yet"
              description="Once the bracket fills out, nearby matches from the same sport will appear here."
            />
          )}
        </div>
      </MotionIn>
    </div>
  );
}
