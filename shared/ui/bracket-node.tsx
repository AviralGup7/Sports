"use client";

import type { BracketTreeNode as BracketTreeNodeModel } from "@/server/data/public/types";
import { formatRoundLabel, getMatchDisplayLabel } from "@/server/data/formatters";

type BracketNodeProps = {
  node: BracketTreeNodeModel;
  active?: boolean;
  linked?: boolean;
  onSelect?: (matchId: string) => void;
  admin?: boolean;
};

export function BracketNode({ node, active = false, linked = false, onSelect, admin = false }: BracketNodeProps) {
  const roundLabel = formatRoundLabel(node.match.round);
  const stateLabel = getMatchDisplayLabel(node.match);

  return (
    <button
      type="button"
      className={`bracket-tree-node state-${node.state}${node.isHighlighted ? " bracket-tree-node-highlight" : ""}${active ? " bracket-tree-node-active" : ""}${linked ? " bracket-tree-node-linked" : ""}`}
      onClick={() => onSelect?.(node.match.id)}
    >
      <div className="bracket-node-shine" aria-hidden="true" />
      <div className="bracket-node-topline">
        <p className="eyebrow">{roundLabel}</p>
        <span className="pill">{node.state === "bye" ? "Bye" : stateLabel}</span>
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
