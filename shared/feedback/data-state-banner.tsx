import type { DataState } from "@/server/data/public/types";

type DataStateBannerProps = {
  state: DataState;
  compact?: boolean;
};

export function DataStateBanner({ state, compact = false }: DataStateBannerProps) {
  const toneClass = state.source === "fallback" ? "status-banner status-banner-alert" : "status-banner status-banner-info";

  return (
    <div className={compact ? `${toneClass} data-state-banner data-state-banner-compact` : `${toneClass} data-state-banner`}>
      <strong>{state.label}</strong>
      <span>{state.detail}</span>
    </div>
  );
}
