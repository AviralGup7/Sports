import Link from "next/link";

import type { SportSlug } from "@/domain/sports/types";
import type { SchedulePageData } from "@/server/data/public/types";
import { formatDateLabel, formatStatusLabel, getSportBySlugFromCollection } from "@/server/data/formatters";
import { BroadcastHero } from "@/shared/layout";
import { EmptyState } from "@/shared/feedback";
import { DayNoteBanner, FixtureStrip, FreshnessStamp, StageTimeline } from "@/shared/ui";
import { MotionIn, ScrollStorySection } from "@/shared/motion";

type ScheduleScreenProps = {
  data: SchedulePageData;
  selectedSport?: SportSlug;
};

export function ScheduleScreen({ data, selectedSport }: ScheduleScreenProps) {
  const selectedSportRecord = getSportBySlugFromCollection(data.sports, selectedSport);
  const hasActiveFilters = Boolean(data.selectedSport || data.selectedStage || data.selectedGroup || data.selectedStatus);
  const selectedStageLabel = data.selectedStage ? data.stages.find((stage) => stage.id === data.selectedStage)?.label ?? "Selected stage" : "All stages";
  const selectedGroupLabel = data.selectedGroup ? data.groups.find((group) => group.id === data.selectedGroup)?.code ?? "Selected group" : "All groups";
  const selectedStatusLabel = data.selectedStatus ? formatStatusLabel(data.selectedStatus) : "Any status";

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
            eyebrow="Schedule"
            kicker={formatDateLabel(data.selectedDay)}
            title={selectedSportRecord ? `${selectedSportRecord.name} Matches` : "Tournament Schedule"}
            description="Browse today’s fixtures, narrow by sport or stage, and jump straight into match details."
            compact
            tone={selectedSportRecord ? "cyan" : "blue"}
            intensity="premium"
            variant="schedule-command"
            actions={
              <>
                <Link href={buildHref({ status: undefined })} className={!data.selectedStatus ? "button" : "button button-ghost"}>
                  All
                </Link>
                <Link href={buildHref({ status: "live" })} className={data.selectedStatus === "live" ? "button" : "button button-ghost"}>
                  Live
                </Link>
                <Link href={buildHref({ status: "completed" })} className={data.selectedStatus === "completed" ? "button" : "button button-ghost"}>
                  Results
                </Link>
                <Link href={buildHref({ status: "scheduled" })} className={data.selectedStatus === "scheduled" ? "button" : "button button-ghost"}>
                  Upcoming
                </Link>
              </>
            }
            aside={
              <div className="hero-aside-list hero-aside-list-cyber">
                <div>
                  <span className="aside-label">Matches shown</span>
                  <strong>{data.fixtures.length}</strong>
                </div>
                <div>
                  <span className="aside-label">Current view</span>
                  <strong>{selectedStageLabel}</strong>
                </div>
                <FreshnessStamp generatedAt={data.generatedAt} />
              </div>
            }
          />
        </ScrollStorySection>
      </MotionIn>

      <MotionIn delay={0.06}>
        <DayNoteBanner note={data.dayNote} />
      </MotionIn>

      <MotionIn className="section-shell page-guide-shell" delay={0.07}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Filter Snapshot</p>
            <h2>What this schedule is showing</h2>
          </div>
          <div className="page-guide-actions">
            {hasActiveFilters ? (
              <Link href={buildHref({ sport: undefined, stage: undefined, group: undefined, status: undefined })} className="button button-ghost">
                Clear filters
              </Link>
            ) : null}
            <Link href="/standings" className="button button-ghost">
              View standings
            </Link>
          </div>
        </div>
        <div className="page-guide-grid">
          <article className="page-guide-card">
            <p className="eyebrow">Matches</p>
            <strong>{data.fixtures.length}</strong>
            <span>Fixtures matching your current filters</span>
          </article>
          <article className="page-guide-card">
            <p className="eyebrow">Sport</p>
            <strong>{selectedSportRecord?.name ?? "All sports"}</strong>
            <span>{selectedGroupLabel}</span>
          </article>
          <article className="page-guide-card">
            <p className="eyebrow">Status</p>
            <strong>{selectedStatusLabel}</strong>
            <span>{selectedStageLabel}</span>
          </article>
        </div>
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
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.12}>
        {!selectedSport && data.sportBlocks.length > 0 ? (
          <section className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Quick Jump</p>
                <h2>Sports on this day</h2>
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
                <p className="eyebrow">Time</p>
                <h2>{group.label}</h2>
                <span>{group.matches.length} matches</span>
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
            eyebrow="Schedule"
            title="No matches match this filter"
            description="Try another day, sport, stage, or status to see more fixtures."
          />
        )}
      </MotionIn>
    </div>
  );
}
