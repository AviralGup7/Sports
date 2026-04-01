import { CSSProperties } from "react";
import Link from "next/link";

import type { SportSlug } from "@/domain/sports/types";
import { getTeamAccent } from "@/lib/team-style";
import type { TeamsPageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type TeamsScreenProps = {
  data: TeamsPageData;
  selectedSport?: SportSlug;
};

export function TeamsScreen({ data, selectedSport }: TeamsScreenProps) {
  const selectedSportRecord = data.sports.find((sport) => sport.id === selectedSport);
  const visibleTeams = selectedSport ? data.teams.filter((entry) => entry.sports.some((sport) => sport.id === selectedSport)) : data.teams;

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Teams"
            title={selectedSportRecord ? `${selectedSportRecord.name} Association Profiles` : "Association Profiles"}
            description="Browse participating associations and jump straight into the team profiles that matter for the current tournament picture."
            compact
            tone="amber"
            intensity="premium"
            variant="sport-masthead"
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="section-shell" delay={0.06}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Teams</p>
            <h2>Association list</h2>
          </div>
          <div className="page-guide-actions">
            <span className="pill">{visibleTeams.length} teams</span>
            <Link href="/standings" className="button button-ghost">
              View standings
            </Link>
          </div>
        </div>
      </MotionIn>

      <MotionIn className="team-chip-grid" delay={0.08}>
        {visibleTeams.length > 0 ? (
          visibleTeams.map((entry) => (
            <article
              key={entry.team.id}
              className="team-chip-card team-profile-card team-profile-card-accent"
              style={{ "--team-accent": getTeamAccent(entry.team) } as CSSProperties}
            >
              <p className="eyebrow">{entry.team.association}</p>
              <h3>{entry.team.name}</h3>
              <div className="team-tag-row">
                {entry.sports.map((sport) => (
                  <span key={sport.id} className="pill">
                    {sport.name}
                  </span>
                ))}
              </div>
              <div className="team-stat-row">
                <span>{entry.liveMatches.length} live</span>
                <span>{entry.upcomingMatches.length} upcoming</span>
                <span>{entry.completedMatches.length} results</span>
              </div>
              <Link href={`/teams/${entry.team.id}`} className="inline-link">
                View profile
              </Link>
            </article>
          ))
        ) : (
          <EmptyState eyebrow="Teams" title="No associations available yet" description="Team profiles will appear here once the tournament roster is published." />
        )}
      </MotionIn>
    </div>
  );
}
