import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GraphThumb } from "@/components/GraphThumb";
import { ACCENTS } from "@/lib/kinds";
import type { Project } from "@/lib/types";

/** A minimal row: preview, logo, name, one line. Everything else lives on the architecture page. */
export function ProjectCard({ project }: { project: Project }) {
  const accent = ACCENTS[project.accent];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex items-center gap-4 rounded-3xl border border-line bg-card p-2.5 pr-5 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
    >
      <div className={`${accent.bg} w-28 shrink-0 rounded-2xl p-1 sm:w-40`}>
        <div className="dot-grid relative aspect-[16/10] overflow-hidden rounded-xl">
          <GraphThumb project={project} className="absolute inset-0 size-full p-2 transition duration-500 group-hover:scale-[1.06]" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          {project.brand?.logo && (
            <Image src={project.brand.logo} alt="" width={24} height={24} unoptimized className="size-6 shrink-0 rounded-md" />
          )}
          <h3 className="font-display text-lg leading-tight">{project.name}</h3>
        </div>
        <p className="mt-1.5 text-sm leading-snug text-ink-soft">{project.tagline}</p>
      </div>
      <ArrowUpRight className="hidden size-4 shrink-0 text-ink-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink sm:block" />
    </Link>
  );
}
