import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import { GraphThumb } from "@/components/GraphThumb";
import { ACCENTS } from "@/lib/kinds";
import type { Project } from "@/lib/types";

const BTN = "relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition";

/** One row: preview, logo, name, one line, and the two links people actually want. */
export function ProjectCard({ project }: { project: Project }) {
  const accent = ACCENTS[project.accent];

  return (
    <article className="group relative flex flex-col gap-5 rounded-[28px] border border-line bg-card p-3 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:flex-row sm:items-center sm:pr-6">
      <div className={`${accent.bg} shrink-0 rounded-[22px] p-1.5 sm:w-60`}>
        <div className="dot-grid relative aspect-[16/10] overflow-hidden rounded-2xl">
          <GraphThumb project={project} className="absolute inset-0 size-full p-3 transition duration-500 group-hover:scale-[1.06]" />
        </div>
      </div>

      <div className="min-w-0 flex-1 px-2 pb-2 sm:px-0 sm:pb-0">
        <div className="flex items-center gap-3">
          {project.brand?.logo && (
            <Image src={project.brand.logo} alt="" width={40} height={40} unoptimized className="size-10 shrink-0 rounded-xl shadow-[var(--shadow-soft)]" />
          )}
          <h3 className="flex-1 font-display text-2xl leading-tight">
            {/* Stretched link: the whole row opens the architecture page */}
            <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:rounded-[28px]">
              {project.name}
            </Link>
          </h3>
          <ArrowUpRight className="hidden size-5 shrink-0 text-ink-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink sm:block" />
        </div>
        <p className="mt-2.5 text-base leading-snug text-ink-soft">{project.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.demo ? (
            <a href={project.demo} target="_blank" rel="noreferrer" className={`${BTN} bg-ink text-paper hover:opacity-85`}>
              <Globe className="size-4" /> Website
            </a>
          ) : (
            <span className={`${BTN} border border-dashed border-line text-ink-faint`} title="Website coming soon">
              <Globe className="size-4" /> Website soon
            </span>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className={`${BTN} border border-line bg-card hover:border-ink`}>
              <GitHubIcon className="size-4" /> GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
