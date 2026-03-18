import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchCard } from "@/components/match-card";
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
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            {data.sport.name} · {data.match.round}
          </p>
          <h1>{data.match.teamA?.name ?? "TBD"} vs {data.match.teamB?.name ?? "TBD"}</h1>
          <p className="hero-text">
            {formatDateTime(data.match.day, data.match.startTime)} at {data.match.venue}
          </p>
        </div>

        <div className="hero-panel">
          <p className="eyebrow">Result status</p>
          <div className="hero-kicker">{data.match.status}</div>
          {data.match.result?.scoreSummary ? (
            <p>{data.match.result.scoreSummary}</p>
          ) : (
            <p>Score entry will appear here once the result is saved.</p>
          )}
          {data.match.result?.winner ? <p className="muted">Winner: {data.match.result.winner.name}</p> : null}
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="eyebrow">Match note</p>
          <h2>Summary</h2>
          <p>{data.match.result?.note ?? "No note has been added yet for this fixture."}</p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Progression</p>
          <h2>Next slot</h2>
          <p>
            {data.match.nextMatchId
              ? `Winner advances to ${data.match.nextMatchId} in slot ${data.match.nextSlot}.`
              : "This fixture does not advance into another bracket slot."}
          </p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Admin handoff</p>
          <h2>Result entry</h2>
          <p>Organizers can update this fixture from the admin matches page.</p>
          <Link href="/admin/matches" className="inline-link">
            Go to admin matches
          </Link>
        </article>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Same sport</p>
            <h2>Related fixtures</h2>
          </div>
        </div>
        <div className="card-grid">
          {data.relatedMatches.map((relatedMatch) => (
            <MatchCard key={relatedMatch.id} match={relatedMatch} />
          ))}
        </div>
      </section>
    </div>
  );
}
