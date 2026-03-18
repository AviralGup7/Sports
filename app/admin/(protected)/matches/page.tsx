import Link from "next/link";

import { ActionNotice } from "@/components/action-notice";
import { AdminMatchCreatePanel } from "@/components/admin-match-create-panel";
import { AdminMatchFilters } from "@/components/admin-match-filters";
import { AdminMatchOpsCard } from "@/components/admin-match-ops-card";
import { BracketTree } from "@/components/bracket-tree";
import { ControlPanel } from "@/components/control-panel";
import { EmptyState } from "@/components/empty-state";
import { FixtureGenerationPanel } from "@/components/fixture-generation-panel";
import { FixtureStrip } from "@/components/fixture-strip";
import { IntegrityWarning } from "@/components/integrity-warning";
import { MotionIn } from "@/components/motion-in";
import { StandingsTable } from "@/components/standings-table";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminMatchesData } from "@/lib/data";

import { generateStructureAction, submitResultAction, upsertMatchAction } from "../../actions";

type AdminMatchesPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
    sport?: string;
    day?: string;
    stage?: string;
    mode?: string;
    statusFilter?: string;
  }>;
};

export default async function AdminMatchesPage({ searchParams }: AdminMatchesPageProps) {
  const params = (await searchParams) ?? {};
  const { profile } = await requireAdminProfile();
  const data = await getAdminMatchesData(profile);
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
          <ControlPanel
            eyebrow="Fixture Builder"
            title="Generate stage structures"
            description="Seed a clean knockout or group-plus-knockout scaffold from active team seeds, then refine the boards below."
          >
            <FixtureGenerationPanel sports={data.sports} teams={data.teams} action={generateStructureAction} />
          </ControlPanel>

          {visibleBuilderCards.length > 0 ? (
            visibleBuilderCards.map((card) => (
              <ControlPanel
                key={card.sport.id}
                eyebrow="Structure Review"
                title={`${card.sport.name} tournament map`}
                description="Review standings, tree links, and integrity warnings before the stage goes live."
              >
                <div className="stack-lg">
                  <IntegrityWarning issues={card.integrityIssues} />
                  {card.standings.length > 0 ? <StandingsTable cards={card.standings} /> : null}
                  {card.bracket ? <BracketTree bracket={card.bracket} admin /> : null}
                </div>
              </ControlPanel>
            ))
          ) : (
            <EmptyState
              eyebrow="Fixture Builder"
              title="No team-sport builder cards match this filter"
              description="Choose another sport or generate a fresh structure to populate the builder view."
            />
          )}

          {(!selectedSport || selectedSport === "athletics") && data.athleticsCards.length > 0 ? (
            <ControlPanel
              eyebrow="Athletics"
              title="Separate results workflow"
              description="Athletics stays on result cards and champion lanes instead of a winner tree."
            >
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
          <MotionIn delay={0.1}>
            <AdminMatchCreatePanel
              sports={data.sports}
              stages={visibleStages}
              groups={selectedSport ? data.groups.filter((group) => group.sportId === selectedSport) : data.groups}
              teams={data.teams}
              action={upsertMatchAction}
            />
          </MotionIn>

          <MotionIn className="stack-lg" delay={0.14}>
            {visibleMatches.length > 0 ? (
              visibleMatches.map((match) => (
                <AdminMatchOpsCard
                  key={match.id}
                  match={match}
                  sports={data.sports}
                  stages={data.stages}
                  groups={data.groups}
                  teams={data.teams}
                  updateAction={upsertMatchAction}
                  resultAction={submitResultAction}
                />
              ))
            ) : (
              <EmptyState
                eyebrow="Live Desk"
                title="No matches match the current filters"
                description="Change sport, day, stage, or status filters, or create a new fixture above to start the result workflow."
              />
            )}
          </MotionIn>
        </>
      ) : null}

      {mode === "tree" ? (
        <MotionIn className="stack-lg" delay={0.12}>
          <IntegrityWarning issues={visibleIntegrityIssues} />
          {visibleBuilderCards.length > 0 ? (
            visibleBuilderCards.map((card) => (
              <ControlPanel
                key={`${card.sport.id}-tree`}
                eyebrow="Bracket Manager"
                title={`${card.sport.name} winner tree`}
                description="Review winner and loser routing, bye handling, and unresolved slots in a visual tree view."
              >
                {card.bracket ? (
                  <BracketTree bracket={card.bracket} admin />
                ) : (
                  <EmptyState
                    compact
                    eyebrow="Bracket Manager"
                    title="No bracket tree available"
                    description="This sport does not currently have knockout or placement boards to render."
                  />
                )}
              </ControlPanel>
            ))
          ) : (
            <EmptyState
              eyebrow="Bracket Manager"
              title="No tree matches this filter"
              description="Choose a team sport with knockout or placement boards to inspect the winner tree."
            />
          )}
        </MotionIn>
      ) : null}
    </div>
  );
}
