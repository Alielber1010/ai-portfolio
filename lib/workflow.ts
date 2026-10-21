import type { Project } from "./types";

/*
 * How I build: my AI-assisted engineering setup, modelled as a system like any other project.
 * Opens in the same explorer at /projects/how-i-build. Edit to match your real setup.
 */

export const pillars = [
  {
    kind: "tool" as const,
    title: "Curated skills",
    text: "Reusable playbooks the agent must follow: deploy, harden, review.",
    tag: "~/.claude/skills/vps",
  },
  {
    kind: "memory" as const,
    title: "Wiki as source of truth",
    text: "Each project’s spec lives in an Outline wiki. The agent reads and updates it over MCP.",
    tag: "outline · markdown · MCP",
  },
  {
    kind: "model" as const,
    title: "Design systems",
    text: "Shared tokens and components, so every product ships with a deliberate brand.",
    tag: "tokens · components",
  },
  {
    kind: "service" as const,
    title: "Plugins & MCP",
    text: "The agent works where my tools live: automations, docs, hosting, databases.",
    tag: "n8n · Notion · Vercel · Supabase",
  },
];

export const workflow: Project = {
  slug: "how-i-build",
  name: "How I Build",
  tagline: "My AI-assisted engineering setup: Claude Code with rules, memory and tools.",
  category: "Engineering Workflow",
  accent: "lavender",
  status: "production",
  year: "Daily",
  github: "https://github.com/Alielber1010", // TODO: link a public dotfiles / skills repo if you have one
  builtBy: "Solo: every skill, wiki, design system and integration is set up by me",
  summary:
    "AI writes code fast; I design the system it writes into. Claude Code works inside guard-rails I built: global rules, curated skills, a wiki that holds the source of truth for each project, a design system for brand consistency, and MCP connectors to the tools I use.",
  outcomes: [
    "Architecture and specs are decided first, in the wiki",
    "Repeatable tasks are skills, not prompts I retype",
    "Every deploy follows the same audited playbook",
  ],
  stack: ["Claude Code", "Skills", "MCP", "Outline", "Subagents", "Design systems", "n8n", "Git"],
  nodes: [
    {
      id: "me", label: "Me: spec & review", kind: "input", x: 0, y: 200,
      summary: "I own the architecture: I write the spec, set constraints and review every change.",
      responsibilities: ["Defines the system boundaries and data model", "Decides trade-offs", "Reviews diffs before merge"],
    },
    {
      id: "wiki", label: "Outline Wiki", kind: "memory", x: 300, y: 20, tech: "markdown · MCP",
      summary: "The main version of every project: specs, decisions and runbooks, in markdown.",
      responsibilities: ["Single source of truth the agent reads before coding", "Agent writes back decisions and changelogs", "Survives across sessions and tools"],
      io: { in: "Specs, ADRs, runbooks", out: "Context for the agent" },
    },
    {
      id: "rules", label: "CLAUDE.md rules", kind: "data", x: 300, y: 380, tech: "global + per-repo",
      summary: "Standing instructions: which skill to use when, conventions, safety rules.",
      code: {
        lang: "md",
        snippet: `## My VPS
Whenever I ask to deploy, ship or debug
"the server", use the \`vps\` skill and
follow its deploy playbook and safety rules.
For audits or hardening, use \`vps-hardening\`.`,
      },
    },
    {
      id: "claude", label: "Claude Code", kind: "agent", x: 620, y: 200, tech: "claude-opus",
      summary: "The coding agent: plans, edits, runs and verifies, inside the guard-rails above.",
      responsibilities: ["Loads rules + relevant skill before acting", "Pulls context from the wiki", "Verifies with builds, tests and screenshots"],
    },
    {
      id: "sub", label: "Subagents", kind: "agent", x: 940, y: 20, tech: "explore · plan · review",
      summary: "Parallel helpers for wide searches, plans and code reviews.",
    },
    {
      id: "skills", label: "Curated Skills", kind: "tool", x: 940, y: 160, tech: "SKILL.md",
      summary: "Versioned playbooks I wrote: deploying, server hardening, reviews.",
      responsibilities: ["Step-by-step procedures with safety rails", "Same result every time, whoever asks", "Improved after every incident"],
      code: {
        lang: "md",
        snippet: `---
name: vps
description: Deploy, update, inspect or roll back
  projects on my VPS behind a Cloudflare Tunnel.
---
1. Check disk / RAM before building
2. Build image, tag with git SHA
3. Health-check, then switch traffic
4. Keep previous image for rollback`,
      },
    },
    {
      id: "design", label: "Design System", kind: "model", x: 940, y: 300, tech: "tokens · components",
      summary: "Brand tokens and components every product starts from.",
    },
    {
      id: "mcp", label: "Plugins & MCP", kind: "service", x: 940, y: 440, tech: "n8n · Notion · Vercel",
      summary: "Connectors so the agent can act in real tools, with my permissions.",
    },
    {
      id: "repo", label: "Git + CI", kind: "service", x: 1260, y: 200, tech: "GitHub",
      summary: "Every change lands as a reviewed commit.",
    },
    {
      id: "ship", label: "Production", kind: "output", x: 1560, y: 200, tech: "VPS · Cloudflare Tunnel",
      summary: "Deployed through the skill’s playbook, on *.ali-elber.space.",
    },
  ],
  edges: [
    { id: "w1", from: "me", to: "wiki", label: "spec" },
    { id: "w2", from: "me", to: "rules", label: "rules" },
    { id: "w3", from: "wiki", to: "claude", kind: "data", label: "context" },
    { id: "w4", from: "rules", to: "claude", kind: "data" },
    { id: "w5", from: "claude", to: "sub", kind: "control" },
    { id: "w6", from: "claude", to: "skills", label: "invoke" },
    { id: "w7", from: "claude", to: "design", kind: "data" },
    { id: "w8", from: "claude", to: "mcp", kind: "control" },
    { id: "w9", from: "skills", to: "repo" },
    { id: "w10", from: "repo", to: "ship", label: "deploy" },
    { id: "w11", from: "claude", to: "wiki", fromSide: "top", toSide: "right", kind: "data", label: "write back" },
  ],
  trace: {
    prompt: "“Add a dark mode to the portfolio and deploy it.”",
    steps: [
      { node: "me", title: "Intent", detail: "One-line request; the spec already lives in the wiki.", ms: 10 },
      { node: "wiki", edges: ["w1"], title: "Context loaded", detail: "Design tokens + project spec pulled over MCP.", ms: 900 },
      { node: "rules", edges: ["w2"], title: "Rules applied", detail: "Repo conventions + “deploy → use vps skill”.", ms: 50 },
      { node: "claude", edges: ["w3", "w4"], title: "Plan & build", detail: "Tokens re-mapped for dark; components untouched.", ms: 240000 },
      { node: "design", edges: ["w7"], title: "On-brand", detail: "Palette checked against the design system.", ms: 2000 },
      { node: "repo", edges: ["w6", "w9"], title: "Verified & committed", detail: "Type-check, lint, light/dark screenshots.", ms: 60000 },
      { node: "ship", edges: ["w10"], title: "Deployed", detail: "vps skill: build, health-check, switch, keep rollback.", ms: 90000 },
      { node: "me", title: "Reviewed", detail: "I review the diff and the live page.", ms: 120000 },
    ],
  },
  decisions: [
    {
      title: "Skills over ad-hoc prompts",
      why: "A procedure I trust (like a deploy) should run the same way every time. Encoding it as a skill makes it reviewable and versioned.",
    },
    {
      title: "The wiki holds the main version, not the chat",
      why: "Chats are temporary; decisions are not. Keeping specs in markdown means any agent or human starts from the same truth.",
    },
    {
      title: "AI speeds up delivery; I own the architecture",
      why: "The agent is fast at implementation. Boundaries, data models and trade-offs stay my responsibility, and that’s what this portfolio is about.",
    },
  ],
};
