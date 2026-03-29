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
  const selectedSportRecord = data.sports.find((sport) => sport.id === data.selectedSport);
  const buildHref = (sport?: string) => (sport ? `/standings?sport=${sport}` : "/standings");

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Standings"
            title="Tournament Tables"
            description="Use this page as the quickest reference for who is leading, who has results in, and which sports still need separation."
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
            <p className="eyebrow">Reference view</p>
            <h2>{selectedSportRecord?.name ?? "All sports"} standings</h2>
            <p className="muted">
              {data.sections.length} table section{data.sections.length === 1 ? "" : "s"} ready to browse. Pick a sport to remove extra scanning.
            </p>
          </div>
          <div className="page-guide-actions">
            <Link href="/schedule" className="button button-ghost">
              Open schedule
            </Link>
          </div>
        </div>

        <div className="filter-rail-meta">
          <span className="pill">{data.sections.length} sections</span>
          <span className="pill">{selectedSportRecord?.name ?? "All sports"}</span>
          <DataStateBanner state={data.dataState} compact />
        </div>

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
                <p className="muted">
                  {section.completedMatches} result{section.completedMatches === 1 ? "" : "s"} recorded{section.liveMatches > 0 ? `, ${section.liveMatches} live now.` : "."}
                </p>
              </div>
              <div className="page-guide-actions">
                <span className="pill">{section.completedMatches} results in</span>
                <Link href={`/sports/${section.sport.id}?tab=standings#sport-standings`} className="inline-link">
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
