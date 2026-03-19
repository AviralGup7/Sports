import { ReactNode } from "react";

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({ eyebrow = "No Data Yet", title, description, action, compact = false }: EmptyStateProps) {
  return (
    <section className={compact ? "empty-state empty-state-compact" : "empty-state"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="empty-state-actions">{action}</div> : null}
    </section>
  );
}

