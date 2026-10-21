"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Bot, Check, Database, Gauge, Rocket, Wrench, type LucideIcon } from "lucide-react";
import { profile } from "@/lib/profile";

type Node = {
  x: number;
  y: number;
  label: string;
  sub: string;
  icon: LucideIcon;
  cls: string;
  /** CSS colour the trace takes on its way into this node */
  ink: string;
  log: string;
  delay: string;
};

// x/y are % of the board. Order = the path the trace takes, starting from Ali.
const ALI = { x: 50, y: 50, log: "new task received" };
const NODES: Node[] = [
  { x: 14, y: 16, label: "Agents", sub: "orchestration", icon: Bot, cls: "bg-lavender text-lavender-ink", ink: "var(--lavender-ink)", log: "planner → 3 subtasks", delay: "0s" },
  { x: 84, y: 20, label: "Retrieval", sub: "hybrid RAG", icon: Database, cls: "bg-mint text-mint-ink", ink: "var(--mint-ink)", log: "hybrid search · 12 chunks", delay: "2.1s" },
  { x: 86, y: 80, label: "Tools", sub: "MCP · APIs", icon: Wrench, cls: "bg-peach text-peach-ink", ink: "var(--peach-ink)", log: "mcp.call(github.create_pr)", delay: "1.2s" },
  { x: 14, y: 82, label: "Evals", sub: "measured, not guessed", icon: Gauge, cls: "bg-sky text-sky-ink", ink: "var(--sky-ink)", log: "faithfulness 0.94 ✓", delay: "0.6s" },
  { x: 10, y: 50, label: "Shipped", sub: "in production", icon: Rocket, cls: "bg-butter text-butter-ink", ink: "var(--butter-ink)", log: "deployed to prod ✓", delay: "1.6s" },
];
const LAST = NODES.length - 1;

// The board is 5:4, so the SVG uses a 125×100 viewBox to keep the trace head round.
const sx = (x: number) => x * 1.25;

/** Quadratic curve from a to b, bowed away from the board's centre. */
function edgePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = mx - 50;
  const dy = my - 50;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (dx / len) * 14;
  const cy = my + (dy / len) * 14;
  return `M${sx(a.x)},${a.y} Q${sx(cx)},${cy} ${sx(b.x)},${b.y}`;
}
const EDGES = NODES.map((n, i) => edgePath(i === 0 ? ALI : NODES[i - 1], n));

// The loop: dwell on Ali, then travel → dwell for each node, hold on "Shipped", fade out.
type Phase = { kind: "dwell"; node: number; ms: number } | { kind: "travel"; edge: number; ms: number } | { kind: "reset"; ms: number };
const PHASES: Phase[] = [
  { kind: "dwell", node: -1, ms: 900 },
  ...NODES.flatMap((_, i): Phase[] => [
    { kind: "travel", edge: i, ms: 1000 },
    { kind: "dwell", node: i, ms: i === LAST ? 2600 : 800 },
  ]),
  { kind: "reset", ms: 700 },
];

/** How many edges are fully drawn, and which node is "hot", at a given phase. */
function phaseState(p: number) {
  const ph = PHASES[p];
  if (ph.kind === "reset") return { done: NODES.length, active: -2, camera: -1 };
  if (ph.kind === "travel") return { done: ph.edge, active: -2, camera: ph.edge };
  return { done: ph.node + 1, active: ph.node, camera: ph.node };
}

