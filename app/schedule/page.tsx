import Link from "next/link";

import { BroadcastHero } from "@/components/broadcast-hero";
import { EmptyState } from "@/components/empty-state";
import { FixtureStrip } from "@/components/fixture-strip";
import { MotionIn } from "@/components/motion-in";
import { StageTimeline } from "@/components/stage-timeline";
import { formatDateLabel, getSchedulePageData, getSportBySlugFromCollection } from "@/lib/data";
import { sportOrder } from "@/lib/mock-data";
import { SportSlug } from "@/lib/types";

type SchedulePageProps = {
  searchParams?: Promise<{
    day?: string;
    sport?: string;
    stage?: string;
    group?: string;
    status?: string;
  }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.includes(params.sport as SportSlug) ? (params.sport as SportSlug) : undefined;
  const data = await getSchedulePageData(params.day, selectedSport, params.stage, params.group, params.status);
  const selectedSportRecord = getSportBySlugFromCollection(data.sports, selectedSport);

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
        <BroadcastHero
          eyebrow="Fixture Board"
          kicker={formatDateLabel(data.selectedDay)}
          title={selectedSportRecord ? `${selectedSportRecord.name} Schedule` : "Tournament Schedule"}
          description="Scan the day like a stage-aware broadcast rundown. Filters now understand sport, stage, group, and board status."
          compact
          aside={
            <div className="hero-aside-list">
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
          <StageTimeline
            stages={data.stages}
            selectedStageId={data.selectedStage}
            hrefBuilder={(stageId) => buildHref({ stage: stageId, group: undefined })}
          />
        </div>

        {data.groups.length > 0 ? (
          <div className="filter-block">
            <p className="eyebrow">Group</p>
            <div className="chip-row">
              <Link href={buildHref({ group: undefined })} className={!data.selectedGroup ? "chip chip-active" : "chip"}>
                All groups
              </Link>
              {data.groups.map((group) => (
                <Link
                  key={group.id}
                  href={buildHref({ group: group.id })}
                  className={data.selectedGroup === group.id ? "chip chip-active" : "chip"}
                >
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
              <Link
                key={status}
                href={buildHref({ status })}
                className={data.selectedStatus === status ? "chip chip-active" : "chip"}
              >
                {status}
              </Link>
            ))}
          </div>
        </div>
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.12}>
        {data.scheduleGroups.length > 0 ? (
          data.scheduleGroups.map((group) => (
            <section key={group.time} className="timeline-group">
              <div className="timeline-marker">
                <p className="eyebrow">Time Slot</p>
                <h2>{group.label}</h2>
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
