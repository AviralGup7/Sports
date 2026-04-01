import type { AdminMatchesData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast } from "@/shared/feedback";
import { MotionIn } from "@/shared/motion";
import { AdminMatchesLiveView } from "@/features/admin/matches/components/admin-matches-live-view";
import { resolveMatchesScreenState, type MatchesScreenParams } from "@/features/admin/matches/matches-screen-state";

type MatchesScreenProps = {
  data: AdminMatchesData;
  params: MatchesScreenParams;
};

export function MatchesScreen({ data, params }: MatchesScreenProps) {
  const { tone, selectedSport, visibleMatches } = resolveMatchesScreenState(data, params);

  return (
    <div className="stack-xl">
      <ActionToast message={params.message} tone={tone} />

      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Matches</p>
            <h1>Live Desk</h1>
            <p className="hero-text">Update score, save results, and keep the event moving from one simple control screen.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Visible {visibleMatches.length}</span>
            <span className="operations-chip">Sports {selectedSport ? 1 : data.sports.length}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={params.message} tone={tone} />

      <MotionIn className="stack-lg" delay={0.095}>
        <AdminMatchesLiveView data={data} visibleMatches={visibleMatches} />
      </MotionIn>
    </div>
  );
}
