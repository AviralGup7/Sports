import { MatchStatus } from "@/lib/types";

type StageBadgeProps = {
  status?: MatchStatus;
  label?: string;
  tone?: "live" | "alert" | "success" | "neutral";
};

export function StageBadge({ status, label, tone }: StageBadgeProps) {
  const badgeTone = tone ?? (status === "live" ? "live" : status === "completed" ? "success" : "neutral");
  const text = label ?? status ?? "neutral";

  return <span className={`stage-badge tone-${badgeTone}`}>{text}</span>;
}
