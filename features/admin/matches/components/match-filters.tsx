import Link from "next/link";

import type { CompetitionStage } from "@/domain/matches/types";
import type { Sport } from "@/domain/sports/types";

type AdminMatchFiltersProps = {
  sports: Sport[];
  stages: CompetitionStage[];
  days: string[];
  selectedSport?: string;
  selectedStage?: string;
  selectedStatus?: string;
  selectedDay?: string;
  mode?: string;
};

export function AdminMatchFilters({
  sports,
  stages,
  days,
  selectedSport,
  selectedStage,
  selectedStatus,
  selectedDay,
  mode
}: AdminMatchFiltersProps) {
  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = {
      mode,
      sport: selectedSport,
      stage: selectedStage,
      statusFilter: selectedStatus,
      day: selectedDay,
      ...overrides
    };

    for (const [key, value] of Object.entries(merged)) {
      if (value) {
        params.set(key, value);
      }
    }

    return params.toString() ? `/admin/matches?${params.toString()}` : "/admin/matches";
  };

  return (
    <div className="filter-rail">
      <div className="filter-block">
        <p className="eyebrow">Sport</p>
        <div className="chip-row">
          <Link href={buildHref({ sport: undefined, stage: undefined })} className={!selectedSport ? "chip chip-active" : "chip"}>
            All sports
          </Link>
          {sports.map((sport) => (
            <Link
              key={sport.id}
              href={buildHref({ sport: sport.id, stage: undefined })}
              className={selectedSport === sport.id ? "chip chip-active" : "chip"}
            >
              {sport.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <p className="eyebrow">Stage</p>
        <div className="chip-row">
          <Link href={buildHref({ stage: undefined })} className={!selectedStage ? "chip chip-active" : "chip"}>
            All stages
          </Link>
          {stages.map((stage) => (
            <Link
              key={stage.id}
              href={buildHref({ stage: stage.id })}
              className={selectedStage === stage.id ? "chip chip-active" : "chip"}
            >
              {stage.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <p className="eyebrow">Status</p>
        <div className="chip-row">
          <Link href={buildHref({ statusFilter: undefined })} className={!selectedStatus ? "chip chip-active" : "chip"}>
            Any status
          </Link>
          {["scheduled", "live", "completed", "postponed", "cancelled"].map((status) => (
            <Link
              key={status}
              href={buildHref({ statusFilter: status })}
              className={selectedStatus === status ? "chip chip-active" : "chip"}
            >
              {status}
            </Link>
          ))}
        </div>
      </div>
      <div className="filter-block">
        <p className="eyebrow">Day</p>
        <div className="chip-row">
          <Link href={buildHref({ day: undefined })} className={!selectedDay ? "chip chip-active" : "chip"}>
            All days
          </Link>
          {days.map((day) => (
            <Link
              key={day}
              href={buildHref({ day })}
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


