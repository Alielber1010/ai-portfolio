"use client";

import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type Edge, type EdgeProps } from "@xyflow/react";

export type EdgeState = "idle" | "active" | "done" | "dim";
export type FlowEdgeType = Edge<{ label?: string; kind?: "control" | "data"; state: EdgeState; color: string }, "flow">;

function FlowEdgeImpl({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps<FlowEdgeType>) {
  const [path, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const state = data?.state ?? "idle";
  const active = state === "active";
  const color = active ? data!.color : state === "done" ? "var(--edge-done)" : "var(--edge)";

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        className={data?.kind === "control" && !active ? "flow-line" : undefined}
        style={{
          stroke: color,
          strokeWidth: active ? 2.5 : 1.6,
          opacity: state === "dim" ? 0.35 : 1,
          transition: "stroke 300ms, opacity 300ms",
        }}
      />
      {state !== "dim" && (
        <circle r={active ? 5 : 2.5} style={{ fill: active ? data!.color : "var(--edge)" }}>
          <animateMotion dur={active ? "0.9s" : "3.2s"} repeatCount="indefinite" path={path} />
        </circle>
      )}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className={`nodrag nopan pointer-events-none absolute rounded-full border bg-card px-2 py-0.5 font-mono text-[10px] transition ${
              active ? "border-transparent text-paper" : "border-line text-ink-soft"
            } ${state === "dim" ? "opacity-40" : ""}`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: active ? data.color : undefined,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const FlowEdge = memo(FlowEdgeImpl);
