import type { BracketTreeData } from "@/server/data/public/types";

import { BracketNode } from "./bracket-node";

type BracketTreeProps = {
  bracket: BracketTreeData;
  admin?: boolean;
};

export function BracketTree({ bracket, admin = false }: BracketTreeProps) {
  return (
    <div className="bracket-tree-shell">
      <div className="bracket-tree">
        {bracket.columns.map((column) => (
          <section key={column.id} className="bracket-tree-column">
            <div className="bracket-tree-column-head">
              <div>
                <p className="eyebrow">{column.label}</p>
                <strong>{column.count} boards</strong>
              </div>
            </div>
            <div className="bracket-tree-column-stack">
              {column.nodes.map((node) => (
                <BracketNode key={node.id} node={node} admin={admin} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {bracket.edges.length > 0 ? (
        <div className="bracket-edge-strip">
          {bracket.edges.map((edge) => (
            <span key={`${edge.sourceMatchId}-${edge.kind}-${edge.targetMatchId}`} className="pill">
              {edge.kind}{" -> "}{edge.slot.replace("_", " ")}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

