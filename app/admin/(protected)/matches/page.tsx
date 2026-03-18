import Link from "next/link";

import { ActionNotice } from "@/components/action-notice";
import { ControlPanel } from "@/components/control-panel";
import { FormCluster } from "@/components/form-cluster";
import { MotionIn } from "@/components/motion-in";
import { StageBadge } from "@/components/stage-badge";
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

      <MotionIn className="filter-rail" delay={0.08}>
        <div className="filter-block">
          <p className="eyebrow">Sport</p>
          <div className="chip-row">
            <Link href="/admin/matches" className={!selectedSport ? "chip chip-active" : "chip"}>
              All sports
            </Link>
            {data.sports.map((sport) => (
              <Link
                key={sport.id}
                href={`/admin/matches?sport=${sport.id}${selectedDay ? `&day=${selectedDay}` : ""}`}
                className={selectedSport === sport.id ? "chip chip-active" : "chip"}
              >
                {sport.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="filter-block">
          <p className="eyebrow">Day</p>
          <div className="chip-row">
            <Link href={`/admin/matches${selectedSport ? `?sport=${selectedSport}` : ""}`} className={!selectedDay ? "chip chip-active" : "chip"}>
              All days
            </Link>
            {data.days.map((day) => (
              <Link
                key={day}
                href={`/admin/matches?day=${day}${selectedSport ? `&sport=${selectedSport}` : ""}`}
                className={selectedDay === day ? "chip chip-active" : "chip"}
              >
                {day}
              </Link>
            ))}
          </div>
        </div>
      </MotionIn>

      <MotionIn delay={0.1}>
        <ControlPanel eyebrow="Create Fixture" title="New board" description="Set the frame, teams, and bracket link before the match goes live.">
          <form action={upsertMatchAction} className="stack-lg">
            <FormCluster label="Fixture" title="Core setup">
              <div className="form-grid">
                <label className="field">
                  <span>Sport</span>
                  <select name="sportId" required defaultValue="">
                    <option value="" disabled>
                      Select sport
                    </option>
                    {data.sports.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Round</span>
                  <input name="round" required placeholder="Semi-Final" />
                </label>
                <label className="field">
                  <span>Day</span>
                  <input name="day" type="date" required />
                </label>
                <label className="field">
                  <span>Start time</span>
                  <input name="startTime" type="time" required />
                </label>
                <label className="field">
                  <span>Venue</span>
                  <input name="venue" required placeholder="Main Ground" />
                </label>
                <label className="field">
                  <span>Status</span>
                  <select name="status" defaultValue="scheduled">
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </label>
              </div>
            </FormCluster>

            <FormCluster label="Teams and progression" title="Slot setup">
              <div className="form-grid">
                <label className="field">
                  <span>Team A</span>
                  <select name="teamAId" defaultValue="">
                    <option value="">TBD</option>
                    {data.teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Team B</span>
                  <select name="teamBId" defaultValue="">
                    <option value="">TBD</option>
                    {data.teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Next match ID</span>
                  <input name="nextMatchId" placeholder="volleyball-final" />
                </label>
                <label className="field">
                  <span>Next slot</span>
                  <select name="nextSlot" defaultValue="">
                    <option value="">No progression</option>
                    <option value="team_a">Team A</option>
                    <option value="team_b">Team B</option>
                  </select>
                </label>
              </div>
            </FormCluster>

            <div className="form-actions">
              <button type="submit" className="button">
                Save fixture
              </button>
            </div>
          </form>
        </ControlPanel>
      </MotionIn>

      <MotionIn className="stack-lg" delay={0.14}>
        {visibleMatches.map((match) => {
          const allowedTeams = data.teams.filter((team) => team.sportIds.includes(match.sportId));

          return (
            <section key={match.id} className={`match-ops-card match-ops-${match.status}`}>
              <div className="match-ops-head">
                <div>
                  <p className="eyebrow">
                    {match.sportId} | {match.round}
                  </p>
                  <h2>
                    {match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"}
                  </h2>
                </div>
                <div className="match-ops-status">
                  <StageBadge status={match.status} label={match.status} />
                  <span className="pill">{match.venue}</span>
                </div>
              </div>

              <div className="match-ops-grid">
                <form action={upsertMatchAction} className="stack-lg">
                  <input type="hidden" name="id" value={match.id} />
                  <FormCluster label="Fixture metadata" title="Timing and structure">
                    <div className="form-grid">
                      <label className="field">
                        <span>Sport</span>
                        <select name="sportId" defaultValue={match.sportId}>
                          {data.sports.map((sport) => (
                            <option key={sport.id} value={sport.id}>
                              {sport.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Round</span>
                        <input name="round" defaultValue={match.round} required />
                      </label>
                      <label className="field">
                        <span>Day</span>
                        <input name="day" type="date" defaultValue={match.day} required />
                      </label>
                      <label className="field">
                        <span>Start time</span>
                        <input name="startTime" type="time" defaultValue={match.startTime} required />
                      </label>
                      <label className="field">
                        <span>Venue</span>
                        <input name="venue" defaultValue={match.venue} required />
                      </label>
                      <label className="field">
                        <span>Status</span>
                        <select name="status" defaultValue={match.status}>
                          <option value="scheduled">Scheduled</option>
                          <option value="live">Live</option>
                          <option value="completed">Completed</option>
                        </select>
                      </label>
                    </div>
                  </FormCluster>

                  <FormCluster label="Team lanes" title="Sides and progression">
                    <div className="form-grid">
                      <label className="field">
                        <span>Team A</span>
                        <select name="teamAId" defaultValue={match.teamAId ?? ""}>
                          <option value="">TBD</option>
                          {allowedTeams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Team B</span>
                        <select name="teamBId" defaultValue={match.teamBId ?? ""}>
                          <option value="">TBD</option>
                          {allowedTeams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Next match ID</span>
                        <input name="nextMatchId" defaultValue={match.nextMatchId ?? ""} />
                      </label>
                      <label className="field">
                        <span>Next slot</span>
                        <select name="nextSlot" defaultValue={match.nextSlot ?? ""}>
                          <option value="">No progression</option>
                          <option value="team_a">Team A</option>
                          <option value="team_b">Team B</option>
                        </select>
                      </label>
                    </div>
                  </FormCluster>

                  <div className="form-actions">
                    <button type="submit" className="button button-ghost">
                      Update fixture
                    </button>
                  </div>
                </form>

                <form action={submitResultAction} className="result-bay">
                  <input type="hidden" name="matchId" value={match.id} />
                  <input type="hidden" name="sportId" value={match.sportId} />
                  <FormCluster label="Result bay" title="Lock score and winner">
                    <div className="form-grid">
                      <label className="field">
                        <span>Status</span>
                        <select name="status" defaultValue={match.status}>
                          <option value="scheduled">Scheduled</option>
                          <option value="live">Live</option>
                          <option value="completed">Completed</option>
                        </select>
                      </label>
                      <label className="field">
                        <span>Winner</span>
                        <select name="winnerTeamId" defaultValue={match.result?.winnerTeamId ?? ""}>
                          <option value="">Not decided</option>
                          {allowedTeams
                            .filter((team) => team.id === match.teamAId || team.id === match.teamBId)
                            .map((team) => (
                              <option key={`${match.id}-${team.id}`} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                        </select>
                      </label>
                      <label className="field">
                        <span>Score summary</span>
                        <input name="scoreSummary" defaultValue={match.result?.scoreSummary ?? ""} placeholder="2 - 1" />
                      </label>
                      <label className="field field-wide">
                        <span>Note</span>
                        <textarea name="note" defaultValue={match.result?.note ?? ""} rows={4} />
                      </label>
                    </div>
                  </FormCluster>

                  <div className="result-bay-footer">
                    <p className="muted">
                      When a completed winner is saved, the next-slot progression will auto-fill if this board is linked.
                    </p>
                    <button type="submit" className="button">
                      Save result
                    </button>
                  </div>
                </form>
              </div>
            </section>
          );
        })}
      </MotionIn>
    </div>
  );
}
