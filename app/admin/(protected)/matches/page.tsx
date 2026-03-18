import Link from "next/link";

import { ActionNotice } from "@/components/action-notice";
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
      <section className="banner">
        <p className="eyebrow">Admin matches</p>
        <h1>Fixture Control</h1>
        <p>Manage fixtures, save results, and auto-advance winners into the next configured slot.</p>
      </section>

      <ActionNotice message={params.message} tone={tone} />

      <section className="filter-strip">
        <div className="stack-sm">
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
        <div className="stack-sm">
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
      </section>

      <section className="editor-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Create fixture</p>
            <h2>New match</h2>
          </div>
        </div>
        <form action={upsertMatchAction} className="stack-lg">
          <div className="form-grid">
            <label className="field">
              <span>Sport</span>
              <select name="sportId" required defaultValue="">
                <option value="" disabled>Select sport</option>
                {data.sports.map((sport) => (
                  <option key={sport.id} value={sport.id}>{sport.name}</option>
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
          <div className="form-grid">
            <label className="field">
              <span>Team A</span>
              <select name="teamAId" defaultValue="">
                <option value="">TBD</option>
                {data.teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Team B</span>
              <select name="teamBId" defaultValue="">
                <option value="">TBD</option>
                {data.teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
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
          <div className="form-actions">
            <button type="submit" className="button">
              Save fixture
            </button>
          </div>
        </form>
      </section>

      <div className="stack-lg">
        {visibleMatches.map((match) => {
          const allowedTeams = data.teams.filter((team) => team.sportIds.includes(match.sportId));
          return (
            <article key={match.id} className="editor-card">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{match.sportId}</p>
                  <h2>{match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"}</h2>
                </div>
                <span className="pill">{match.round}</span>
              </div>

              <form action={upsertMatchAction} className="stack-lg">
                <input type="hidden" name="id" value={match.id} />
                <div className="form-grid">
                  <label className="field">
                    <span>Sport</span>
                    <select name="sportId" defaultValue={match.sportId}>
                      {data.sports.map((sport) => (
                        <option key={sport.id} value={sport.id}>{sport.name}</option>
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
                <div className="form-grid">
                  <label className="field">
                    <span>Team A</span>
                    <select name="teamAId" defaultValue={match.teamAId ?? ""}>
                      <option value="">TBD</option>
                      {allowedTeams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Team B</span>
                    <select name="teamBId" defaultValue={match.teamBId ?? ""}>
                      <option value="">TBD</option>
                      {allowedTeams.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
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
                <div className="form-actions">
                  <button type="submit" className="button button-ghost">
                    Update fixture
                  </button>
                </div>
              </form>

              <form action={submitResultAction} className="stack-lg">
                <input type="hidden" name="matchId" value={match.id} />
                <input type="hidden" name="sportId" value={match.sportId} />
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
                    <textarea name="note" defaultValue={match.result?.note ?? ""} rows={3} />
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="button">
                    Save result
                  </button>
                </div>
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
}
