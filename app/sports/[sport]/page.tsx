import Link from "next/link";
import { notFound } from "next/navigation";

import { BracketBoard } from "@/components/bracket-board";
import { MatchCard } from "@/components/match-card";
import { getSportPageData } from "@/lib/data";
import { sportOrder } from "@/lib/mock-data";
import { SportSlug } from "@/lib/types";

type SportPageProps = {
  params: Promise<{
    sport: string;
  }>;
};

export default async function SportPage({ params }: SportPageProps) {
  const { sport: sportSlug } = await params;
  if (!sportOrder.includes(sportSlug as SportSlug)) {
    notFound();
  }

  const data = await getSportPageData(sportSlug as SportSlug);
  if (!data) {
    notFound();
  }

  return (
    <div className="stack-xl">
      <section className="hero sport-hero">
        <div className="hero-copy">
          <p className="eyebrow">Sport detail</p>
          <h1>{data.sport.name}</h1>
          <p className="hero-text">{data.sport.rulesSummary}</p>
        </div>
        <div className="hero-panel">
          <p className="eyebrow">Format snapshot</p>
          <div className="hero-kicker">{data.sport.format}</div>
          <p>Bracket flow uses stored `next_match_id` and `next_slot` links.</p>
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
          {data.teams.map((team) => (
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
            <p className="eyebrow">Bracket</p>
            <h2>Progression overview</h2>
          </div>
        </div>
        <BracketBoard rounds={data.bracket} />
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
          {data.matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </div>
  );
}
