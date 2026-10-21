import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { GraphThumb } from "@/components/GraphThumb";
import { ProjectLinks } from "@/components/ProjectLinks";
import { ACCENTS, KINDS } from "@/lib/kinds";
import type { NodeKind, Project } from "@/lib/types";

const STATUS: Record<Project["status"], string> = {
  production: "In production",
  pilot: "Pilot",
  research: "Research",
};

/** One compact row: the recruiter-level story up front, the architecture one click away. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.accent];
  const count = (k: NodeKind) => project.nodes.filter((n) => n.kind === k).length;
  const counts = (["agent", "tool", "memory"] as const)
    .map((k) => ({ k, n: k === "memory" ? count("memory") + count("data") : count(k) }))
    .filter((c) => c.n > 0);

  return (
    <article className="group relative grid items-center gap-4 rounded-3xl border border-line bg-card p-3 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:grid-cols-[168px_1fr_auto] sm:gap-5">
      <div className={`relative ${accent.bg} hidden rounded-2xl p-1.5 sm:block`}>
        <div className="dot-grid relative aspect-[16/10] overflow-hidden rounded-xl">
          <GraphThumb project={project} className="absolute inset-0 size-full p-2 transition duration-500 group-hover:scale-[1.06]" />
        </div>
      </div>

      <div className="min-w-0 px-2 sm:px-0">
        <div className="flex items-center gap-3">
          {project.brand?.logo && (
            <Image src={project.brand.logo} alt={`${project.name} logo`} width={32} height={32} unoptimized className="size-8 shrink-0 rounded-lg shadow-[var(--shadow-soft)]" />
          )}
          <h3 className="font-display text-2xl leading-none">
            {/* Stretched link: the whole row opens the project */}
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-3xl">
              {project.name}
            </Link>
          </h3>
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-ink-faint md:inline">
            {String(index + 1).padStart(2, "0")} · {project.category}
          </span>
        </div>
        <p className="mt-1.5 text-[15px] leading-snug text-ink-soft">{project.tagline}</p>
        {project.outcomes[0] && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium">
            <Check className="size-3.5 shrink-0 text-mint-ink" strokeWidth={3} />
            {project.outcomes[0]}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-ink-soft">
            <span className={`size-1.5 rounded-full ${project.status === "production" ? "bg-mint-ink" : "bg-butter-ink"}`} />
            {STATUS[project.status]} · {project.year}
          </span>
          {project.builtBy?.startsWith("Solo") && (
            <span className="rounded-full bg-ink px-2.5 py-1 font-medium text-paper">Solo build</span>
          )}
          {counts.map(({ k, n }) => {
            const K = KINDS[k];
            return (
              <span key={k} className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${K.bg} ${K.ink}`}>
                <K.icon className="size-3" />
                {n} {n > 1 ? plural(K.label.toLowerCase()) : K.label.toLowerCase()}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 px-2 pb-1 sm:flex-col sm:items-end sm:justify-center sm:px-2 sm:pb-0">
        <ProjectLinks project={project} size="sm" />
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-ink-faint transition group-hover:text-ink">
          <span className="hidden sm:inline">View architecture</span>
          <span className="grid size-7 place-items-center rounded-full border border-line transition group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
            <ArrowUpRight className="size-3.5" />
          </span>
        </span>
      </div>
    </article>
  );
}

function plural(word: string) {
  return word.endsWith("y") ? `${word.slice(0, -1)}ies` : `${word}s`;
}
