import { generateStructureAction } from "@/app/admin/actions";
import type { AdminMatchesData } from "@/server/data/admin/types";
import { EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { AthleticsEventBoard, BracketTree, IntegrityWarning, StandingsTable } from "@/shared/ui";

import { FixtureGenerationPanel } from "@/features/admin/matches/components/fixture-generation-panel";

type AdminMatchesBuilderViewProps = {
  data: AdminMatchesData;
  selectedSport?: string;
  visibleBuilderCards: AdminMatchesData["builderCards"];
};

export function AdminMatchesBuilderView({ data, selectedSport, visibleBuilderCards }: AdminMatchesBuilderViewProps) {
  return (
    <div className="stack-lg">
      <ControlPanel eyebrow="Fixture Builder" title="Generate stage structures" description="Seed a clean knockout scaffold from active team seeds, then refine the boards below.">
        <FixtureGenerationPanel sports={data.sports} teams={data.teams} action={generateStructureAction} />
      </ControlPanel>

      {visibleBuilderCards.length > 0 ? (
        visibleBuilderCards.map((card) => (
          <ControlPanel key={card.sport.id} eyebrow="Structure Review" title={`${card.sport.name} tournament map`} description="Review standings, tree links, and integrity warnings before the stage goes live.">
            <div className="stack-lg">
              <IntegrityWarning issues={card.integrityIssues} />
              {card.standings.length > 0 ? <StandingsTable cards={card.standings} /> : null}
              {card.bracket ? <BracketTree bracket={card.bracket} admin /> : null}
            </div>
          </ControlPanel>
        ))
      ) : (
        <EmptyState eyebrow="Fixture Builder" title="No team-sport builder cards match this filter" description="Choose another sport or generate a fresh structure to populate the builder view." />
      )}

      {(!selectedSport || selectedSport === "athletics") && data.athleticsBoards.length > 0 ? (
        <ControlPanel eyebrow="Athletics" title="Separate results workflow" description="Athletics stays on event-style cards in admin even while public pages present knockout coverage.">
          <div className="stack-lg">
            {data.athleticsBoards.map((board) => (
              <AthleticsEventBoard key={board.id} board={board} admin />
            ))}
          </div>
        </ControlPanel>
      ) : null}
    </div>
  );
}
