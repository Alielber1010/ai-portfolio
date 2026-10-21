"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

export function Registry({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const categories = useMemo(() => [...new Set(projects.map((p) => p.category))], [projects]);

  const visible = projects.filter((p) => {
    if (category && p.category !== category) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [p.name, p.tagline, p.category, ...p.stack, ...p.nodes.map((n) => n.label)]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                category === c ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink-soft hover:border-ink-faint"
              }`}
            >
              {c ?? "All systems"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm shadow-[var(--shadow-soft)] sm:w-72">
          <Search className="size-4 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, tools, stack…"
            className="w-full bg-transparent outline-none placeholder:text-ink-faint"
          />
        </label>
      </div>

      {visible.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((p) => (
            <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} />
          ))}
        </div>
      ) : (
        <p className="rounded-3xl border border-dashed border-line bg-card/60 p-10 text-center text-ink-soft">
          No systems match “{query}”.
        </p>
      )}
    </div>
  );
}
