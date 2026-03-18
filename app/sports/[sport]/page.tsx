import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchCard } from "@/components/match-card";
import { getMatchesForSport, getSportBySlug, teams } from "@/lib/data";

type SportPageProps = {
  params: Promise<{
    sport: string;
  }>;
};

export default async function SportPage({ params }: SportPageProps) {
  const { sport: sportSlug } = await params;
  const sport = getSportBySlug(sportSlug);

  if (!sport) {
    notFound();
  }

  const sportTeams = teams.filter((team) => team.sportIds.includes(sport.id));
  const sportMatches = getMatchesForSport(sport.id);

  return (
    <div className="stack-xl">
      <section className="hero sport-hero">
        <div className="hero-copy">
          <p className="eyebrow">Sport detail</p>
          <h1>{sport.name}</h1>
          <p className="hero-text">{sport.rulesSummary}</p>
        </div>
        <div className="hero-panel">
          <p className="eyebrow">Format snapshot</p>
          <div className="hero-kicker">{sport.format}</div>
          <p>Color token ready for future design-system mapping.</p>
        </div>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Teams</p>
            <h2>Registered sides</h2>
          </div>
        </div>
        <div className="roster-grid">
          {sportTeams.map((team) => (
            <article key={team.id} className="roster-card">
              <p className="eyebrow">{team.association}</p>
              <h3>{team.name}</h3>
              <p className="muted">Seed {team.seed}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="stack-lg">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fixtures</p>
            <h2>Round flow</h2>
          </div>
          <Link href="/schedule" className="inline-link">
            Return to schedule
          </Link>
        </div>
        <div className="card-grid">
          {sportMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </div>
  );
}
