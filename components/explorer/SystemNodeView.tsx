"use client";

import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Check } from "lucide-react";
import { KINDS } from "@/lib/kinds";
import type { SystemNode } from "@/lib/types";

export type NodeState = "idle" | "active" | "done" | "dim";
export type SystemFlowNode = Node<{ node: SystemNode; state: NodeState }, "system">;

const SIDES = [
  ["top", Position.Top],
  ["right", Position.Right],
  ["bottom", Position.Bottom],
  ["left", Position.Left],
] as const;

function SystemNodeViewImpl({ data, selected }: NodeProps<SystemFlowNode>) {
  const { node, state } = data;
  const K = KINDS[node.kind];

  return (
    <div
      className={`relative w-[220px] cursor-pointer rounded-2xl border bg-card p-3 transition-all duration-300 ${
        state === "dim" ? "opacity-40" : ""
      } ${
        state === "active"
          ? "scale-[1.06] border-transparent shadow-[var(--shadow-lift)]"
          : selected
            ? "border-ink shadow-[var(--shadow-lift)]"
            : "border-line shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
      }`}
      style={state === "active" ? { boxShadow: `0 0 0 2px ${K.stroke}, 0 0 0 8px ${K.fill}, var(--shadow-lift)` } : undefined}
    >
      {SIDES.map(([id, pos]) => (
        <Handle key={id} id={id} type="source" position={pos} isConnectable={false} />
      ))}

      <div className="flex items-center gap-3">
        <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${K.bg} ${K.ink}`}>
          <K.icon className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium leading-tight">{node.label}</div>
          <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            {K.label}
            {node.tech ? ` · ${node.tech}` : ""}
          </div>
        </div>
      </div>

      {state === "done" && (
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-mint-ink text-paper shadow">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
      {state === "active" && (
        <span className="absolute -right-1.5 -top-1.5 size-3 rounded-full" style={{ background: K.stroke }}>
          <span className="absolute inset-0 animate-ping rounded-full" style={{ background: K.stroke }} />
        </span>
      )}
    </div>
  );
}

export const SystemNodeView = memo(SystemNodeViewImpl);
