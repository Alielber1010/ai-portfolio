import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

export function Registry({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}
