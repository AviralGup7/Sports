import Link from "next/link";

import { generateStructureAction, submitResultAction, upsertMatchAction } from "@/app/admin/actions";
import type { AdminMatchesData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast, EmptyState } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { AthleticsEventBoard, BracketTree, DisclosurePanel, FixtureStrip, IntegrityWarning, StandingsTable } from "@/shared/ui";
import { MotionIn } from "@/shared/motion";
import { AdminMatchCreatePanel } from "@/features/admin/matches/components/match-create-panel";
import { AdminMatchFilters } from "@/features/admin/matches/components/match-filters";
import { AdminMatchOpsCard } from "@/features/admin/matches/components/match-ops-card";
import { FixtureGenerationPanel } from "@/features/admin/matches/components/fixture-generation-panel";

type MatchesScreenProps = {
  data: AdminMatchesData;
  params: {
    status?: string;
    message?: string;
    sport?: string;
    day?: string;
    stage?: string;
    mode?: string;
    statusFilter?: string;
  };
};

export function MatchesScreen({ data, params }: MatchesScreenProps) {
  const tone = params.status === "error" ? "error" : params.status === "success" ? "success" : "info";
  const mode = params.mode === "builder" || params.mode === "tree" ? params.mode : "live";
  const selectedSport = data.sports.find((sport) => sport.id === params.sport)?.id;
  const selectedDay = data.days.includes(params.day ?? "") ? params.day : undefined;
  const selectedStage = data.stages.find((stage) => stage.id === params.stage)?.id;
  const selectedStatus = params.statusFilter;

  const visibleMatches = data.matches.filter(
    (match) =>
      (!selectedSport || match.sportId === selectedSport) &&
      (!selectedDay || match.day === selectedDay) &&
      (!selectedStage || match.stageId === selectedStage) &&
      (!selectedStatus || match.status === selectedStatus)
  );

  const visibleStages = selectedSport ? data.stages.filter((stage) => stage.sportId === selectedSport) : data.stages;
  const visibleBuilderCards = selectedSport ? data.builderCards.filter((card) => card.sport.id === selectedSport) : data.builderCards;
  const visibleIntegrityIssues = selectedSport
    ? data.integrityIssues.filter((issue) => data.matches.some((match) => match.id === issue.matchId && match.sportId === selectedSport))
    : data.integrityIssues;

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
            <p className="eyebrow">Match Engine</p>
            <h1>Builder, live desk, and winner tree</h1>
            <p className="hero-text">Switch between structure generation, day-of result locking, and bracket integrity review without leaving the control room.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Visible {visibleMatches.length}</span>
            <span className="operations-chip">Issues {visibleIntegrityIssues.length}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={params.message} tone={tone} />

      <MotionIn className="filter-rail" delay={0.06}>
        <div className="filter-block">
          <p className="eyebrow">Mode</p>
          <div className="chip-row">
            <Link href={modeHref("builder")} className={mode === "builder" ? "chip chip-active" : "chip"}>
              Builder
            </Link>
            <Link href={modeHref("live")} className={mode === "live" ? "chip chip-active" : "chip"}>
              Live Desk
            </Link>
            <Link href={modeHref("tree")} className={mode === "tree" ? "chip chip-active" : "chip"}>
              Bracket Manager
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
          <ControlPanel eyebrow="Fixture Builder" title="Generate stage structures" description="Seed a clean knockout or group-plus-knockout scaffold from active team seeds, then refine the boards below.">
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

          {(!selectedSport || selectedSport === "athletics") && data.athleticsCards.length > 0 ? (
            <ControlPanel eyebrow="Athletics" title="Separate results workflow" description="Athletics stays on result cards and champion lanes instead of a winner tree.">
              <div className="stack-lg">
                {data.athleticsCards.map((card) => (
                  <section key={card.id} className="stack-sm">
                    <div>
                      <p className="eyebrow">Athletics Card</p>
                      <h3>{card.title}</h3>
                    </div>
                    <div className="fixture-stack">
                      {card.matches.map((match) => (
                        <FixtureStrip key={match.id} match={match} admin />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </ControlPanel>
          ) : null}
        </MotionIn>
      ) : null}

      {mode === "live" ? (
        <>
          <MotionIn className="split-stage" delay={0.095}>
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
          </MotionIn>

          <MotionIn className="stack-lg" delay={0.1}>
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
          </MotionIn>

          <MotionIn delay={0.16}>
            {(!selectedSport || selectedSport === "athletics") && data.athleticsBoards.length > 0 ? (
              <ControlPanel eyebrow="Athletics Board" title="Event-control lane" description="Athletics stays on event-style cards rather than forcing a two-team bracket workflow.">
                <div className="stack-lg">
                  {data.athleticsBoards.map((board) => (
                    <AthleticsEventBoard key={board.id} board={board} admin />
                  ))}
                </div>
              </ControlPanel>
            ) : null}
          </MotionIn>

          <MotionIn delay={0.18}>
            <DisclosurePanel
              eyebrow="Advanced Tools"
              title="Create or edit a fixture"
              meta="Expand only when you need manual fixture entry"
            >
              <AdminMatchCreatePanel
                sports={data.sports}
                stages={visibleStages}
                groups={selectedSport ? data.groups.filter((group) => group.sportId === selectedSport) : data.groups}
                teams={data.teams}
                action={upsertMatchAction}
              />
            </DisclosurePanel>
          </MotionIn>
        </>
      ) : null}

      {mode === "tree" ? (
        <MotionIn className="stack-lg" delay={0.12}>
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
        </MotionIn>
      ) : null}
    </div>
  );
}
