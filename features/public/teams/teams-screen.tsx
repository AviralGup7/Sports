import { CSSProperties } from "react";
import Link from "next/link";

import { getTeamAccent } from "@/lib/team-style";
import type { TeamsPageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { DataStateBanner, EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { FreshnessStamp } from "@/shared/ui";

type TeamsScreenProps = {
  data: TeamsPageData;
};

export function TeamsScreen({ data }: TeamsScreenProps) {
  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Teams"
            title="Association Grid"
            description="Browse every participating association, see which sports they are playing, and jump into their latest results."
            compact
            tone="amber"
            intensity="premium"
            variant="sport-masthead"
            aside={
              <div className="hero-aside-list hero-aside-list-cyber">
                <div>
                  <span className="aside-label">Associations</span>
                  <strong>{data.teams.length}</strong>
                </div>
                <div>
                  <span className="aside-label">Sports in play</span>
                  <strong>{data.sports.length}</strong>
                </div>
                <FreshnessStamp generatedAt={data.generatedAt} />
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn delay={0.04}>
        <DataStateBanner state={data.dataState} compact />
      </MotionIn>

      <MotionIn className="team-chip-grid" delay={0.08}>
        {data.teams.length > 0 ? (
          data.teams.map((entry) => (
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
