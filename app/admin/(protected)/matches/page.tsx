import Link from "next/link";

import { ActionNotice } from "@/components/action-notice";
import { AdminMatchCreatePanel } from "@/components/admin-match-create-panel";
import { AdminMatchFilters } from "@/components/admin-match-filters";
import { AdminMatchOpsCard } from "@/components/admin-match-ops-card";
import { EmptyState } from "@/components/empty-state";
import { MotionIn } from "@/components/motion-in";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminMatchesData } from "@/lib/data";

import { submitResultAction, upsertMatchAction } from "../../actions";

type AdminMatchesPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
    sport?: string;
    day?: string;
  }>;
};

export default async function AdminMatchesPage({ searchParams }: AdminMatchesPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminMatchesData(profile);
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";
  const selectedSport = data.sports.find((sport) => sport.id === params.sport)?.id;
  const selectedDay = data.days.includes(params.day ?? "") ? params.day : undefined;
  const visibleMatches = data.matches.filter(
    (match) => (!selectedSport || match.sportId === selectedSport) && (!selectedDay || match.day === selectedDay)
  );

  return (
    <div className="stack-xl">
      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Fixture Control</p>
            <h1>Result queue and progression</h1>
            <p className="hero-text">Treat each match like an operations block: set fixture metadata on top, then lock status and winner in the result bay.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Visible {visibleMatches.length}</span>
            <span className="operations-chip">Live {visibleMatches.filter((match) => match.status === "live").length}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={params.message} tone={tone} />

      <MotionIn delay={0.08}>
        <AdminMatchFilters
          sports={data.sports}
          days={data.days}
          selectedSport={selectedSport}
          selectedDay={selectedDay}
        />
      </MotionIn>

      <MotionIn delay={0.1}>
        <AdminMatchCreatePanel sports={data.sports} teams={data.teams} action={upsertMatchAction} />
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.14}>
        {visibleMatches.length > 0 ? (
          visibleMatches.map((match) => (
            <AdminMatchOpsCard
              key={match.id}
              match={match}
              sports={data.sports}
              teams={data.teams}
              updateAction={upsertMatchAction}
              resultAction={submitResultAction}
            />
          ))
        ) : (
          <EmptyState
            eyebrow="Fixture Queue"
            title="No matches match the current filters"
            description="Change the sport or day filter, or create a new fixture above to start the result workflow."
          />
        )}
      </MotionIn>
    </div>
  );
}
