import type { DataState } from "@/server/data/public/types";

type DataStateBannerProps = {
  state: DataState;
  compact?: boolean;
};

export function DataStateBanner({ state, compact = false }: DataStateBannerProps) {
  const updatedLabel = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(state.generatedAt));
  const toneClass = state.source === "fallback" ? "status-banner status-banner-alert" : "status-banner status-banner-info";

  if (compact && state.source === "supabase") {
    return (
      <div className="data-state-inline" aria-label={`${state.label}. ${state.detail}`}>
        <strong>{state.label}</strong>
        <span>{state.detail}</span>
        <small>Updated {updatedLabel}</small>
      </div>
    );
  }

  return (
    <div className={compact ? `${toneClass} data-state-banner data-state-banner-compact` : `${toneClass} data-state-banner`}>
      <strong>{state.label}</strong>
      <span>{state.detail}</span>
    </div>
  );
}
