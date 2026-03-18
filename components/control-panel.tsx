import { ReactNode } from "react";

type ControlPanelProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  dense?: boolean;
};

export function ControlPanel({ eyebrow, title, description, actions, children, dense = false }: ControlPanelProps) {
  return (
    <section className={dense ? "control-panel control-panel-dense" : "control-panel"}>
      <div className="control-panel-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description ? <p className="panel-copy">{description}</p> : null}
        </div>
        {actions ? <div className="panel-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
