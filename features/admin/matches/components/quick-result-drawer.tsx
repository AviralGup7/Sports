"use client";

import { useState } from "react";

import type { Match } from "@/domain/matches/types";
import { getCricketScoreboardEntries } from "@/lib/cricket-score";
import { supportsLiveScoring } from "@/server/data/formatters";
import type { QuickResultCandidate } from "@/server/data/admin/types";
import { SubmitButton } from "@/shared/ui";

type QuickResultDrawerProps = {
  match: Match;
  candidate: QuickResultCandidate;
  action: (formData: FormData) => void | Promise<void>;
};

export function QuickResultDrawer({ match, candidate, action }: QuickResultDrawerProps) {
  const [open, setOpen] = useState(false);
  const [winnerTeamId, setWinnerTeamId] = useState(candidate.winnerTeamId ?? match.teamAId ?? match.teamBId ?? "");
  const cricketLiveScoring = supportsLiveScoring(match.sportId);
  const cricketEntries = getCricketScoreboardEntries(match);

  return (
    <>
      <button type="button" className="button button-ghost" onClick={() => setOpen(true)}>
        Quick result
      </button>

      {open ? (
        <div className="quick-result-overlay" role="dialog" aria-modal="true" aria-labelledby={`${match.id}-quick-result`}>
          <div className="quick-result-drawer">
            <div className="quick-result-head">
              <div>
                <p className="eyebrow">Fast result</p>
                <h3 id={`${match.id}-quick-result`}>{candidate.matchLabel}</h3>
                <p>{candidate.progressionHint}</p>
              </div>
              <button type="button" className="button button-ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <form action={action} className="stack-lg">
              <input type="hidden" name="matchId" value={match.id} />
              <input type="hidden" name="sportId" value={match.sportId} />
              <input type="hidden" name="decisionType" value="normal" />
              <input type="hidden" name="winnerTeamId" value={winnerTeamId} />

              <div className="quick-result-options">
                {[match.teamA, match.teamB].filter(Boolean).map((team) => (
                  <button
                    key={`${match.id}-${team!.id}`}
                    type="button"
                    className={winnerTeamId === team!.id ? "winner-option winner-option-active" : "winner-option"}
                    onClick={() => setWinnerTeamId(team!.id)}
                  >
                    {team!.name}
                  </button>
                ))}
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>{match.teamA?.name ?? "Team A"} {cricketLiveScoring ? "runs" : "score"}</span>
                  <input name="teamAScore" type="number" step="1" defaultValue={match.result?.teamAScore ?? undefined} />
                </label>
                <label className="field">
                  <span>{match.teamB?.name ?? "Team B"} {cricketLiveScoring ? "runs" : "score"}</span>
                  <input name="teamBScore" type="number" step="1" defaultValue={match.result?.teamBScore ?? undefined} />
                </label>
                {cricketLiveScoring ? (
                  <>
                    <label className="field">
                      <span>{match.teamA?.name ?? "Team A"} wickets</span>
                      <input name="teamAWickets" type="number" min="0" step="1" defaultValue={cricketEntries[0]?.line.wickets ?? 0} />
                    </label>
                    <label className="field">
                      <span>{match.teamB?.name ?? "Team B"} wickets</span>
                      <input name="teamBWickets" type="number" min="0" step="1" defaultValue={cricketEntries[1]?.line.wickets ?? 0} />
                    </label>
                    <label className="field">
                      <span>{match.teamA?.name ?? "Team A"} overs</span>
                      <input name="teamAOvers" inputMode="decimal" defaultValue={cricketEntries[0]?.line.overs ?? "0.0"} />
                    </label>
                    <label className="field">
                      <span>{match.teamB?.name ?? "Team B"} overs</span>
                      <input name="teamBOvers" inputMode="decimal" defaultValue={cricketEntries[1]?.line.overs ?? "0.0"} />
                    </label>
                  </>
                ) : null}
                <label className="field field-wide">
                  <span>Score summary</span>
                  <input
                    name="scoreSummary"
                    defaultValue={candidate.scoreSummary ?? ""}
                    placeholder={cricketLiveScoring ? "168/5 (20.0 ov) vs 149/8 (20.0 ov)" : "2 - 1"}
                  />
                </label>
                <label className="field field-wide">
                  <span>Note</span>
                  <textarea name="note" rows={3} defaultValue={match.result?.note ?? ""} />
                </label>
              </div>

              <div className="form-actions">
                <SubmitButton className="button" pendingLabel="Saving result...">
                  Confirm winner
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
