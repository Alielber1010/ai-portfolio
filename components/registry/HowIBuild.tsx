import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GraphThumb } from "@/components/GraphThumb";
import { KINDS } from "@/lib/kinds";
import { pillars, workflow } from "@/lib/workflow";

export function HowIBuild() {
  return (
    <section id="how-i-build" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">02 — How I build</p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl">
            AI writes the code. <span className="text-lavender-ink">I design the system.</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-ink-soft">My Claude Code setup, built like any other system.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* The workflow, as an openable architecture */}
        <Link
          href={`/projects/${workflow.slug}`}
          className="group relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-card p-3 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
        >
          <div className="dot-grid relative aspect-[16/10] overflow-hidden rounded-[20px] bg-lavender/40">
            <GraphThumb project={workflow} className="absolute inset-0 size-full p-5 transition duration-500 group-hover:scale-[1.03]" />
          </div>
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <div className="font-display text-2xl">Claude Code, with guard-rails</div>
              <div className="mt-1 text-sm text-ink-soft">Rules → wiki → skills → review → deploy</div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
              Explore <ArrowUpRight className="size-4" />
            </span>
          </div>
        </Link>

        <div className="grid gap-3 sm:grid-cols-2">
          {pillars.map((p) => {
            const K = KINDS[p.kind];
            return (
              <div key={p.title} className="flex flex-col rounded-3xl border border-line bg-card p-5 shadow-[var(--shadow-soft)]">
                <span className={`grid size-10 place-items-center rounded-xl ${K.bg} ${K.ink}`}>
                  <K.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-xl">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-snug text-ink-soft">{p.text}</p>
                <span className="mt-auto pt-4 font-mono text-[11px] text-ink-faint">{p.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
