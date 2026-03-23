import type { AdminMatchesData, IntegrityIssue } from "@/server/data/admin/types";
import { EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { BracketTree, IntegrityWarning } from "@/shared/ui";

type AdminMatchesTreeViewProps = {
  visibleBuilderCards: AdminMatchesData["builderCards"];
  visibleIntegrityIssues: IntegrityIssue[];
};

export function AdminMatchesTreeView({ visibleBuilderCards, visibleIntegrityIssues }: AdminMatchesTreeViewProps) {
  return (
    <div className="stack-lg">
      <IntegrityWarning issues={visibleIntegrityIssues} />
      {visibleBuilderCards.length > 0 ? (
        visibleBuilderCards.map((card) => (
          <ControlPanel key={`${card.sport.id}-tree`} eyebrow="Bracket Manager" title={`${card.sport.name} winner tree`} description="Review winner and loser routing, bye handling, and unresolved slots in a visual tree view.">
            {card.bracket ? (
              <BracketTree bracket={card.bracket} admin />
            ) : (
              <EmptyState compact eyebrow="Bracket Manager" title="No bracket tree available" description="This sport does not currently have knockout or placement boards to render." />
            )}
          </ControlPanel>
        ))
      ) : (
        <EmptyState eyebrow="Bracket Manager" title="No tree matches this filter" description="Choose a team sport with knockout or placement boards to inspect the winner tree." />
      )}
    </div>
  );
}
