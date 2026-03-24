import Link from "next/link";

import type { StandingsPageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { DataStateBanner, EmptyState } from "@/shared/feedback";
import { FreshnessStamp, StandingsTable } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type StandingsScreenProps = {
  data: StandingsPageData;
};

export function StandingsScreen({ data }: StandingsScreenProps) {
  const buildHref = (sport?: string) => (sport ? `/standings?sport=${sport}` : "/standings");

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Standings"
            title="Tournament Tables"
            description="See who is leading each sport, how knockout results are stacking up, and where the title race stands."
            compact
            tone="blue"
            intensity="premium"
            variant="schedule-command"
            aside={
              <div className="hero-aside-list hero-aside-list-cyber">
                <div>
                  <span className="aside-label">Sports tracked</span>
                  <strong>{data.sections.length}</strong>
                </div>
                <div>
                  <span className="aside-label">Active filter</span>
                  <strong>{data.selectedSport ?? "All sports"}</strong>
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

      <MotionIn className="filter-rail" delay={0.06}>
        <div className="filter-block">
          <p className="eyebrow">Sport</p>
          <div className="chip-row">
            <Link href={buildHref()} className={!data.selectedSport ? "chip chip-active" : "chip"}>
              All sports
            </Link>
            {data.sports.map((sport) => (
              <Link key={sport.id} href={buildHref(sport.id)} className={data.selectedSport === sport.id ? "chip chip-active" : "chip"}>
                {sport.name}
              </Link>
            ))}
          </div>
        </div>
      </MotionIn>

      {data.sections.length > 0 ? (
        data.sections.map((section, index) => (
          <MotionIn key={section.sport.id} className="section-shell" delay={0.08 + index * 0.02}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">{section.sport.name}</p>
                <h2>{section.liveMatches > 0 ? "Live standings" : "Current table"}</h2>
              </div>
              <div className="page-guide-actions">
                <span className="pill">{section.completedMatches} results in</span>
                <Link href={`/sports/${section.sport.id}?tab=standings`} className="inline-link">
                  Open {section.sport.name}
                </Link>
              </div>
            </div>
            <StandingsTable cards={section.cards} />
          </MotionIn>
        ))
      ) : (
        <MotionIn className="section-shell" delay={0.08}>
          <EmptyState
            eyebrow="Standings"
            title="No standings available in this view"
            description="Knockout summary tables appear once enough results are recorded for the selected sport."
          />
        </MotionIn>
      )}
    </div>
  );
}
