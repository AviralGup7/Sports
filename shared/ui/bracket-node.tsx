import Link from "next/link";

import type { BracketTreeNode } from "@/server/data/public/types";

import { StageBadge } from "./stage-badge";

type BracketNodeProps = {
  node: BracketTreeNode;
  admin?: boolean;
};

export function BracketNode({ node, admin = false }: BracketNodeProps) {
  const href = admin ? `/admin/matches?sport=${node.match.sportId}&mode=live` : `/matches/${node.match.id}`;

  return (
    <Link href={href} className={`bracket-tree-node state-${node.state}${node.isHighlighted ? " bracket-tree-node-highlight" : ""}`}>
      <div className="bracket-node-topline">
        <p className="eyebrow">{node.match.round}</p>
        <StageBadge
          status={node.match.status}
          label={node.state === "bye" ? "bye" : node.match.status}
          tone={node.state === "bye" ? "alert" : undefined}
        />
      </div>
      <div className="bracket-node-team">
        <strong>{node.match.teamA?.name ?? "TBD"}</strong>
        {node.match.result?.winnerTeamId === node.match.teamAId ? <span className="winner-dot" /> : null}
      </div>
      <div className="bracket-node-team">
        <span>{node.match.teamB?.name ?? "TBD"}</span>
        {node.match.result?.winnerTeamId === node.match.teamBId ? <span className="winner-dot" /> : null}
      </div>
      <div className="bracket-node-meta">
        <span>{node.subtitle}</span>
        {node.match.result?.scoreSummary ? <small>{node.match.result.scoreSummary}</small> : null}
      </div>
    </Link>
  );
}

