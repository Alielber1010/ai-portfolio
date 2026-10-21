"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  useNodesInitialized,
  useReactFlow,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { ACCENTS, KINDS } from "@/lib/kinds";
import type { Project } from "@/lib/types";
import { SystemNodeView, type NodeState, type SystemFlowNode } from "./SystemNodeView";
import { FlowEdge, type EdgeState, type FlowEdgeType } from "./FlowEdge";
import { Inspector } from "./Inspector";
import { ProjectLinks } from "@/components/ProjectLinks";
import Image from "next/image";
import { BrandPanel } from "./BrandPanel";

const nodeTypes = { system: SystemNodeView };
const edgeTypes = { flow: FlowEdge };
const STEP_MS = 1400;

const TABS = ["overview", "product", "trace", "decisions"] as const;
type Tab = (typeof TABS)[number];

export function Explorer({ project }: { project: Project }) {
  return (
    <ReactFlowProvider>
      <ExplorerInner project={project} />
    </ReactFlowProvider>
  );
}

function ExplorerInner({ project }: { project: Project }) {
  const { fitView } = useReactFlow();
  const accent = ACCENTS[project.accent];
  const steps = project.trace.steps;

  const [tab, setTab] = useState<Tab>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [positions, setPositions] = useState<SystemFlowNode[]>(() =>
    project.nodes.map((n) => ({
      id: n.id,
      type: "system",
      position: { x: n.x, y: n.y },
      data: { node: n, state: "idle" },
    })),
  );

  // Trace playback
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step < steps.length - 1) setStep((s) => s + 1);
      else setPlaying(false);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  const startTrace = () => {
    setTab("trace");
    setSelectedId(null);
    if (step >= steps.length - 1 || step < 0) setStep(0);
    setPlaying(true);
  };
  const resetTrace = () => {
    setPlaying(false);
    setStep(-1);
  };

  const tracing = step >= 0;
  const activeEdges = useMemo(() => new Set(tracing ? steps[step].edges ?? [] : []), [tracing, step, steps]);
  const doneEdges = useMemo(
    () => new Set(tracing ? steps.slice(0, step).flatMap((s) => s.edges ?? []) : []),
    [tracing, step, steps],
  );

  const nodeState = useCallback(
    (id: string): NodeState => {
      if (!tracing) return "idle";
      const idx = steps.findIndex((s) => s.node === id);
      if (idx === step) return "active";
      if (idx >= 0 && idx < step) return "done";
      return "dim";
    },
    [tracing, step, steps],
  );

  const nodes = useMemo(
    () => positions.map((n) => ({ ...n, selected: n.id === selectedId, data: { ...n.data, state: nodeState(n.id) } })),
    [positions, selectedId, nodeState],
  );

  const edges: FlowEdgeType[] = useMemo(
    () =>
      project.edges.map((e) => {
        let state: EdgeState = "idle";
        if (tracing) state = activeEdges.has(e.id) ? "active" : doneEdges.has(e.id) ? "done" : "dim";
        else if (selectedId) state = e.from === selectedId || e.to === selectedId ? "active" : "dim";
        const src = project.nodes.find((n) => n.id === e.from)!;
        return {
          id: e.id,
          source: e.from,
          target: e.to,
          sourceHandle: e.fromSide ?? "right",
          targetHandle: e.toSide ?? "left",
          type: "flow",
          zIndex: state === "active" ? 10 : 0,
          data: { label: e.label, kind: e.kind, state, color: KINDS[src.kind].stroke },
        };
      }),
    [project, tracing, activeEdges, doneEdges, selectedId],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<SystemFlowNode>[]) =>
      setPositions((ns) => applyNodeChanges(changes.filter((c) => c.type !== "select"), ns)),
    [],
  );

  const fit = useCallback(() => {
    const wide = window.innerWidth >= 1024;
    fitView({
      duration: 500,
      padding: wide ? { left: "410px", right: "60px", top: "60px", bottom: "110px" } : 0.12,
    });
  }, [fitView]);

  // Fit once React Flow has measured the nodes (onInit fires too early for that)
  const nodesReady = useNodesInitialized();
  useEffect(() => {
    if (nodesReady) fit();
  }, [nodesReady, fit]);

  const selected = project.nodes.find((n) => n.id === selectedId) ?? null;
  const current = tracing ? steps[step] : null;

  return (
    <div className="flex flex-1 flex-col lg:relative">
      {/* Canvas */}
      <div className="relative h-[68vh] min-h-[420px] lg:absolute lg:inset-0 lg:h-auto">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={(_, n) => {
            if (playing) setPlaying(false);
            setSelectedId(n.id);
          }}
          onPaneClick={() => setSelectedId(null)}
          connectionMode={ConnectionMode.Loose}
          nodesConnectable={false}
          minZoom={0.3}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.6} color="var(--dot)" bgColor="var(--paper)" />
          <Controls position="bottom-right" showInteractive={false} onFitView={fit} />
        </ReactFlow>

        {/* Trace control pill */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-3 lg:pl-[380px]">
          <div className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border border-line bg-card/95 p-1.5 pr-4 shadow-[var(--shadow-lift)] backdrop-blur">
            <button
              onClick={playing ? () => setPlaying(false) : startTrace}
              className="flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink/85"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              {playing ? "Pause" : tracing ? "Resume" : "Watch a request"}
            </button>
            {tracing && (
              <button onClick={resetTrace} aria-label="Reset trace" className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-paper hover:text-ink">
                <RotateCcw className="size-4" />
              </button>
            )}
            <span className="min-w-0 truncate text-sm text-ink-soft">
              {current ? (
                <>
                  <span className="font-mono text-xs text-ink-faint">{step + 1}/{steps.length}</span>{" "}
                  <span className="font-medium text-ink">{current.title}</span>
                </>
              ) : (
                "Replay one request through the system"
              )}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {selected && (
            <Inspector node={selected} project={project} onClose={() => setSelectedId(null)} onSelect={setSelectedId} />
          )}
        </AnimatePresence>
      </div>

      {/* Project panel */}
      <aside className="relative z-10 m-3 flex flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[var(--shadow-lift)] lg:absolute lg:bottom-4 lg:left-4 lg:top-4 lg:m-0 lg:w-[360px]">
        <div className={`${accent.bg} px-5 pb-4 pt-5`}>
          <div className={`font-mono text-[10px] uppercase tracking-widest ${accent.ink}`}>
            {project.category} · {project.year}
          </div>
          <div className="mt-2 flex items-center gap-3">
            {project.brand?.logo && (
              <Image src={project.brand.logo} alt="" width={44} height={44} unoptimized className="rounded-xl shadow-[var(--shadow-soft)]" />
            )}
            <h1 className="font-display text-4xl leading-none">{project.name}</h1>
          </div>
          <p className="mt-2 text-sm leading-snug text-ink-soft">{project.tagline}</p>
          <div className="mt-4">
            <ProjectLinks project={project} size="sm" />
          </div>
        </div>

        <div className="flex gap-1 border-b border-line px-3 pt-2">
          {(project.brand ? TABS : TABS.filter((t) => t !== "product")).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-2 text-sm capitalize transition ${tab === t ? "text-ink" : "text-ink-faint hover:text-ink-soft"}`}
            >
              {t}
              {tab === t && <motion.span layoutId="tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ink" />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 text-sm">
          {tab === "product" && <BrandPanel project={project} />}

          {tab === "overview" && (
            <div className="space-y-6">
              {project.builtBy && (
                <span className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">{project.builtBy}</span>
              )}
              <p className="text-[15px] leading-relaxed">{project.summary}</p>
              <div>
                <Label>Outcomes</Label>
                <ul className="space-y-2">
                  {project.outcomes.map((o) => (
                    <li key={o} className="flex gap-2.5 text-ink-soft">
                      <span className={`mt-1.5 size-1.5 shrink-0 rounded-full`} style={{ background: accent.color }} />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Label>Components</Label>
                <div className="flex flex-wrap gap-1.5">
                  {project.nodes.map((n) => {
                    const K = KINDS[n.kind];
                    return (
                      <button
                        key={n.id}
                        onClick={() => setSelectedId(n.id)}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition hover:brightness-95 ${K.bg} ${K.ink}`}
                      >
                        <K.icon className="size-3" /> {n.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-ink-faint">Tip: click any component, or drag it around the board.</p>
              </div>
              <div>
                <Label>Stack</Label>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span key={s} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink-soft">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "trace" && (
            <div>
              <Label>Example request</Label>
              <div className="rounded-2xl bg-paper p-3 font-mono text-[12px] leading-relaxed">{project.trace.prompt}</div>
              <ol className="relative mt-5 space-y-1 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-px before:bg-line">
                {steps.map((s, i) => {
                  const K = KINDS[project.nodes.find((n) => n.id === s.node)!.kind];
                  const state = !tracing ? "idle" : i === step ? "active" : i < step ? "done" : "todo";
                  return (
                    <li key={i}>
                      <button
                        onClick={() => {
                          setPlaying(false);
                          setSelectedId(null);
                          setStep(i);
                        }}
                        className={`relative flex w-full gap-3 rounded-2xl p-2 text-left transition ${state === "active" ? "bg-paper" : "hover:bg-paper/70"}`}
                      >
                        <span
                          className={`relative z-10 mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full border-2 bg-card text-[10px] font-semibold ${
                            state === "todo" ? "border-line text-ink-faint" : "border-current"
                          } ${state === "done" ? "text-mint-ink" : state === "active" ? K.ink : "text-ink-faint"}`}
                        >
                          {i + 1}
                        </span>
                        <span className={`min-w-0 flex-1 ${state === "todo" ? "opacity-50" : ""}`}>
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="font-medium">{s.title}</span>
                            <span className="font-mono text-[10px] text-ink-faint">{fmtMs(s.ms)}</span>
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-ink-soft">{s.detail}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {!tracing && (
                <button onClick={startTrace} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-2.5 text-sm font-medium text-paper hover:bg-ink/85">
                  <Play className="size-4" /> Play trace
                </button>
              )}
            </div>
          )}

          {tab === "decisions" && (
            <div className="space-y-3">
              <p className="text-ink-soft">The calls that shaped this system, and why.</p>
              {project.decisions.map((d, i) => (
                <div key={d.title} className="rounded-2xl border border-line p-4">
                  <div className="flex items-start gap-3">
                    <span className={`grid size-6 shrink-0 place-items-center rounded-full font-mono text-[11px] ${accent.bg} ${accent.ink}`}>{i + 1}</span>
                    <div>
                      <h3 className="font-medium leading-snug">{d.title}</h3>
                      <p className="mt-1.5 leading-relaxed text-ink-soft">{d.why}</p>
                      {d.tradeoff && <p className="mt-2 text-xs text-ink-faint"><span className="font-medium">Trade-off:</span> {d.tradeoff}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{children}</h2>;
}

function fmtMs(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(ms >= 10000 ? 0 : 1)}s` : `${ms}ms`;
}
