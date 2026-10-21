import Image from "next/image";
import { ArrowDown, Mail } from "lucide-react";
import { GitHubIcon } from "@/components/GitHubIcon";
import { TopBar } from "@/components/TopBar";
import { HeroShowcase } from "@/components/registry/HeroShowcase";
import { HowIBuild } from "@/components/registry/HowIBuild";
import { Registry } from "@/components/registry/Registry";
import { KINDS } from "@/lib/kinds";
import { profile } from "@/lib/profile";
import { projects } from "@/lib/projects";

export default function Home() {
  const agentCount = projects.flatMap((p) => p.nodes).filter((n) => n.kind === "agent").length;
  const componentCount = projects.reduce((s, p) => s + p.nodes.length, 0);

  return (
    <div className="dot-grid min-h-dvh overflow-x-clip">
      <TopBar />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24 [&>*]:min-w-0">
        <div>
          <div className="flex items-center gap-5">
            <Image
              src="/me.jpg"
              alt={`Portrait of ${profile.name}`}
              width={96}
              height={96}
              priority
              unoptimized
              className="size-20 shrink-0 rounded-full object-cover shadow-[var(--shadow-lift)] ring-4 ring-card sm:size-24"
            />
            <div>
              <div className="font-display text-2xl sm:text-3xl">{profile.name}</div>
              {profile.available && (
                <span className="mt-1 inline-flex items-center gap-2 text-sm text-ink-soft">
                  <span className="live-dot size-1.5 rounded-full bg-mint-ink" />
                  Open to AI Engineering roles
                </span>
              )}
            </div>
          </div>
          <h1 className="mt-8 font-display text-[2.9rem] leading-[0.95] sm:text-7xl lg:text-6xl xl:text-7xl">
            I build{" "}
            <span className="relative isolate text-lavender-ink sm:whitespace-nowrap">
              <span className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.32em] rounded-sm bg-lavender" />
              agentic systems
            </span>
            <br />
            that ship.
          </h1>
          <p className="mt-6 text-lg text-ink-soft sm:text-xl">
            {profile.headline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#registry" className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:opacity-85">
              Explore my systems <ArrowDown className="size-4" />
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold transition hover:border-ink">
              <GitHubIcon className="size-4" /> GitHub
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="grid size-[46px] place-items-center rounded-full border border-line bg-card transition hover:border-ink">
              <Mail className="size-4" />
            </a>
          </div>
          <dl className="mt-10 flex gap-8">
            {[
              [projects.length, "systems"],
              [agentCount, "agents"],
              [componentCount, "components"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-4xl leading-none">{n}</dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-faint">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroShowcase projects={projects} />
      </section>

      {/* Registry */}
      <section id="registry" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">01 — Registry</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Systems I’ve built</h2>
          </div>
          <p className="max-w-sm text-sm text-ink-soft">
            Open any system to explore its live architecture.
          </p>
        </div>
        <Registry projects={projects} />
      </section>

      <HowIBuild />

      {/* Legend + stack */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 rounded-[32px] border border-line bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">03 — How to read a system</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Every colour means something.</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {(["agent", "model", "tool", "memory", "service", "input"] as const).map((k) => {
              const K = KINDS[k];
              return (
                <div key={k} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                  <span className={`grid size-9 place-items-center rounded-xl ${K.bg} ${K.ink}`}>
                    <K.icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{k === "input" ? "Input / Output" : K.label}</span>
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-2">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink-faint">Toolbox</p>
            <div className="flex flex-wrap gap-2">
              {profile.stack.map((s) => (
                <span key={s} className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 pb-14 pt-6 sm:flex-row sm:items-end sm:px-6">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl">Let’s build something that thinks.</h2>
          <a href={`mailto:${profile.email}`} className="mt-3 inline-block text-lg text-lavender-ink underline-offset-4 hover:underline">
            {profile.email}
          </a>
        </div>
        <div className="flex gap-4 text-sm text-ink-soft">
          <a href={profile.links.github} className="hover:text-ink">GitHub</a>
          <a href={profile.links.linkedin} className="hover:text-ink">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
