import Link from "next/link";

import type { AdminDashboardData } from "@/server/data/admin/types";
import { ActionNotice, ActionToast } from "@/shared/feedback";
import { ControlPanel } from "@/shared/layout";
import { FixtureStrip, NewsBulletin } from "@/shared/ui";
import { MotionIn } from "@/shared/motion";

import { AdminAiCommandPanel } from "./components/admin-ai-command-panel";

type AdminAssistantScreenProps = {
  data: AdminDashboardData;
  message?: string;
  tone: "info" | "success" | "error";
};

export function AdminAssistantScreen({ data, message, tone }: AdminAssistantScreenProps) {
  return (
    <div className="stack-xl">
      <ActionToast message={message} tone={tone} />

      <MotionIn>
        <section className="operations-hero">
          <div>
            <p className="eyebrow">AI Desk</p>
            <h1>Tell admin what to do</h1>
            <p className="hero-text">Connect your own Groq key, type a plain-language task, and let the desk translate it into a real admin action before it touches tournament data.</p>
          </div>
          <div className="operations-hero-side">
            <span className="operations-chip">Today {data.todaysMatches.length}</span>
            <span className="operations-chip">Pending {data.pendingResults.length}</span>
          </div>
        </section>
      </MotionIn>

      <ActionNotice message={message} tone={tone} />

      <MotionIn className="split-stage" delay={0.05}>
        <ControlPanel
          eyebrow="Command Center"
          title="Run a task from one prompt"
          description="This assistant runs real admin actions. Use match ids when possible for the fastest and safest updates."
        >
          <AdminAiCommandPanel
            redirectTo="/admin/assistant"
            recentMatches={data.todaysMatches.length > 0 ? data.todaysMatches : data.pendingResults}
            recentAnnouncements={data.announcements}
          />
        </ControlPanel>

        <ControlPanel
          eyebrow="What it can do"
          title="Current assistant skills"
          description="The AI desk is tuned for the most common day-of tournament tasks."
        >
          <div className="operator-guide-panel">
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>Write and post announcements, including pinned public notices and admin-only drafts.</p>
            </div>
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>Update an existing announcement by id, including publish state, visibility, and pinned status.</p>
            </div>
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>Move a match to a new date, time, or venue with one command.</p>
            </div>
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>Flip match state to live, scheduled, postponed, cancelled, or completed.</p>
            </div>
            <div className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>Save a result, infer the winner from context, and push winner and loser routing forward in the bracket when the board is completed.</p>
            </div>
          </div>
          <div className="admin-quick-actions">
            <Link href="/admin/matches?mode=live" className="button button-ghost">
              Open matches
            </Link>
            <Link href="/admin/announcements" className="button button-ghost">
              Open notices
            </Link>
          </div>
        </ControlPanel>
      </MotionIn>

      <MotionIn className="split-stage" delay={0.08}>
        <ControlPanel eyebrow="Today" title="Matches you may want to command" description="These are the most likely boards to update from the AI desk.">
          <div className="fixture-stack">
            {data.todaysMatches.map((match) => (
              <FixtureStrip key={match.id} match={match} admin />
            ))}
          </div>
        </ControlPanel>

        <ControlPanel eyebrow="Notices" title="Recent editorial activity" description="Use these headlines as a quick reference before posting a new update.">
          <div className="news-feed">
            {data.announcements.map((announcement) => (
              <NewsBulletin key={announcement.id} announcement={announcement} compact showAdminMeta />
            ))}
          </div>
        </ControlPanel>
      </MotionIn>
    </div>
  );
}
