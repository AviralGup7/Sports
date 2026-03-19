import type { ReactNode } from "react";

type DisclosurePanelProps = {
  eyebrow?: string;
  title: string;
  meta?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  compact?: boolean;
  className?: string;
};

export function DisclosurePanel({
  eyebrow,
  title,
  meta,
  children,
  defaultOpen = false,
  compact = false,
  className
}: DisclosurePanelProps) {
  const classes = ["disclosure-panel"];
  if (compact) classes.push("disclosure-panel-compact");
  if (className) classes.push(className);

  return (
    <details className={classes.join(" ")} open={defaultOpen}>
      <summary className="disclosure-summary">
        <div className="disclosure-copy">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <strong>{title}</strong>
          {meta ? <span>{meta}</span> : null}
        </div>
        <span className="disclosure-chevron" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
