import Link from "next/link";

import { submitResultAction, upsertMatchAction } from "@/app/admin/actions";
import type { AdminMatchesData } from "@/server/data/admin/types";
import { EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { AthleticsEventBoard, DisclosurePanel } from "@/shared/ui";

import { AdminMatchCreatePanel } from "@/features/admin/matches/components/match-create-panel";
import { AdminMatchOpsCard } from "@/features/admin/matches/components/match-ops-card";

type AdminMatchesLiveViewProps = {
  data: AdminMatchesData;
  selectedSport?: string;
  visibleStages: AdminMatchesData["stages"];
  visibleMatches: AdminMatchesData["matches"];
};

export function AdminMatchesLiveView({ data, selectedSport, visibleStages, visibleMatches }: AdminMatchesLiveViewProps) {
  return (
    <>
      <div className="split-stage">
        <ControlPanel eyebrow="Fast Result Deck" title="Winner declaration lane" description="Close a board quickly, then fall back to the full form only when you need advanced routing or metadata edits.">
          <div className="quick-result-candidate-list">
            {data.quickResultCandidates.length > 0 ? (
              data.quickResultCandidates.slice(0, 6).map((candidate) => (
                <Link key={candidate.id} href={`/admin/matches?mode=live&sport=${candidate.sportId}`} className="quick-result-candidate">
                  <div>
                    <p className="eyebrow">{candidate.status}</p>
                    <strong>{candidate.matchLabel}</strong>
                    <span>
                      {candidate.teamAName} vs {candidate.teamBName}
                    </span>
                  </div>
                  <small>{candidate.progressionHint}</small>
                </Link>
              ))
            ) : (
              <EmptyState compact eyebrow="Fast Result Deck" title="No quick result targets" description="Once live or newly-finished boards exist, they will appear here for faster closeout." />
            )}
          </div>
        </ControlPanel>

        <ControlPanel eyebrow="Operator Guide" title="How to use the control room" description="Keep day-of work in Live Desk, and move to Builder or Bracket Manager only when structure needs intervention.">
          <div className="operator-guide-panel">
            {data.operatorGuide.map((item) => (
              <div key={item} className="operator-guide-item">
                <span className="operator-guide-dot" aria-hidden="true" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </ControlPanel>
      </div>

      <div className="stack-lg">
        {visibleMatches.length > 0 ? (
          visibleMatches.map((match) => (
            <AdminMatchOpsCard
              key={match.id}
              match={match}
              sports={data.sports}
              stages={data.stages}
              groups={data.groups}
              teams={data.teams}
              quickResultCandidate={data.quickResultCandidates.find((candidate) => candidate.matchId === match.id)}
              updateAction={upsertMatchAction}
              resultAction={submitResultAction}
            />
          ))
        ) : (
          <EmptyState eyebrow="Live Desk" title="No matches match the current filters" description="Change sport, day, stage, or status filters, or create a new fixture below to start the result workflow." />
        )}
      </div>

      {(!selectedSport || selectedSport === "athletics") && data.athleticsBoards.length > 0 ? (
        <ControlPanel eyebrow="Athletics Board" title="Event-control lane" description="Athletics stays on event-style cards rather than forcing a two-team bracket workflow.">
          <div className="stack-lg">
            {data.athleticsBoards.map((board) => (
              <AthleticsEventBoard key={board.id} board={board} admin />
            ))}
          </div>
        </ControlPanel>
      ) : null}

      <DisclosurePanel eyebrow="Advanced Tools" title="Create or edit a fixture" meta="Expand only when you need manual fixture entry">
        <AdminMatchCreatePanel
          sports={data.sports}
          stages={visibleStages}
          groups={selectedSport ? data.groups.filter((group) => group.sportId === selectedSport) : data.groups}
          teams={data.teams}
          action={upsertMatchAction}
        />
      </DisclosurePanel>
    </>
  );
}
