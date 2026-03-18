import Link from "next/link";

import { BroadcastHero } from "@/components/broadcast-hero";
import { FixtureStrip } from "@/components/fixture-strip";
import { MotionIn } from "@/components/motion-in";
import { formatDateLabel, getSchedulePageData, getSportBySlugFromCollection } from "@/lib/data";
import { sportOrder } from "@/lib/mock-data";
import { SportSlug } from "@/lib/types";

type SchedulePageProps = {
  searchParams?: Promise<{
    day?: string;
    sport?: string;
  }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = (await searchParams) ?? {};
  const selectedSport = sportOrder.includes(params.sport as SportSlug) ? (params.sport as SportSlug) : undefined;
  const { days, selectedDay, sports, fixtures, scheduleGroups } = await getSchedulePageData(params.day, selectedSport);
  const selectedSportRecord = getSportBySlugFromCollection(sports, selectedSport);

  return (
    <div className="stack-xl">
      <MotionIn>
        <BroadcastHero
          eyebrow="Fixture Board"
          kicker={formatDateLabel(selectedDay)}
          title={selectedSportRecord ? `${selectedSportRecord.name} Schedule` : "Match Schedule"}
          description="Scan the day like a broadcast rundown. Filters stay sticky, timelines stay grouped, and every row jumps straight into the live board."
          compact
          aside={
            <div className="hero-aside-list">
              <div>
                <span className="aside-label">Visible fixtures</span>
                <strong>{fixtures.length}</strong>
              </div>
              <div>
                <span className="aside-label">Day locked</span>
                <strong>{formatDateLabel(selectedDay)}</strong>
              </div>
            </div>
          }
        />
      </MotionIn>

      <MotionIn className="filter-rail" delay={0.08}>
        <div className="filter-block">
          <p className="eyebrow">Day</p>
          <div className="chip-row">
            {days.map((day) => {
              const href = selectedSport ? `/schedule?day=${day}&sport=${selectedSport}` : `/schedule?day=${day}`;
              return (
                <Link key={day} href={href} className={day === selectedDay ? "chip chip-active" : "chip"}>
                  {formatDateLabel(day)}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="filter-block">
          <p className="eyebrow">Sport</p>
          <div className="chip-row">
            <Link href={`/schedule?day=${selectedDay}`} className={!selectedSport ? "chip chip-active" : "chip"}>
              All sports
            </Link>
            {sports.map((sport) => (
              <Link
                key={sport.id}
                href={`/schedule?day=${selectedDay}&sport=${sport.id}`}
                className={selectedSport === sport.id ? "chip chip-active" : "chip"}
              >
                {sport.name}
              </Link>
            ))}
          </div>
        </div>
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.12}>
        {scheduleGroups.map((group) => (
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
        ))}
      </MotionIn>
    </div>
  );
}
