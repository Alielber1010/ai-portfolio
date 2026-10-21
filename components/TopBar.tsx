import Link from "next/link";
import { profile } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { GitHubIcon } from "./GitHubIcon";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar({ trail }: { trail?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <span className="grid size-7 place-items-center rounded-lg bg-ink font-display text-base text-paper">a</span>
            <span className="hidden sm:inline">{profile.handle}</span>
          </Link>
          <span className="text-ink-faint">/</span>
          <Link href="/#registry" className="text-ink-soft hover:text-ink">registry</Link>
          {trail && (
            <>
              <span className="text-ink-faint">/</span>
              <span className="truncate font-medium">{trail}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 hidden items-center gap-2 rounded-full border border-line bg-card px-3 py-1 font-mono text-[11px] text-ink-soft md:flex">
            <span className="live-dot size-1.5 rounded-full bg-mint-ink" />
            {projects.length} systems online
          </span>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-full border border-line bg-card text-ink-soft transition hover:text-ink"
          >
            <GitHubIcon className="size-4" />
          </a>
          <ThemeToggle />
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper transition hover:opacity-85"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
