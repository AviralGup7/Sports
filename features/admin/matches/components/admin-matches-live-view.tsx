import { submitResultAction } from "@/app/admin/actions";
import type { AdminMatchesData } from "@/server/data/admin/types";
import { EmptyState } from "@/shared/feedback";

import { AdminMatchOpsCard } from "@/features/admin/matches/components/match-ops-card";

type AdminMatchesLiveViewProps = {
  data: AdminMatchesData;
  visibleMatches: AdminMatchesData["matches"];
};

export function AdminMatchesLiveView({ data, visibleMatches }: AdminMatchesLiveViewProps) {
  if (visibleMatches.length === 0) {
    return (
      <EmptyState
        eyebrow="Live Desk"
        title="No matches match the current filters"
        description="Adjust the sport, stage, status, or day filters to find the board you want to update."
      />
    );
  }

  return (
    <div className="stack-lg">
      {visibleMatches.map((match) => (
        <AdminMatchOpsCard key={match.id} match={match} teams={data.teams} resultAction={submitResultAction} />
      ))}
    </div>
  );
}
