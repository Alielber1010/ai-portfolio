import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe, Network } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import { GraphThumb } from "@/components/GraphThumb";
import { ACCENTS, KINDS } from "@/lib/kinds";
import type { NodeKind, Project } from "@/lib/types";

const STATUS: Record<Project["status"], string> = {
  production: "In production",
  pilot: "Pilot",
  research: "Research",
  building: "In progress",
};

// Buttons sit above the card's stretched link, hence `relative z-10`.
const BTN = "relative z-10 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.accent];
  const count = (k: NodeKind) => project.nodes.filter((n) => n.kind === k).length;
  const counts = (["agent", "tool", "memory"] as const)
    .map((k) => ({ k, n: k === "memory" ? count("memory") + count("data") : count(k) }))
    .filter((c) => c.n > 0);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[28px] border border-line bg-card shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
      <div className={`relative ${accent.bg} p-3`}>
        <div className="dot-grid relative aspect-[16/9] overflow-hidden rounded-[20px]">
          <GraphThumb project={project} className="absolute inset-0 size-full p-4 transition duration-500 group-hover:scale-[1.04]" />
        </div>
        <span className="absolute left-6 top-6 rounded-full bg-card/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft backdrop-blur">
          {String(index + 1).padStart(2, "0")} · {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-4">
            {project.brand?.logo && (
              <Image src={project.brand.logo} alt={`${project.name} logo`} width={52} height={52} unoptimized className="size-13 shrink-0 rounded-2xl shadow-[var(--shadow-soft)]" />
            )}
            <div>
              <h3 className="font-display text-3xl leading-none">
                {/* Stretched link: the whole card opens the project */}
                <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
                  {project.name}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] leading-snug text-ink-soft">{project.tagline}</p>
            </div>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-ink-soft">
            <span className={`size-1.5 rounded-full ${project.status === "production" ? "bg-mint-ink" : "bg-butter-ink"}`} />
            {STATUS[project.status]}
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

        <div className="mt-auto flex flex-col gap-3 border-t border-dashed border-line pt-4">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 5).map((s) => (
              <span key={s} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-ink-soft">
                {s}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {project.demo ? (
              <a href={project.demo} target="_blank" rel="noreferrer" className={`${BTN} bg-ink text-paper hover:opacity-85`}>
                <Globe className="size-3.5" /> Website
              </a>
            ) : (
              <span className={`${BTN} border border-dashed border-line text-ink-faint`} title="Website coming soon">
                <Globe className="size-3.5" /> Website soon
              </span>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className={`${BTN} border border-line bg-card hover:border-ink`}>
                <GitHubIcon className="size-3.5" /> GitHub
              </a>
            )}
            <Link href={`/projects/${project.slug}`} className={`${BTN} border border-line bg-card hover:border-ink`}>
              <Network className="size-3.5" /> View architecture
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function plural(word: string) {
  return word.endsWith("y") ? `${word.slice(0, -1)}ies` : `${word}s`;
}
