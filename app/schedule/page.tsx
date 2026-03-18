import Link from "next/link";

import { MatchCard } from "@/components/match-card";
import { getSchedulePageData, getSportBySlugFromCollection } from "@/lib/data";
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
  const { days, selectedDay, sports, fixtures } = await getSchedulePageData(params.day, selectedSport);

  return (
    <div className="stack-xl">
      <section className="banner">
        <p className="eyebrow">Public schedule</p>
        <h1>Match Schedule</h1>
        <p>Filter by day or sport. This view reads tournament fixtures from the shared repository layer.</p>
      </section>

      <section className="filter-strip">
        <div className="stack-sm">
          <p className="eyebrow">Day</p>
          <div className="chip-row">
            {days.map((day) => {
              const href = selectedSport ? `/schedule?day=${day}&sport=${selectedSport}` : `/schedule?day=${day}`;
              return (
                <Link key={day} href={href} className={day === selectedDay ? "chip chip-active" : "chip"}>
                  {day}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="stack-sm">
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
      </section>

      {selectedSport ? (
        <section className="stack-lg">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Filtered fixtures</p>
              <h2>{getSportBySlugFromCollection(sports, selectedSport)?.name}</h2>
            </div>
          </div>
          <div className="card-grid">
            {fixtures.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      ) : (
        <div className="stack-xl">
          {sports.map((sport) => {
            const sportFixtures = fixtures.filter((match) => match.sportId === sport.id);
            if (sportFixtures.length === 0) {
              return null;
            }

            return (
              <section key={sport.id} className="stack-lg">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{sport.format}</p>
                    <h2>{sport.name}</h2>
                  </div>
                  <Link href={`/sports/${sport.id}`} className="inline-link">
                    Open sport page
                  </Link>
                </div>

                <div className="card-grid">
                  {sportFixtures.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
