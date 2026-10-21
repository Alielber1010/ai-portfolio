"use client";

import { ArrowRight, X } from "lucide-react";
import { motion } from "motion/react";
import { KINDS } from "@/lib/kinds";
import type { Project, SystemNode } from "@/lib/types";

export function Inspector({ node, project, onClose, onSelect }: {
  node: SystemNode;
  project: Project;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const K = KINDS[node.kind];
  const label = (id: string) => project.nodes.find((n) => n.id === id)?.label ?? id;
  const incoming = project.edges.filter((e) => e.to === node.id);
  const outgoing = project.edges.filter((e) => e.from === node.id);

  return (
    <motion.aside
      key={node.id}
      initial={{ opacity: 0, x: 24, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="absolute inset-x-2 bottom-2 z-20 flex max-h-[75%] flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-[var(--shadow-lift)] lg:inset-x-auto lg:bottom-auto lg:right-4 lg:top-4 lg:max-h-[calc(100%-6rem)] lg:w-[360px]"
    >
      <div className={`${K.bg} relative px-5 pb-5 pt-4`}>
        <button onClick={onClose} aria-label="Close inspector" className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-card/70 text-ink-soft hover:bg-card hover:text-ink">
          <X className="size-4" />
        </button>
        <div className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${K.ink}`}>
          <K.icon className="size-3.5" /> {K.label}
        </div>
        <h3 className="mt-2 font-display text-3xl leading-none">{node.label}</h3>
        {node.tech && <div className="mt-2 inline-block rounded-md bg-card/70 px-2 py-0.5 font-mono text-[11px] text-ink-soft">{node.tech}</div>}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5 text-sm">
        <p className="text-[15px] leading-relaxed">{node.summary}</p>

        {node.responsibilities && (
          <Section title="What it does">
            <ul className="space-y-2">
              {node.responsibilities.map((r) => (
                <li key={r} className="flex gap-2 text-ink-soft">
                  <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${K.bg} ring-2 ring-current ${K.ink}`} />
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {node.io && (
          <Section title="Interface">
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-2xl bg-paper p-3 font-mono text-[12px]">
              <span className="text-ink-faint">in</span>
              <span>{node.io.in}</span>
              <span className="text-ink-faint">out</span>
              <span>{node.io.out}</span>
            </div>
          </Section>
        )}

        {(incoming.length > 0 || outgoing.length > 0) && (
          <Section title="Connections">
            <div className="flex flex-wrap gap-1.5">
              {incoming.map((e) => (
                <button key={e.id} onClick={() => onSelect(e.from)} className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft hover:border-ink-faint hover:text-ink">
                  {label(e.from)} <ArrowRight className="size-3" /> <span className="text-ink-faint">here</span>
                </button>
              ))}
              {outgoing.map((e) => (
                <button key={e.id} onClick={() => onSelect(e.to)} className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft hover:border-ink-faint hover:text-ink">
                  <span className="text-ink-faint">here</span> <ArrowRight className="size-3" /> {label(e.to)}
                </button>
              ))}
            </div>
          </Section>
        )}

        {node.code && (
          <Section title="Glimpse of the code">
            <pre className="overflow-x-auto rounded-2xl bg-[var(--code-bg)] p-4 font-mono text-[11.5px] leading-relaxed text-[var(--code-ink)]">
              <code>{node.code.snippet}</code>
            </pre>
          </Section>
        )}
      </div>
    </motion.aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">{title}</h4>
      {children}
    </section>
  );
}
