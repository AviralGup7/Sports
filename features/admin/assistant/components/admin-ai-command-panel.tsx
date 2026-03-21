"use client";

import type { Announcement } from "@/domain/announcements/types";
import type { Match } from "@/domain/matches/types";
import { useEffect, useRef, useState } from "react";

import { runAdminAssistantAction } from "@/app/admin/actions";

type AdminAiCommandPanelProps = {
  redirectTo: string;
  title?: string;
  description?: string;
  recentMatches?: Match[];
  recentAnnouncements?: Announcement[];
};

type ConnectionState = {
  tone: "info" | "success" | "error";
  label: string;
};

const GROQ_STORAGE_KEY = "admin_groq_api_key";

const commandExamples = [
  "Post a pinned public notice saying the football final now starts at 7 PM.",
  "Move cricket-final to April 5 at 18:30 in Main Ground.",
  "Mark football-qf-2 live.",
  "Save the football-qf-2 result as Pilani Tamil Mandram winning 2-1."
];

const defaultConnectionState: ConnectionState = {
  tone: "info",
  label: "No Groq key saved. Built-in commands still work."
};

function toMatchContext(matches: Match[]) {
  return matches.slice(0, 10).map((match) => ({
    id: match.id,
    sportId: match.sportId,
    round: match.round,
    day: match.day,
    startTime: match.startTime,
    venue: match.venue,
    status: match.status,
    teamAName: match.teamA?.name ?? "TBD",
    teamBName: match.teamB?.name ?? "TBD"
  }));
}

function toAnnouncementContext(announcements: Announcement[]) {
  return announcements.slice(0, 10).map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    visibility: announcement.visibility,
    pinned: announcement.pinned,
    isPublished: announcement.isPublished
  }));
}

export function AdminAiCommandPanel({
  redirectTo,
  title = "AI command desk",
  description = "Type a task in plain language. If a Groq key is connected, the desk will translate it into a safe admin command before running it.",
  recentMatches = [],
  recentAnnouncements = []
}: AdminAiCommandPanelProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const hiddenCommandRef = useRef<HTMLInputElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [connectionState, setConnectionState] = useState<ConnectionState>(defaultConnectionState);
  const [plannerSummary, setPlannerSummary] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const savedKey = window.localStorage.getItem(GROQ_STORAGE_KEY) ?? "";
    setApiKey(savedKey);

    if (savedKey) {
      setConnectionState({
        tone: "info",
        label: "Groq key saved locally in this browser. Test it before running AI planning."
      });
    }
  }, []);

  const saveApiKey = (value: string) => {
    setApiKey(value);
    window.localStorage.setItem(GROQ_STORAGE_KEY, value);

    setConnectionState(
      value.trim()
        ? {
            tone: "info",
            label: "Groq key saved locally. Run a connection test to verify it."
          }
        : defaultConnectionState
    );
  };

  const clearApiKey = () => {
    setApiKey("");
    window.localStorage.removeItem(GROQ_STORAGE_KEY);
    setPlannerSummary(null);
    setConnectionState(defaultConnectionState);
  };

  const testConnection = async () => {
    if (!apiKey.trim()) {
      setConnectionState({
        tone: "error",
        label: "Enter a Groq API key first."
      });
      return;
    }

    setBusy(true);
    setPlannerSummary(null);
    setLocalError(null);
    setConnectionState({
      tone: "info",
      label: "Checking Groq connection..."
    });

    try {
      const response = await fetch("/api/admin/ai/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ apiKey })
      });

      const result = (await response.json()) as { error?: string; model?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Groq connection failed.");
      }

      setConnectionState({
        tone: "success",
        label: `Groq connected. First available model: ${result.model ?? "available"}.`
      });
    } catch (error) {
      setConnectionState({
        tone: "error",
        label: error instanceof Error ? error.message : "Groq connection failed."
      });
    } finally {
      setBusy(false);
    }
  };

  const runTask = async () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setLocalError("Write a command first.");
      return;
    }

    setBusy(true);
    setLocalError(null);
    setPlannerSummary(null);

    try {
      let finalCommand = trimmedPrompt;

      if (apiKey.trim()) {
        const response = await fetch("/api/admin/ai/plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            apiKey,
            prompt: trimmedPrompt,
            matches: toMatchContext(recentMatches),
            announcements: toAnnouncementContext(recentAnnouncements)
          })
        });

        const result = (await response.json()) as { command?: string; summary?: string; error?: string };
        if (!response.ok || !result.command) {
          throw new Error(result.error ?? "Groq could not turn that request into an admin command.");
        }

        finalCommand = result.command;
        setPlannerSummary(result.summary ?? `AI prepared: ${result.command}`);
        setConnectionState({
          tone: "success",
          label: "Groq planning ready."
        });
      } else {
        setPlannerSummary("No Groq key connected. Running the built-in command parser.");
      }

      if (hiddenCommandRef.current && formRef.current) {
        hiddenCommandRef.current.value = finalCommand;
        formRef.current.requestSubmit();
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "The AI desk could not prepare that command.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack-lg">
      <div>
        <p className="eyebrow">AI Ops</p>
        <h3>{title}</h3>
        <p className="muted">{description}</p>
      </div>

      <div className={connectionState.tone === "success" ? "status-banner status-banner-success" : connectionState.tone === "error" ? "status-banner status-banner-error" : "status-banner status-banner-info"}>
        {connectionState.label}
      </div>

      <div className="stack-sm">
        <label className="field">
          <span>Groq API key</span>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => saveApiKey(event.target.value)}
            placeholder="gsk_..."
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <p className="muted">Stored only in this browser. It is sent to protected admin API routes when you test or run AI planning.</p>
        <div className="form-actions">
          <button type="button" className="button button-ghost" onClick={testConnection} disabled={busy}>
            Test Groq key
          </button>
          <button type="button" className="button button-ghost" onClick={clearApiKey} disabled={busy}>
            Clear key
          </button>
        </div>
      </div>

      <form ref={formRef} action={runAdminAssistantAction} className="stack-lg">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <input ref={hiddenCommandRef} type="hidden" name="command" value="" readOnly />

        <label className="field">
          <span>Task</span>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={5}
            required
            placeholder="Example: Delay the football final to 19:00 and post a pinned public notice."
          />
        </label>

        {plannerSummary ? <div className="status-banner status-banner-info">{plannerSummary}</div> : null}
        {localError ? <div className="status-banner status-banner-error">{localError}</div> : null}

        <div className="operator-guide-panel">
          {commandExamples.map((example) => (
            <div key={example} className="operator-guide-item">
              <span className="operator-guide-dot" aria-hidden="true" />
              <p>{example}</p>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="button" onClick={runTask} disabled={busy}>
            {busy ? "Preparing task..." : "Run AI task"}
          </button>
        </div>
      </form>

      {recentMatches.length > 0 ? (
        <div className="builder-preview stack-sm">
          <p className="eyebrow">Useful match ids</p>
          {recentMatches.slice(0, 6).map((match) => (
            <p key={match.id} className="muted">
              <strong>{match.id}</strong> | {match.teamA?.name ?? "TBD"} vs {match.teamB?.name ?? "TBD"} | {match.status}
            </p>
          ))}
        </div>
      ) : null}

      {recentAnnouncements.length > 0 ? (
        <div className="builder-preview stack-sm">
          <p className="eyebrow">Editable notice ids</p>
          {recentAnnouncements.slice(0, 5).map((announcement) => (
            <p key={announcement.id} className="muted">
              <strong>{announcement.id}</strong> | {announcement.title}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
