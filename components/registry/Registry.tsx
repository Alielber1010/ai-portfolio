import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

export function Registry({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}
