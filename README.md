# AI Portfolio — Ali Elbermawy

My portfolio as an AI engineer, built like the systems it shows.

**Live:** https://portfolio.ali-elber.space

- **Registry** — every system I've built, one row each: what it does, the result, the stack.
- **Architecture explorer** — open a system to see its agents, tools and memory as a live graph, with a step-by-step trace of a real request.
- **How I build** — my Claude Code workflow, drawn as a system too.

## Stack

Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4, React Flow, TypeScript.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Content lives in `lib/`: `profile.ts` (about me), `projects.ts` (systems, nodes, edges, traces), `workflow.ts` (how I build).

## Deploy

Runs as a standalone Next.js server in Docker:

```bash
docker compose up -d --build   # serves on 127.0.0.1:8091
```
