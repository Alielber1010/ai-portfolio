import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ArticleBody } from "@/components/ArticleBody";
import { TopBar } from "@/components/TopBar";
import { articles, getArticle } from "@/lib/articles";
import { profile } from "@/lib/profile";
import { getProject } from "@/lib/projects";

// Every slug is prerendered below, so waiting on `params` costs nothing.
export const instant = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: `${a.title} — ${profile.name}`, description: a.summary } : {};
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const project = a.project ? getProject(a.project) : undefined;
  const date = new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="dot-grid min-h-dvh overflow-x-clip">
      <TopBar trail="articles" />
      <article className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-ink-faint">
          <span>{date}</span>
          {project && (
            <>
              <span>·</span>
              <Link href={`/projects/${project.slug}`} className="hover:text-ink">
                From {project.name}
              </Link>
            </>
          )}
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{a.title}</h1>
        <p className="mt-5 text-lg text-ink-soft">{a.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {a.results?.map((r) => (
            <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium transition hover:border-ink">
              {r.label} <ArrowUpRight className="size-3.5" />
            </a>
          ))}
          {a.medium && (
            <a href={a.medium} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-85">
              Read on Medium <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>

        <div className="mt-10 rounded-[28px] border border-line bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10">
          <ArticleBody source={a.body} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {a.tags.map((t) => (
            <span key={t} className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft">
              {t}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}
