import Link from "next/link";

import type { StandingsPageData } from "@/server/data/public/types";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { StandingsTable } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type StandingsScreenProps = {
  data: StandingsPageData;
};

export function StandingsScreen({ data }: StandingsScreenProps) {
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
          />
        </ScrollStorySection>
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
