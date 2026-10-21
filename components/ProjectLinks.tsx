import { Lock, Play } from "lucide-react";
import { GitHubIcon } from "./GitHubIcon";
import type { Project } from "@/lib/types";

/** GitHub + Demo buttons. Rendered above overlay links, hence `relative z-10`. */
export function ProjectLinks({ project, size = "md" }: { project: Project; size?: "sm" | "md" }) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const icon = size === "sm" ? "size-3.5" : "size-4";

  return (
    <div className="relative z-10 flex flex-wrap gap-2">
      {project.github ? (
        <a href={project.github} target="_blank" rel="noreferrer" className={`flex items-center gap-2 rounded-full border border-line bg-card font-medium transition hover:border-ink ${pad}`}>
          <GitHubIcon className={icon} /> GitHub
        </a>
      ) : (
        <span className={`flex items-center gap-2 rounded-full border border-dashed border-line text-ink-faint ${pad}`}>
          <Lock className={icon} /> Private repo
        </span>
      )}
      {project.demo ? (
        <a href={project.demo} target="_blank" rel="noreferrer" className={`flex items-center gap-2 rounded-full bg-ink font-medium text-paper transition hover:opacity-85 ${pad}`}>
          <Play className={icon} /> Live demo
        </a>
      ) : (
        <span className={`flex items-center gap-2 rounded-full border border-dashed border-line text-ink-faint ${pad}`}>
          <Play className={icon} /> Demo on request
        </span>
      )}
    </div>
  );
}
