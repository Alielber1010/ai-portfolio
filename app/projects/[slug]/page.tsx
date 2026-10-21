import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { Explorer } from "@/components/explorer/Explorer";
import { getProject, projects } from "@/lib/projects";
import { profile } from "@/lib/profile";
import { workflow } from "@/lib/workflow";

// Every slug is prerendered below, so waiting on `params` costs nothing.
export const instant = false;

export function generateStaticParams() {
  return [...projects, workflow].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: `${project.name} — ${profile.name}`, description: project.tagline } : {};
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <TopBar trail={project.name.toLowerCase()} />
      <Explorer project={project} />
    </div>
  );
}
