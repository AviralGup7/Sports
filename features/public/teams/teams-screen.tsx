import { CSSProperties } from "react";
import Link from "next/link";

import type { SportSlug } from "@/domain/sports/types";
import { getTeamAccent } from "@/lib/team-style";
import type { TeamsPageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { DataStateBanner, EmptyState } from "@/shared/feedback";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { FreshnessStamp } from "@/shared/ui";

type TeamsScreenProps = {
  data: TeamsPageData;
  selectedSport?: SportSlug;
};

export function TeamsScreen({ data, selectedSport }: TeamsScreenProps) {
  const selectedSportRecord = data.sports.find((sport) => sport.id === selectedSport);
  const visibleTeams = selectedSport ? data.teams.filter((entry) => entry.sports.some((sport) => sport.id === selectedSport)) : data.teams;
  const buildHref = (sport?: string) => (sport ? `/teams?sport=${sport}` : "/teams");

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Teams"
            title={selectedSportRecord ? `${selectedSportRecord.name} Associations` : "Association Grid"}
            description="Browse participating associations, filter by sport, and jump into the teams that matter for the current bracket picture."
            compact
            tone="amber"
            intensity="premium"
            variant="sport-masthead"
            aside={
              <div className="hero-aside-list hero-aside-list-cyber">
                <div>
                  <span className="aside-label">Visible teams</span>
                  <strong>{visibleTeams.length}</strong>
                </div>
                <div>
                  <span className="aside-label">Filter</span>
                  <strong>{selectedSportRecord?.name ?? "All sports"}</strong>
                </div>
                <FreshnessStamp generatedAt={data.generatedAt} />
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="filter-rail filter-rail-sticky" delay={0.06}>
        <div className="filter-rail-summary">
          <div>
            <p className="eyebrow">Browse teams</p>
            <h2>{selectedSportRecord?.name ?? "All sports"}</h2>
            <p className="muted">
              {visibleTeams.length} association{visibleTeams.length === 1 ? "" : "s"} in this view. Use sport filters to cut card noise and find the right roster faster.
            </p>
          </div>
          <div className="page-guide-actions">
            <Link href="/standings" className="button button-ghost">
              View standings
            </Link>
          </div>
        </div>

        <div className="filter-rail-meta">
          <span className="pill">{visibleTeams.length} teams</span>
          <span className="pill">{data.sports.length} sports</span>
          <DataStateBanner state={data.dataState} compact />
        </div>

        <div className="filter-block">
          <p className="eyebrow">Sport</p>
          <div className="chip-row">
            <Link href={buildHref()} className={!selectedSport ? "chip chip-active" : "chip"}>
              All sports
            </Link>
            {data.sports.map((sport) => (
              <Link key={sport.id} href={buildHref(sport.id)} className={selectedSport === sport.id ? "chip chip-active" : "chip"}>
                {sport.name}
              </Link>
            ))}
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
