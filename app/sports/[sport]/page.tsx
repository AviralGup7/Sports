import { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BracketBoard } from "@/components/bracket-board";
import { BroadcastHero } from "@/components/broadcast-hero";
import { EmptyState } from "@/components/empty-state";
import { FixtureStrip } from "@/components/fixture-strip";
import { MotionIn } from "@/components/motion-in";
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

  const liveCount = data.matches.filter((match) => match.status === "live").length;

  return (
    <div className="stack-xl">
      <MotionIn>
        <BroadcastHero
          eyebrow="Sport Hub"
          kicker={data.sport.format}
          title={data.sport.name}
          description={data.sport.rulesSummary}
          accent={data.sport.color}
          aside={
            <div className="score-spotlight">
              <p className="eyebrow">Stage Status</p>
              <h2>{liveCount > 0 ? "Live Round" : "Bracket Map"}</h2>
              <strong>{data.teams.length} squads active</strong>
              <p>{liveCount > 0 ? `${liveCount} fixture boards are active right now.` : "Use the bracket and fixture rail below to track progression."}</p>
            </div>
          }
        />
      </MotionIn>

      <MotionIn className="section-shell" delay={0.08}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bracket View</p>
            <h2>Progression overview</h2>
          </div>
        </div>
        {data.bracket.length > 0 ? (
          <BracketBoard rounds={data.bracket} />
        ) : (
          <EmptyState
            eyebrow="Bracket View"
            title="Bracket will appear once rounds are linked"
            description="Set next-match progression in the control room to turn this sport hub into a connected bracket board."
          />
        )}
      </MotionIn>

      <MotionIn className="section-shell" delay={0.12}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Registered Sides</p>
            <h2>Association roster</h2>
          </div>
        </div>
        <div className="team-chip-grid">
          {data.teams.length > 0 ? (
            data.teams.map((team) => (
              <article key={team.id} className="team-chip-card" style={{ "--sport-accent": data.sport.color } as CSSProperties}>
                <strong>{team.name}</strong>
                <span>{team.association}</span>
                <small>Seed {team.seed}</small>
              </article>
            ))
          ) : (
            <EmptyState
              compact
              eyebrow="Registered Sides"
              title="No teams assigned yet"
              description="Attach teams to this sport in the admin roster and they will show up here."
            />
          )}
        </div>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.16}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Fixture Rail</p>
            <h2>Every round on one board</h2>
          </div>
          <Link href="/schedule" className="inline-link">
            Return to schedule
          </Link>
        </div>
        <div className="fixture-stack">
          {data.matches.length > 0 ? (
            data.matches.map((match) => <FixtureStrip key={match.id} match={match} />)
          ) : (
            <EmptyState
              compact
              eyebrow="Fixture Rail"
              title="No fixtures for this sport yet"
              description="Create sport fixtures from the control room to populate this board."
              action={
                <Link href="/admin/matches" className="button button-ghost">
                  Open match control
                </Link>
              }
            />
          )}
        </div>
      </MotionIn>
    </div>
  );
}
