import { resetTournamentDataAction, updateTournamentSettingsAction } from "@/app/admin/actions";
import Link from "next/link";

import type { AdminSettingsData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { MotionIn } from "@/shared/motion";
import { SubmitButton } from "@/shared/ui";

type SettingsScreenProps = {
  data: AdminSettingsData;
  message?: string;
  tone: "info" | "success" | "error";
};

export function SettingsScreen({ data, message, tone }: SettingsScreenProps) {
  return (
    <div className="stack-xl">
      <ActionToast message={message} tone={tone} />

      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">Event-Day Backup</p>
            <h1>Readiness and export tools</h1>
            <p className="hero-text">Confirm environment health, then export the operational dataset for backup before or during the tournament.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">{data.envReady ? "Supabase ready" : "Env missing"}</span>
            <span className="operations-chip">Exported {data.exportedAt}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={message} tone={tone} />

      <MotionIn className="split-stage" delay={0.08}>
        <ControlPanel eyebrow="Readiness" title="Environment status" description="Check whether the current deployment is wired to Supabase.">
          <div className="stack-md">
            <div className={data.envReady ? "status-banner status-banner-success" : "status-banner status-banner-error"}>
              {data.envReady
                ? "Supabase environment variables are present for this environment."
                : "Supabase environment variables are missing. Public fallback data may still render, but admin persistence will not work."}
            </div>
            <div className={data.usingFallbackData ? "status-banner status-banner-alert" : "status-banner status-banner-success"}>
              {data.dataState.label}: {data.dataState.detail}
            </div>
            <div className="backup-status-card">
              <p className="muted">Current tournament</p>
              <strong>{data.tournament.name}</strong>
              <p className="muted">Venue: {data.tournament.venue}</p>
            </div>
          </div>
        </ControlPanel>

        <ControlPanel eyebrow="Exports" title="Download backups" description="Use these routes to export the latest roster, fixture, result, and notice records.">
          <div className="stack-md">
            {["teams", "matches", "results", "announcements"].map((resource) => (
              <Link key={resource} href={`/admin/settings/export/${resource}`} className="button button-ghost">
                Export {resource}
              </Link>
            ))}
          </div>
        </ControlPanel>
      </MotionIn>

      <MotionIn className="split-stage" delay={0.1}>
        <ControlPanel eyebrow="Tournament" title="Branding and metadata" description="Keep public and admin surfaces in sync by editing tournament name, venue, dates, logo path, and organizer contacts here.">
          {data.profile.role === "super_admin" ? (
            <form action={updateTournamentSettingsAction} className="stack-lg">
              <input type="hidden" name="tournamentId" value={data.tournament.id} />
              <div className="form-grid">
                <label className="field">
                  <span>Tournament name</span>
                  <input name="name" defaultValue={data.tournament.name} required />
                </label>
                <label className="field">
                  <span>Venue</span>
                  <input name="venue" defaultValue={data.tournament.venue} required />
                </label>
                <label className="field">
                  <span>Start date</span>
                  <input type="date" name="startDate" defaultValue={data.tournament.startDate} required />
                </label>
                <label className="field">
                  <span>End date</span>
                  <input type="date" name="endDate" defaultValue={data.tournament.endDate} required />
                </label>
              </div>

              <label className="field">
                <span>Public logo path</span>
                <input name="logoAssetPath" defaultValue={data.tournament.logoAssetPath} required />
              </label>

              <div className="stack-md">
                {Array.from({ length: 3 }).map((_, index) => {
                  const contact = data.tournament.contacts[index];
                  return (
                    <div key={`contact-${index}`} className="form-grid">
                      <label className="field">
                        <span>Contact name</span>
                        <input name={`contactName_${index}`} defaultValue={contact?.name ?? ""} />
                      </label>
                      <label className="field">
                        <span>Phone</span>
                        <input name={`contactPhone_${index}`} defaultValue={contact?.phone ?? ""} />
                      </label>
                      <label className="field">
                        <span>Role</span>
                        <input name={`contactRole_${index}`} defaultValue={contact?.role ?? ""} />
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="status-banner status-banner-info">
                Use a stable public asset path such as `/branding/icasl-logo.png` so the same logo can be reused across the app with long-lived caching.
              </div>

              <div className="form-actions">
                <SubmitButton className="button" pendingLabel="Saving tournament settings...">
                  Save tournament settings
                </SubmitButton>
              </div>
            </form>
          ) : (
            <div className="status-banner status-banner-info">
              Tournament metadata edits are restricted to super admins.
            </div>
          )}
        </ControlPanel>

        <ControlPanel eyebrow="Operator Guide" title="How to use the control room" description="Use this lane to keep operations safe during the event and between demos.">
          <div className="operator-guide-panel">
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>Run exports before large structure changes or demo resets so you have a quick backup point.</p>
            </div>
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>If fallback data is active, public pages will still render, but admin persistence and live reads may not match the hosted database.</p>
            </div>
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>Use reset only for demo recovery or controlled test runs. It should never be part of normal event-day scoring.</p>
            </div>
          </div>
        </ControlPanel>

        <ControlPanel eyebrow="Reset" title="Reset tournament data" description="Restore the seeded baseline for demo/testing workflows. This does not touch admin accounts or role assignments.">
          {data.profile.role === "super_admin" ? (
            <form action={resetTournamentDataAction} className="stack-lg">
              <label className="field">
                <span>Confirmation phrase</span>
                <input name="confirmation" placeholder="RESET TOURNAMENT" required />
              </label>
              <div className="status-banner status-banner-alert">
                This action clears current teams, fixtures, results, stages, groups, and announcements before restoring the seeded tournament baseline.
              </div>
              <div className="form-actions">
                <SubmitButton className="button button-danger" pendingLabel="Resetting tournament...">
                  Reset tournament data
                </SubmitButton>
              </div>
            </form>
          ) : (
            <div className="status-banner status-banner-info">
              Reset is restricted to super admins. You can still use the export routes above for backups.
            </div>
          )}
        </ControlPanel>
      </MotionIn>
    </div>
  );
}
