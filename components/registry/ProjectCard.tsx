import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GraphThumb } from "@/components/GraphThumb";
import { ACCENTS } from "@/lib/kinds";
import type { Project } from "@/lib/types";

/** A minimal tile: preview, logo, name. Everything else lives on the architecture page. */
export function ProjectCard({ project }: { project: Project }) {
  const accent = ACCENTS[project.accent];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-3 rounded-3xl border border-line bg-card p-2.5 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className={`${accent.bg} rounded-2xl p-1.5`}>
        <div className="dot-grid relative aspect-[16/10] overflow-hidden rounded-xl">
          <GraphThumb project={project} className="absolute inset-0 size-full p-3 transition duration-500 group-hover:scale-[1.06]" />
        </div>
      </div>
      <div className="flex items-center gap-2.5 px-1.5 pb-1">
        {project.brand?.logo && (
          <Image src={project.brand.logo} alt="" width={28} height={28} unoptimized className="size-7 shrink-0 rounded-lg" />
        )}
        <h3 className="min-w-0 flex-1 font-display text-base leading-tight sm:truncate sm:text-lg sm:leading-none">{project.name}</h3>
        <ArrowUpRight className="hidden size-4 shrink-0 text-ink-faint sm:block transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>
    </Link>
  );
}
