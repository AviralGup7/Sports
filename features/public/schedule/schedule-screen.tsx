import Link from "next/link";

import type { SportSlug } from "@/domain/sports/types";
import type { SchedulePageData } from "@/server/data/public/types";
import { formatDateLabel, formatStatusLabel, getSportBySlugFromCollection } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { DayNoteBanner, FixtureStrip, StageTimeline } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type ScheduleScreenProps = {
  data: SchedulePageData;
  selectedSport?: SportSlug;
};

export function ScheduleScreen({ data, selectedSport }: ScheduleScreenProps) {
  const selectedSportRecord = getSportBySlugFromCollection(data.sports, selectedSport);
  const hasActiveFilters = Boolean(data.selectedSport || data.selectedStage || data.selectedGroup || data.selectedStatus);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = {
      day: data.selectedDay,
      sport: data.selectedSport,
      stage: data.selectedStage,
      group: data.selectedGroup,
      status: data.selectedStatus,
      ...overrides
    };

    for (const [key, value] of Object.entries(merged)) {
      if (value) {
        next.set(key, value);
      }
    }

    const query = next.toString();
    return query ? `/schedule?${query}` : "/schedule";
  };

  return (
    <div className="stack-xl">
      <MotionIn>
        <ScrollStorySection variant="hero">
          <BroadcastHero
            eyebrow="Fixture Board"
            kicker={formatDateLabel(data.selectedDay)}
            title={selectedSportRecord ? `${selectedSportRecord.name} Schedule` : "Tournament Schedule"}
            description="Scan the arena like a premium command surface. Filters now understand sport, stage, group, and board status with stage-aware lanes and live pressure."
            compact
            tone={selectedSportRecord ? "cyan" : "blue"}
            intensity="premium"
            variant="schedule-command"
            aside={
              <div className="hero-aside-list hero-aside-list-cyber">
                <div>
                  <span className="aside-label">Visible fixtures</span>
                  <strong>{data.fixtures.length}</strong>
                </div>
                <div>
                  <span className="aside-label">Active stage filter</span>
                  <strong>{data.selectedStage ? data.stages.find((stage) => stage.id === data.selectedStage)?.label ?? "Stage" : "All"}</strong>
                </div>
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn delay={0.06}>
        <DayNoteBanner note={data.dayNote} />
      </MotionIn>

      <MotionIn className="filter-rail" delay={0.08}>
        <div className="filter-block">
          <p className="eyebrow">Day</p>
          <div className="chip-row">
            {data.days.map((day) => (
              <Link key={day} href={buildHref({ day })} className={day === data.selectedDay ? "chip chip-active" : "chip"}>
                {formatDateLabel(day)}
              </Link>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <p className="eyebrow">Sport</p>
          <div className="chip-row">
            <Link href={buildHref({ sport: undefined, stage: undefined, group: undefined })} className={!data.selectedSport ? "chip chip-active" : "chip"}>
              All sports
            </Link>
            {data.sports.map((sport) => (
              <Link
                key={sport.id}
                href={buildHref({ sport: sport.id, stage: undefined, group: undefined })}
                className={data.selectedSport === sport.id ? "chip chip-active" : "chip"}
              >
                {sport.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <p className="eyebrow">Stage</p>
          <StageTimeline stages={data.stages} selectedStageId={data.selectedStage} hrefBuilder={(stageId) => buildHref({ stage: stageId, group: undefined })} />
        </div>

        {data.groups.length > 0 ? (
          <div className="filter-block">
            <p className="eyebrow">Group</p>
            <div className="chip-row">
              <Link href={buildHref({ group: undefined })} className={!data.selectedGroup ? "chip chip-active" : "chip"}>
                All groups
              </Link>
              {data.groups.map((group) => (
                <Link key={group.id} href={buildHref({ group: group.id })} className={data.selectedGroup === group.id ? "chip chip-active" : "chip"}>
                  {group.code}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="filter-block">
          <p className="eyebrow">Status</p>
          <div className="chip-row">
            <Link href={buildHref({ status: undefined })} className={!data.selectedStatus ? "chip chip-active" : "chip"}>
              Any status
            </Link>
            {["scheduled", "live", "completed", "postponed"].map((status) => (
              <Link key={status} href={buildHref({ status })} className={data.selectedStatus === status ? "chip chip-active" : "chip"}>
                {formatStatusLabel(status)}
              </Link>
            ))}
          </div>
        </div>

        {hasActiveFilters ? (
          <div className="filter-block filter-block-compact">
            <p className="eyebrow">Reset</p>
            <div className="chip-row">
              <Link href={buildHref({ sport: undefined, stage: undefined, group: undefined, status: undefined })} className="chip">
                Clear filters
              </Link>
            </div>
          </div>
        ) : null}
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.12}>
        {!selectedSport && data.sportBlocks.length > 0 ? (
          <section className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Quick Sport Jump</p>
                <h2>Visible sport lanes</h2>
              </div>
            </div>
            <div className="chip-row">
              {data.sportBlocks.map((block) => (
                <Link key={`jump-${block.sport.id}`} href={buildHref({ sport: block.sport.id, stage: undefined, group: undefined })} className="chip">
                  {block.sport.name} {block.visibleCount}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {!selectedSport && data.sportBlocks.length > 0 ? (
          data.sportBlocks.map((block) => (
            <section key={block.sport.id} className="section-shell schedule-sport-block">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{block.activeStageLabel}</p>
                  <h2>{block.sport.name}</h2>
                </div>
                <span className="pill">{block.visibleCount} boards</span>
              </div>
              <div className="stack-lg">
                {block.scheduleGroups.map((group) => (
                  <section key={`${block.sport.id}-${group.time}`} className="timeline-group timeline-group-cyber">
                    <div className="timeline-marker">
                      <p className="eyebrow">Time Slot</p>
                      <h2>{group.label}</h2>
                      <span>{group.matches.length} boards</span>
                    </div>
                    <div className="timeline-stack">
                      {group.matches.map((match) => (
                        <FixtureStrip key={match.id} match={match} />
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
                <p className="eyebrow">Time Slot</p>
                <h2>{group.label}</h2>
                <span>{group.matches.length} boards</span>
              </div>
              <div className="timeline-stack">
                {group.matches.map((match) => (
                  <FixtureStrip key={match.id} match={match} showSport={!selectedSport} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <EmptyState
            eyebrow="Fixture Board"
            title="No fixtures match this filter"
            description="Try another day, sport, stage, or status filter, or seed more matches from the admin control room."
            action={
              <Link href="/admin/matches?mode=live" className="button button-ghost">
                Open match control
              </Link>
            }
          />
        )}
      </MotionIn>
    </div>
  );
}
