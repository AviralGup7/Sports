import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchCard } from "@/components/match-card";
import { formatDateTime, getMatchById, getRelatedMatches, getSportBySlug, getTeamById } from "@/lib/data";

type MatchPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;
  const match = getMatchById(matchId);

  if (!match) {
    notFound();
  }

  const sport = getSportBySlug(match.sportId);
  const teamA = getTeamById(match.teamAId);
  const teamB = getTeamById(match.teamBId);
  const winner = match.winnerTeamId ? getTeamById(match.winnerTeamId) : undefined;
  const relatedMatches = getRelatedMatches(match).slice(0, 3);

  return (
    <div className="stack-xl">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{sport?.name} · {match.round}</p>
          <h1>{teamA?.name} vs {teamB?.name}</h1>
          <p className="hero-text">
            {formatDateTime(match.day, match.startTime)} at {match.venue}
          </p>
        </div>

        <div className="hero-panel">
          <p className="eyebrow">Result status</p>
          <div className="hero-kicker">{match.status}</div>
          {match.scoreSummary ? <p>{match.scoreSummary}</p> : <p>Score entry will appear here once the result is saved.</p>}
          {winner ? <p className="muted">Winner: {winner.name}</p> : null}
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="eyebrow">Match note</p>
          <h2>Summary</h2>
          <p>{match.note ?? "No note has been added yet for this fixture."}</p>
        </article>
        <article className="detail-card">
          <p className="eyebrow">Admin handoff</p>
          <h2>Ready for result entry</h2>
          <p>
            This detail route already matches the planned data shape, so the next step is wiring it to server-backed
            result updates and permissions.
          </p>
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
          {relatedMatches.map((relatedMatch) => (
            <MatchCard key={relatedMatch.id} match={relatedMatch} />
          ))}
        </div>
      </section>
    </div>
  );
}
