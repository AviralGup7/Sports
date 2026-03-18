import Link from "next/link";

import { Sport } from "@/lib/types";

type AdminMatchFiltersProps = {
  sports: Sport[];
  days: string[];
  selectedSport?: string;
  selectedDay?: string;
};

export function AdminMatchFilters({ sports, days, selectedSport, selectedDay }: AdminMatchFiltersProps) {
  return (
    <div className="filter-rail">
      <div className="filter-block">
        <p className="eyebrow">Sport</p>
        <div className="chip-row">
          <Link href="/admin/matches" className={!selectedSport ? "chip chip-active" : "chip"}>
            All sports
          </Link>
          {sports.map((sport) => (
            <Link
              key={sport.id}
              href={`/admin/matches?sport=${sport.id}${selectedDay ? `&day=${selectedDay}` : ""}`}
              className={selectedSport === sport.id ? "chip chip-active" : "chip"}
            >
              {sport.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <p className="eyebrow">Day</p>
        <div className="chip-row">
          <Link href={`/admin/matches${selectedSport ? `?sport=${selectedSport}` : ""}`} className={!selectedDay ? "chip chip-active" : "chip"}>
            All days
          </Link>
          {days.map((day) => (
            <Link
              key={day}
              href={`/admin/matches?day=${day}${selectedSport ? `&sport=${selectedSport}` : ""}`}
              className={selectedDay === day ? "chip chip-active" : "chip"}
            >
              {day}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
