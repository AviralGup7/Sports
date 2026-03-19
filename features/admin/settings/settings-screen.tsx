import Link from "next/link";

import type { AdminSettingsData } from "@/server/data/admin/types";
import { ControlPanel } from "@/shared/layout";
import { MotionIn } from "@/shared/motion";

type SettingsScreenProps = {
  data: AdminSettingsData;
};

export function SettingsScreen({ data }: SettingsScreenProps) {
  return (
    <div className="stack-xl">
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

      <MotionIn className="split-stage" delay={0.08}>
        <ControlPanel eyebrow="Readiness" title="Environment status" description="Check whether the current deployment is wired to Supabase.">
          <div className="stack-md">
            <div className={data.envReady ? "status-banner status-banner-success" : "status-banner status-banner-error"}>
              {data.envReady
                ? "Supabase environment variables are present for this environment."
                : "Supabase environment variables are missing. Public fallback data may still render, but admin persistence will not work."}
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
    </div>
  );
}