/** The hero visual: you, as a node, tracing a task through what you build. */
export function HeroBoard() {
  const [phase, setPhase] = useState(0);
  const still = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
  const traceRefs = useRef<(SVGPathElement | null)[]>([]);
  const headRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (still) return;
    let raf = 0;
    let last = performance.now();
    let p = 0;
    let t = 0;
    const tick = (now: number) => {
      t += Math.min(now - last, 100); // don't jump ahead after a hidden tab
      last = now;
      while (t >= PHASES[p].ms) {
        t -= PHASES[p].ms;
        p = (p + 1) % PHASES.length;
        setPhase(p);
      }
      const ph = PHASES[p];
      const { done } = phaseState(p);
      const k = ph.kind === "travel" ? easeInOut(t / ph.ms) : 0;
      traceRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.strokeDashoffset = String(i < done ? 0 : ph.kind === "travel" && i === ph.edge ? 1 - k : 1);
      });
      const head = headRef.current;
      const edge = ph.kind === "travel" ? ph.edge : -1;
      const path = edge >= 0 ? traceRefs.current[edge] : null;
      if (head) {
        if (path) {
          const pt = path.getPointAtLength(path.getTotalLength() * k);
          head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          head.style.opacity = "1";
          head.style.color = NODES[edge].ink;
        } else {
          head.style.opacity = "0";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still]);

  const { done, active, camera } = still ? { done: LAST, active: -2, camera: -1 } : phaseState(phase);
  const ph = PHASES[phase];
  const resetting = !still && ph.kind === "reset";
  const log = still ? null : done === 0 ? ALI.log : NODES[Math.min(done, NODES.length) - 1].log;
  const shippedIn = !still && done > LAST && !resetting;
  const focus = camera >= 0 ? NODES[camera] : ALI;

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
      {/* "Camera": drifts gently toward whichever node the trace is working on */}
      <div
        className="absolute inset-0 transition-transform duration-[1200ms] ease-in-out"
        style={{
          transform: `translate(${(50 - focus.x) * 0.08}%, ${(50 - focus.y) * 0.08}%) scale(${camera >= 0 ? 1.04 : 1})`,
        }}
      >
        <svg viewBox="0 0 125 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          {EDGES.map((d, i) => (
            <path
              key={`base-${i}`}
              d={d}
              fill="none"
              style={{ stroke: "var(--edge)", opacity: i === LAST && !still && done < LAST ? 0 : 1 }}
              strokeWidth={1.4}
              vectorEffect="non-scaling-stroke"
              className="flow-line transition-opacity duration-500"
            />
          ))}
          <g className={`transition-opacity duration-700 ${resetting || still ? "opacity-0" : "opacity-100"}`}>
            {EDGES.map((d, i) => (
              <path
                key={`trace-${i}`}
                ref={(el) => {
                  traceRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
                strokeLinecap="round"
                style={{ stroke: NODES[i].ink }}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          <g ref={headRef} style={{ opacity: 0 }}>
            <circle r={4} fill="currentColor" opacity={0.18} />
            <circle r={1.6} fill="currentColor" />
          </g>
        </svg>

        {NODES.map((c, i) => {
          const isShipped = i === LAST;
          const hidden = isShipped && !still && !shippedIn;
          const hot = active === i;
          const lit = !still && !resetting && i < done;
          return (
            <div
              key={c.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <div className="float" style={{ animationDelay: c.delay }}>
                <div
                  className={`flex items-center gap-2.5 rounded-2xl border bg-card py-2 pl-2 pr-4 shadow-[var(--shadow-soft)] transition-all duration-500 ${
                    hidden ? "scale-75 opacity-0" : "scale-100 opacity-100"
                  } ${hot ? "!scale-[1.08]" : ""}`}
                  style={{
                    borderColor: lit ? `color-mix(in srgb, ${c.ink} 55%, transparent)` : "var(--line)",
                    boxShadow: hot ? `0 0 0 4px color-mix(in srgb, ${c.ink} 18%, transparent), var(--shadow-soft)` : undefined,
                  }}
                >
                  <span className={`relative grid size-8 place-items-center rounded-xl ${c.cls}`}>
                    <c.icon className="size-4" />
                    {lit && !hot && (
                      <span className="absolute -right-1 -top-1 grid size-3.5 place-items-center rounded-full bg-card" style={{ color: c.ink }}>
                        <Check className="size-2.5" strokeWidth={3.5} />
                      </span>
                    )}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-medium">{c.label}</span>
                    <span className="block font-mono text-[10px] text-ink-faint">{c.sub}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 rounded-3xl border bg-card p-4 shadow-[var(--shadow-lift)] transition-[border-color,box-shadow] duration-500"
          style={{
            borderColor: shippedIn ? "color-mix(in srgb, var(--mint-ink) 50%, transparent)" : "var(--line)",
            boxShadow: active === -1 ? "0 0 0 4px color-mix(in srgb, var(--lavender-ink) 15%, transparent), var(--shadow-lift)" : undefined,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">agent://{profile.handle}</span>
            <span className="live-dot size-2 rounded-full bg-mint-ink" />
          </div>
          <div className="mt-3 font-display text-2xl leading-none">{profile.name.split(" ")[0]}</div>
          <div className="mt-1 text-sm text-ink-soft">{profile.role}</div>
          <div className="mt-3 flex gap-1">
            {["bg-lavender", "bg-peach", "bg-mint", "bg-sky"].map((b) => (
              <span key={b} className={`h-1.5 flex-1 rounded-full ${b}`} />
            ))}
          </div>
          {log !== null && (
            <div className="mt-3 flex h-4 items-center gap-1.5 overflow-hidden font-mono text-[10px] text-ink-soft" aria-hidden>
              <span className="text-ink-faint">▸</span>
              <span key={log} className="log-in truncate">{log}</span>
            </div>
          )}
          <div className="mt-1.5 font-mono text-[10px] text-ink-faint">
            status: <span className="text-mint-ink">{profile.available ? "open to work" : "busy"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function prefersReducedMotion() {
  return window.matchMedia(REDUCED).matches;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}
