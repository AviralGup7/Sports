import Link from "next/link";

import type { SportSlug } from "@/domain/sports/types";
import type { SchedulePageData } from "@/server/data/public/types";
import { formatDateLabel, getSportBySlugFromCollection } from "@/server/data/formatters";
import { EmptyState } from "@/shared/feedback";
import { BroadcastHero } from "@/shared/layout";
import { MotionIn, ScrollStorySection } from "@/shared/motion";
import { FixtureStrip } from "@/shared/ui";

type ScheduleScreenProps = {
  data: SchedulePageData;
  selectedSport?: SportSlug;
};

export function ScheduleScreen({ data, selectedSport }: ScheduleScreenProps) {
  const selectedSportRecord = getSportBySlugFromCollection(data.sports, selectedSport);

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Schedule"
            kicker={formatDateLabel(data.selectedDay)}
            title={selectedSportRecord ? `${selectedSportRecord.name} Matches` : "Tournament Schedule"}
            description="Browse the published fixtures and jump straight into match details."
            compact
            tone={selectedSportRecord ? "cyan" : "blue"}
            intensity="premium"
            variant="schedule-command"
            actions={<Link href="/standings" className="button button-ghost">View standings</Link>}
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.12}>
        {!selectedSport && data.sportBlocks.length > 0 ? (
          data.sportBlocks.map((block) => (
            <section key={block.sport.id} className="section-shell schedule-sport-block">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{block.activeStageLabel}</p>
                  <h2>{block.sport.name}</h2>
                </div>
                <span className="pill">{block.visibleCount} matches</span>
              </div>
              <div className="stack-lg">
                {block.scheduleGroups.map((group) => (
                  <section key={`${block.sport.id}-${group.time}`} className="timeline-group timeline-group-cyber">
                    <div className="timeline-marker">
                      <p className="eyebrow">Time</p>
                      <h2>{group.label}</h2>
                      <span>{group.matches.length} matches</span>
                    </div>
                    <div className="timeline-stack">
                      {group.matches.map((match) => (
                        <FixtureStrip key={match.id} match={match} emphasizeTeamSpacing />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))
        ) : data.scheduleGroups.length > 0 ? (
          data.scheduleGroups.map((group) => (
            <section key={group.time} className="timeline-group timeline-group-cyber">
              <div className="timeline-marker">
                <p className="eyebrow">Time</p>
                <h2>{group.label}</h2>
                <span>{group.matches.length} matches</span>
              </div>
              <div className="timeline-stack">
                {group.matches.map((match) => (
                  <FixtureStrip key={match.id} match={match} showSport={!selectedSport} emphasizeTeamSpacing={!selectedSport} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <EmptyState eyebrow="Schedule" title="No fixtures in this view" description="Try another day, sport, or status to bring more fixtures into view." />
        )}
      </MotionIn>
    </div>
  );
}
