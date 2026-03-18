import { IntegrityIssue } from "@/lib/types";

type IntegrityWarningProps = {
  issues: IntegrityIssue[];
};

export function IntegrityWarning({ issues }: IntegrityWarningProps) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <section className="integrity-warning">
      <div className="stack-sm">
        <p className="eyebrow">Bracket Integrity</p>
        <h2>{issues.length} issues need attention</h2>
      </div>
      <div className="stack-sm">
        {issues.map((issue) => (
          <article key={issue.id} className={`integrity-item integrity-${issue.severity}`}>
            <strong>{issue.title}</strong>
            <span>{issue.detail}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
