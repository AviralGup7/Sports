"use client";

import type { BracketTreeNode as BracketTreeNodeModel } from "@/server/data/public/types";

import { StageBadge } from "./stage-badge";

type BracketNodeProps = {
  node: BracketTreeNodeModel;
  active?: boolean;
  linked?: boolean;
  onSelect?: (matchId: string) => void;
  admin?: boolean;
};

export function BracketNode({ node, active = false, linked = false, onSelect, admin = false }: BracketNodeProps) {
  return (
    <button
      type="button"
      className={`bracket-tree-node state-${node.state}${node.isHighlighted ? " bracket-tree-node-highlight" : ""}${active ? " bracket-tree-node-active" : ""}${linked ? " bracket-tree-node-linked" : ""}`}
      onClick={() => onSelect?.(node.match.id)}
    >
      <div className="bracket-node-shine" aria-hidden="true" />
      <div className="bracket-node-topline">
        <p className="eyebrow">{node.match.round}</p>
        <StageBadge
          status={node.match.status}
          label={node.state === "bye" ? "Bye" : node.match.status === "live" ? "LIVE" : node.match.status === "completed" ? "Final" : node.match.status === "postponed" ? "Postponed" : "Upcoming"}
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
        {node.match.result?.scoreSummary ? <small>{node.match.result.scoreSummary}</small> : <small>{admin ? "Select to control match" : "Select to follow the bracket"}</small>}
      </div>
    </button>
  );
}
