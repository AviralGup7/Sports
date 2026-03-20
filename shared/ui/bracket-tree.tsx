"use client";

import { gsap } from "gsap";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import type { BracketTreeData } from "@/server/data/public/types";
import { useUICapability } from "@/shared/motion";

import { BracketNode } from "./bracket-node";

type BracketTreeProps = {
  bracket: BracketTreeData;
  admin?: boolean;
};

type PathShape = {
  key: string;
  d: string;
  active: boolean;
  ghost: boolean;
};

export function BracketTree({ bracket, admin = false }: BracketTreeProps) {
  const capability = useUICapability();
  const initialSelection =
    bracket.columns.flatMap((column) => column.nodes).find((node) => node.match.status === "live")?.match.id ??
    bracket.columns.flatMap((column) => column.nodes).find((node) => node.isHighlighted)?.match.id ??
    bracket.columns[0]?.nodes[0]?.match.id ??
    null;

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(initialSelection);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [paths, setPaths] = useState<PathShape[]>([]);

  const allNodes = useMemo(() => bracket.columns.flatMap((column) => column.nodes), [bracket.columns]);
  const nodesByMatchId = useMemo(() => new Map(allNodes.map((node) => [node.match.id, node])), [allNodes]);
  const selectedPath = bracket.highlightPaths.find((path) => path.matchId === selectedMatchId) ?? null;
  const selectedNode = allNodes.find((node) => node.match.id === selectedMatchId) ?? null;
  const linkedNodeIds = useMemo(() => new Set(selectedPath?.linkedMatchIds ?? []), [selectedPath]);
  const activeEdgeKeys = useMemo(() => new Set(selectedPath?.edgeKeys ?? []), [selectedPath]);
  const winnerRouteLabel =
    (selectedNode?.match.winnerToMatchId ? nodesByMatchId.get(selectedNode.match.winnerToMatchId)?.match.round : null) ??
    (selectedNode?.match.winnerToMatchId ?? "Standalone");
  const loserRouteLabel =
    (selectedNode?.match.loserToMatchId ? nodesByMatchId.get(selectedNode.match.loserToMatchId)?.match.round : null) ??
    (selectedNode?.match.loserToMatchId ?? "None");

  useLayoutEffect(() => {
    if (capability.bracketMode === "minimal") {
      setPaths([]);
      return;
    }

    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const buildPaths = () => {
      const shellBounds = shell.getBoundingClientRect();
      const nextPaths = bracket.edges
        .map((edge) => {
          const source = nodeRefs.current[edge.sourceMatchId];
          const target = nodeRefs.current[edge.targetMatchId];

          if (!source || !target) {
            return null;
          }

          const sourceBounds = source.getBoundingClientRect();
          const targetBounds = target.getBoundingClientRect();
          const startX = sourceBounds.right - shellBounds.left;
          const startY = sourceBounds.top - shellBounds.top + sourceBounds.height / 2;
          const endX = targetBounds.left - shellBounds.left;
          const endY = targetBounds.top - shellBounds.top + targetBounds.height / 2;
          const deltaX = Math.max((endX - startX) * 0.45, 28);
          const key = `${edge.sourceMatchId}-${edge.kind}-${edge.targetMatchId}`;

          return {
            key,
            d: `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`,
            active: activeEdgeKeys.has(key),
            ghost: !activeEdgeKeys.has(key) && (edge.sourceMatchId === selectedMatchId || edge.targetMatchId === selectedMatchId)
          };
        })
        .filter((entry): entry is PathShape => Boolean(entry));

      setPaths(nextPaths);
    };

    buildPaths();
    const resizeObserver = new ResizeObserver(buildPaths);
    resizeObserver.observe(shell);
    Object.values(nodeRefs.current).forEach((node) => {
      if (node) {
        resizeObserver.observe(node);
      }
    });
    window.addEventListener("resize", buildPaths);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", buildPaths);
    };
  }, [activeEdgeKeys, bracket.edges, capability.bracketMode, selectedMatchId]);

  useLayoutEffect(() => {
    if (capability.bracketMode !== "animated") {
      return;
    }

    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const activePaths = svg.querySelectorAll<SVGPathElement>(".bracket-path-active");
    const ghostPaths = svg.querySelectorAll<SVGPathElement>(".bracket-path-ghost");

    gsap.killTweensOf(activePaths);
    gsap.killTweensOf(ghostPaths);

    activePaths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.out"
      });
    });

    ghostPaths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: `${length / 10} ${length / 16}` });
    });
  }, [capability.bracketMode, paths]);

  return (
    <div className={`bracket-tree-shell bracket-tree-shell-cyber${capability.isMobile ? " bracket-tree-shell-mobile" : ""}`}>
      <div className="bracket-tree-stage" ref={shellRef}>
        <svg ref={svgRef} className="bracket-tree-svg" aria-hidden="true">
          {paths.map((path) => (
            <path
              key={path.key}
              d={path.d}
              className={`bracket-path${path.active ? " bracket-path-active" : ""}${path.ghost ? " bracket-path-ghost" : ""}`}
            />
          ))}
        </svg>
        <div className="bracket-tree">
          {bracket.columns.map((column) => (
            <section key={column.id} className="bracket-tree-column">
              <div className="bracket-tree-column-head">
                <div>
                  <p className="eyebrow">{column.label}</p>
                  <strong>{column.count} matches</strong>
                </div>
              </div>
              <div className="bracket-tree-column-stack">
                {column.nodes.map((node) => (
                  <div
                    key={node.id}
                    ref={(element) => {
                      nodeRefs.current[node.match.id] = element;
                    }}
                  >
                    <BracketNode
                      node={node}
                      admin={admin}
                      active={selectedMatchId === node.match.id}
                      linked={linkedNodeIds.has(node.match.id)}
                      onSelect={setSelectedMatchId}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {selectedNode ? (
        <aside className="bracket-focus-panel">
          <div className="bracket-focus-head">
            <p className="eyebrow">Selected match</p>
            <h3>{selectedNode.match.round}</h3>
          </div>
          <div className="bracket-focus-score">
            <strong>{selectedNode.match.teamA?.name ?? "TBD"}</strong>
            <span>vs</span>
            <strong>{selectedNode.match.teamB?.name ?? "TBD"}</strong>
          </div>
          <p className="bracket-focus-meta">
            {selectedNode.match.stage?.label ?? "Bracket match"} | {selectedNode.match.venue}
          </p>
          <p className="bracket-focus-summary">
            {selectedNode.match.result?.scoreSummary ??
              (selectedNode.match.status === "live"
                ? "This match is currently live."
                : "Waiting for a result and bracket update.")}
          </p>
          <div className="bracket-focus-route-grid">
            <div>
              <span>Winner route</span>
              <strong>{winnerRouteLabel}</strong>
            </div>
            <div>
              <span>Loser route</span>
              <strong>{loserRouteLabel}</strong>
            </div>
          </div>
          <div className="bracket-focus-actions">
            <Link href={admin ? `/admin/matches?mode=live&sport=${selectedNode.match.sportId}` : `/matches/${selectedNode.match.id}`} className="button button-ghost">
              {admin ? "Control match" : "Match Details"}
            </Link>
            {!admin ? (
              <Link href={`/sports/${selectedNode.match.sportId}?tab=fixtures`} className="inline-link">
                View full sport page
              </Link>
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
