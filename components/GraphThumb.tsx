import { KINDS } from "@/lib/kinds";
import type { Project, Side, SystemNode } from "@/lib/types";

const W = 220;
const H = 80;

function anchor(n: SystemNode, side: Side) {
  switch (side) {
    case "top": return { x: n.x + W / 2, y: n.y };
    case "bottom": return { x: n.x + W / 2, y: n.y + H };
    case "left": return { x: n.x, y: n.y + H / 2 };
    case "right": return { x: n.x + W, y: n.y + H / 2 };
  }
}

function curve(a: { x: number; y: number }, b: { x: number; y: number }, from: Side, to: Side) {
  const d = Math.max(60, Math.hypot(b.x - a.x, b.y - a.y) * 0.4);
  const off = (s: Side) => (s === "left" ? [-d, 0] : s === "right" ? [d, 0] : s === "top" ? [0, -d] : [0, d]);
  const [ax, ay] = off(from);
  const [bx, by] = off(to);
  return `M${a.x},${a.y} C${a.x + ax},${a.y + ay} ${b.x + bx},${b.y + by} ${b.x},${b.y}`;
}

/** A static, miniature render of a project's architecture — used on registry cards. */
export function GraphThumb({ project, className }: { project: Project; className?: string }) {
  const { nodes, edges } = project;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const pad = 40;
  const minX = Math.min(...nodes.map((n) => n.x)) - pad;
  const minY = Math.min(...nodes.map((n) => n.y)) - pad;
  const maxX = Math.max(...nodes.map((n) => n.x + W)) + pad;
  const maxY = Math.max(...nodes.map((n) => n.y + H)) + pad;

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {edges.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const from = e.fromSide ?? "right";
        const to = e.toSide ?? "left";
        return (
          <path
            key={e.id}
            d={curve(anchor(a, from), anchor(b, to), from, to)}
            fill="none"
            style={{ stroke: "var(--edge)" }}
            strokeWidth={4}
            className="flow-line"
          />
        );
      })}
      {nodes.map((n) => {
        const k = KINDS[n.kind];
        return (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={W} height={H} rx={22} style={{ fill: "var(--card)", stroke: "var(--line)" }} strokeWidth={3} />
            <rect x={n.x + 16} y={n.y + 18} width={44} height={44} rx={13} style={{ fill: k.fill }} />
            <rect x={n.x + 74} y={n.y + 26} width={110} height={11} rx={5.5} style={{ fill: "var(--ink)" }} opacity={0.7} />
            <rect x={n.x + 74} y={n.y + 46} width={70} height={9} rx={4.5} style={{ fill: k.stroke }} opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
}
