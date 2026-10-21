"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GraphThumb } from "@/components/GraphThumb";
import { ACCENTS } from "@/lib/kinds";
import type { Project } from "@/lib/types";

const SLIDE_MS = 5500;

const href = (p: Project) => p.demo ?? `/projects/${p.slug}`;
const shownUrl = (p: Project) => (p.demo ? p.demo.replace(/^https?:\/\//, "") : `ali-elber.space/projects/${p.slug}`);

/**
 * The hero's "trailer": each project gets a few seconds on screen — its live site if it has one,
 * otherwise its architecture — then hands over to the next. Hover pauses; the tiles jump.
 */
export function HeroShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = () => setActive((i) => (i + 1) % projects.length);
  const current = projects[active];

  return (
    <div
      className="mx-auto w-full max-w-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* The screen */}
      <Stage project={current} external={!!current.demo}>
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="flex gap-1.5">
            {["bg-rose", "bg-butter", "bg-mint"].map((c) => (
              <span key={c} className={`size-2.5 rounded-full ${c}`} />
            ))}
          </span>
          <span className="mx-auto truncate rounded-full bg-paper px-3 py-1 font-mono text-[11px] text-ink-faint">
            {shownUrl(current)}
          </span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden">
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <div
                key={p.slug}
                aria-hidden={!on}
                className={`absolute inset-0 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`}
              >
                {p.demo ? (
                  // Live site, rendered at desktop size and scaled down. Only the active one is mounted.
                  on && (
                    <iframe
                      src={p.demo}
                      title={`${p.name} website`}
                      loading="lazy"
                      tabIndex={-1}
                      className="pointer-events-none h-[250%] w-[250%] origin-top-left scale-[0.4] border-0 bg-card"
                    />
                  )
                ) : (
                  <div className="dot-grid size-full">
                    <GraphThumb
                      key={on ? `on-${active}` : "off"}
                      project={p}
                      className={`size-full p-6 ${on ? "kenburns" : ""}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-card/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft shadow-[var(--shadow-soft)] backdrop-blur">
            <span className="live-dot size-1.5 rounded-full bg-mint-ink" />
            {current.demo ? "live site" : "live architecture"}
          </span>
        </div>

        <div className="flex items-center gap-3 border-t border-line px-4 py-3">
          {current.brand?.logo && (
            <Image src={current.brand.logo} alt="" width={36} height={36} unoptimized className="size-9 shrink-0 rounded-xl" />
          )}
          <div key={current.slug} className="slide-in min-w-0 flex-1">
            <div className="font-display text-lg leading-tight">{current.name}</div>
            <div className="truncate text-sm text-ink-soft">{current.tagline}</div>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-paper transition group-hover:opacity-85">
            {current.demo ? "Visit site" : "Explore"} <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </Stage>

      {/* The reel: one tile per project, with a story-style progress bar on the active one */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {projects.map((p, i) => {
          const on = i === active;
          return (
            <button
              key={p.slug}
              onClick={() => setActive(i)}
              aria-label={`Show ${p.name}`}
              aria-current={on}
              className={`group/tile relative overflow-hidden rounded-2xl border bg-card p-1.5 text-left transition ${
                on ? "border-ink-faint shadow-[var(--shadow-soft)]" : "border-line opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`dot-grid aspect-[16/9] overflow-hidden rounded-xl ${ACCENTS[p.accent].bg}`}>
                <GraphThumb project={p} className="size-full p-1.5" />
              </div>
              <div className="flex items-center gap-1.5 px-1 pb-1 pt-1.5">
                {p.brand?.logo && (
                  <Image src={p.brand.logo} alt="" width={16} height={16} unoptimized className="size-4 shrink-0 rounded" />
                )}
                <span className="truncate text-xs font-medium">{p.name}</span>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-line">
                {on && (
                  <span
                    key={active}
                    className="reel-progress block h-full"
                    style={{
                      background: ACCENTS[p.accent].color,
                      animationDuration: `${SLIDE_MS}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    onAnimationEnd={next}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stage({ project, external, children }: { project: Project; external: boolean; children: React.ReactNode }) {
  const cls =
    "group block overflow-hidden rounded-3xl border border-line bg-card shadow-[var(--shadow-lift)] transition duration-300 hover:-translate-y-0.5";
  return external ? (
    <a href={href(project)} target="_blank" rel="noreferrer" className={cls} aria-label={`Visit ${project.name}`}>
      {children}
    </a>
  ) : (
    <Link href={href(project)} className={cls} aria-label={`Explore ${project.name}`}>
      {children}
    </Link>
  );
}
