import Link from "next/link";

import type { CompetitionStage } from "@/domain/matches/types";
import type { Sport } from "@/domain/sports/types";
import { formatDateLabel } from "@/server/data/formatters";

type AdminMatchFiltersProps = {
  sports: Sport[];
  stages: CompetitionStage[];
  days: string[];
  selectedSport?: string;
  selectedStage?: string;
  selectedDay?: string;
  mode?: string;
};

export function AdminMatchFilters({
  sports,
  stages,
  days,
  selectedSport,
  selectedStage,
  selectedDay,
  mode
}: AdminMatchFiltersProps) {
  const hasActiveFilters = Boolean(selectedSport || selectedStage || selectedDay);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = {
      mode,
      sport: selectedSport,
      stage: selectedStage,
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
              {formatDateLabel(day)}
            </Link>
          ))}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="filter-block filter-block-compact">
          <p className="eyebrow">Reset</p>
        <div className="chip-row">
            <Link href={buildHref({ sport: undefined, stage: undefined, day: undefined })} className="chip">
              Clear filters
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}


