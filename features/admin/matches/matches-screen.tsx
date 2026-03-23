import Link from "next/link";

import type { AdminMatchesData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast } from "@/shared/feedback";
import { MotionIn } from "@/shared/motion";
import { AdminMatchFilters } from "@/features/admin/matches/components/match-filters";
import { AdminMatchesBuilderView } from "@/features/admin/matches/components/admin-matches-builder-view";
import { AdminMatchesLiveView } from "@/features/admin/matches/components/admin-matches-live-view";
import { AdminMatchesTreeView } from "@/features/admin/matches/components/admin-matches-tree-view";
import { resolveMatchesScreenState, type MatchesScreenParams } from "@/features/admin/matches/matches-screen-state";

type MatchesScreenProps = {
  data: AdminMatchesData;
  params: MatchesScreenParams;
};

export function MatchesScreen({ data, params }: MatchesScreenProps) {
  const {
    tone,
    mode,
    selectedSport,
    selectedDay,
    selectedStage,
    selectedStatus,
    visibleStages,
    visibleMatches,
    visibleBuilderCards,
    visibleIntegrityIssues
  } = resolveMatchesScreenState(data, params);
  const visibleCount = mode === "live" ? visibleMatches.length : visibleBuilderCards.length;
  const issueCount = mode === "live" ? data.integrityIssues.length : visibleIntegrityIssues.length;

  const modeHref = (nextMode: string) => {
    const nextParams = new URLSearchParams();
    nextParams.set("mode", nextMode);
    if (selectedSport) nextParams.set("sport", selectedSport);
    if (selectedDay) nextParams.set("day", selectedDay);
    if (selectedStage) nextParams.set("stage", selectedStage);
    if (selectedStatus) nextParams.set("statusFilter", selectedStatus);
    return `/admin/matches?${nextParams.toString()}`;
  };

  return (
    <div className="stack-xl">
      <ActionToast message={params.message} tone={tone} />

      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Matches</p>
            <h1>Run fixtures without the clutter</h1>
            <p className="hero-text">Stay in the mode you need right now: setup, live results, or bracket review.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Visible {visibleCount}</span>
            <span className="operations-chip">Issues {issueCount}</span>
            <Link href="/admin/assistant" className="button button-ghost">
              AI desk
            </Link>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={params.message} tone={tone} />

      <MotionIn className="filter-rail" delay={0.06}>
        <div className="filter-block">
          <p className="eyebrow">Mode</p>
          <div className="chip-row">
            <Link href={modeHref("builder")} className={mode === "builder" ? "chip chip-active" : "chip"}>
              Setup
            </Link>
            <Link href={modeHref("live")} className={mode === "live" ? "chip chip-active" : "chip"}>
              Live
            </Link>
            <Link href={modeHref("tree")} className={mode === "tree" ? "chip chip-active" : "chip"}>
              Bracket
            </Link>
          </div>
        </div>
      </MotionIn>

      <MotionIn delay={0.08}>
        <AdminMatchFilters
          sports={data.sports}
          stages={visibleStages}
          days={data.days}
          selectedSport={selectedSport}
          selectedStage={selectedStage}
          selectedStatus={selectedStatus}
          selectedDay={selectedDay}
          mode={mode}
        />
      </MotionIn>

      {mode === "builder" ? (
        <MotionIn className="stack-lg" delay={0.1}>
          <AdminMatchesBuilderView data={data} selectedSport={selectedSport} visibleBuilderCards={visibleBuilderCards} />
        </MotionIn>
      ) : null}

      {mode === "live" ? (
        <MotionIn className="stack-lg" delay={0.095}>
          <AdminMatchesLiveView data={data} selectedSport={selectedSport} visibleStages={visibleStages} visibleMatches={visibleMatches} />
        </MotionIn>
      ) : null}

      {mode === "tree" ? (
        <MotionIn className="stack-lg" delay={0.12}>
          <AdminMatchesTreeView visibleBuilderCards={visibleBuilderCards} visibleIntegrityIssues={visibleIntegrityIssues} />
        </MotionIn>
      ) : null}
    </div>
  );
}
