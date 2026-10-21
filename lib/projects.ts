import type { Project } from "./types";
import { workflow } from "./workflow";

/*
 * ─────────────────────────────────────────────────────────────
 *  YOUR PROJECTS
 *  Every project is a graph: nodes (components) + edges (connections),
 *  a trace (one request walking through the graph) and decisions.
 *  x / y are canvas coordinates — nodes are ~220px wide, ~80px tall.
 *
 *  The content below is a realistic STARTING POINT. Replace the
 *  summaries, outcomes and numbers with your real ones before shipping.
 * ─────────────────────────────────────────────────────────────
 */

export const projects: Project[] = [
  {
    slug: "aegis",
    builtBy: "Solo: product, brand, architecture and code",
    // TODO: replace logo, palette and screenshots with the real product assets
    brand: {
      logo: "/projects/aegis/logo.svg",
      colors: [{ name: "Aegis Violet", hex: "#6247E0" }, { name: "Ink", hex: "#1D1E29" }, { name: "Mist", hex: "#EBE6FF" }, { name: "Signal", hex: "#19845A" }],
      typeface: "Geist",
      tone: "Shield-like mark; calm, trustworthy research tool.",
      screenshots: [{ caption: "Main screen" }, { caption: "Detail view" }, { caption: "Mobile" }],
    },
    name: "Aegis",
    tagline: "A team of AI agents that plans, researches and checks its own work.",
    category: "Agentic Intelligence",
    accent: "lavender",
    status: "production",
    year: "2026",
    github: "https://github.com/Alielber1010", // TODO: point at this project’s repo
    demo: undefined, // TODO: live demo or video URL
    summary:
      "Aegis takes an open-ended business question and splits it across specialised AI agents — a planner, a researcher, an analyst and a critic — then returns a sourced, reviewed report. It replaces hours of manual desk research with a few minutes of supervised automation.",
    outcomes: [
      "Research reports in minutes instead of hours",
      "Every claim is linked back to a source",
      "A critic agent rejects weak answers before a human sees them",
    ],
    stack: ["LangGraph", "Claude", "FastAPI", "pgvector", "Docker", "Redis"],
    nodes: [
      {
        id: "req", label: "User Request", kind: "input", x: 0, y: 180,
        summary: "A question in plain language, e.g. “Size the EU market for heat pumps.”",
        io: { in: "Natural-language question", out: "Task envelope (JSON)" },
      },
      {
        id: "api", label: "Orchestrator API", kind: "service", x: 290, y: 180, tech: "FastAPI · Redis",
        summary: "Receives the request, starts a run and streams progress back to the UI.",
        responsibilities: [
          "Creates a durable run with an id and budget (tokens, wall-clock)",
          "Streams agent events over SSE",
          "Persists checkpoints so a crashed run can resume",
        ],
        io: { in: "HTTP POST /runs", out: "Run state + event stream" },
      },
      {
        id: "planner", label: "Planner", kind: "agent", x: 580, y: 180, tech: "claude-sonnet",
        summary: "Breaks the question into a step-by-step plan and hands each step to the right agent.",
        responsibilities: [
          "Decomposes the goal into a DAG of sub-tasks",
          "Routes sub-tasks to Researcher or Analyst",
          "Re-plans when the Critic rejects a result",
        ],
        io: { in: "Task envelope + memory", out: "Plan (ordered sub-tasks)" },
        code: {
          lang: "python",
          snippet: `graph = StateGraph(RunState)
graph.add_node("planner", plan)
graph.add_node("research", research)
graph.add_node("analyse", analyse)
graph.add_node("critic", critique)
graph.add_conditional_edges("critic", verdict,
    {"approve": END, "revise": "planner"})`,
        },
      },
      {
        id: "research", label: "Researcher", kind: "agent", x: 900, y: 10, tech: "claude-haiku",
        summary: "Searches the web and internal docs, and collects evidence with citations.",
        responsibilities: ["Issues parallel search queries", "Extracts quotes + URLs", "Deduplicates sources"],
        io: { in: "Research sub-task", out: "Evidence[] with citations" },
      },
      {
        id: "analyst", label: "Analyst", kind: "agent", x: 900, y: 180, tech: "claude-sonnet",
        summary: "Turns raw evidence into numbers, tables and charts by writing and running code.",
        responsibilities: ["Writes Python for calculations", "Runs it in a sandbox", "Explains every figure"],
        io: { in: "Evidence + analysis sub-task", out: "Findings + tables" },
      },
      {
        id: "critic", label: "Critic", kind: "agent", x: 900, y: 350, tech: "claude-sonnet",
        summary: "Reviews the draft like a strict editor — unsupported claims are sent back.",
        responsibilities: ["Checks each claim has a citation", "Scores coverage of the plan", "Approves or requests a revision"],
        io: { in: "Draft report", out: "approve | revise + reasons" },
        code: {
          lang: "python",
          snippet: `class Verdict(BaseModel):
    decision: Literal["approve", "revise"]
    unsupported_claims: list[str]
    coverage: float  # 0..1

verdict = llm.with_structured_output(Verdict)`,
        },
      },
      {
        id: "search", label: "Web Search", kind: "tool", x: 1210, y: -60, tech: "Tavily API",
        summary: "A search tool the Researcher can call.",
        io: { in: "query", out: "results[]" },
      },
      {
        id: "sandbox", label: "Code Sandbox", kind: "tool", x: 1210, y: 120, tech: "Docker · gVisor",
        summary: "An isolated container where the Analyst’s code runs safely.",
        io: { in: "python source", out: "stdout + artifacts" },
      },
      {
        id: "memory", label: "Long-term Memory", kind: "memory", x: 580, y: 400, tech: "pgvector",
        summary: "Remembers past runs so similar questions start from what was already learned.",
        io: { in: "Run summaries", out: "Relevant past findings" },
      },
      {
        id: "out", label: "Sourced Report", kind: "output", x: 1210, y: 350,
        summary: "The final, reviewed report with every claim linked to a source.",
      },
    ],
    edges: [
      { id: "e1", from: "req", to: "api" },
      { id: "e2", from: "api", to: "planner", label: "start run" },
      { id: "e3", from: "planner", to: "research", kind: "control" },
      { id: "e4", from: "planner", to: "analyst", kind: "control" },
      { id: "e5", from: "research", to: "search", label: "query" },
      { id: "e6", from: "analyst", to: "sandbox", label: "run code" },
      { id: "e7", from: "research", to: "analyst", fromSide: "bottom", toSide: "top", kind: "data", label: "evidence" },
      { id: "e8", from: "analyst", to: "critic", fromSide: "bottom", toSide: "top", kind: "data", label: "draft" },
      { id: "e9", from: "critic", to: "out", label: "approve" },
      { id: "e10", from: "critic", to: "planner", fromSide: "left", toSide: "bottom", kind: "control", label: "revise" },
      { id: "e11", from: "memory", to: "planner", fromSide: "top", toSide: "bottom", kind: "data" },
    ],
    trace: {
      prompt: "Estimate the EU market size for residential heat pumps in 2027.",
      steps: [
        { node: "req", title: "Request received", detail: "Question parsed into a task envelope with a 40k-token budget.", ms: 12 },
        { node: "api", edges: ["e1"], title: "Run created", detail: "run_8f2c started, checkpointing enabled, SSE stream opened.", ms: 35 },
        { node: "memory", edges: ["e11"], title: "Memory recall", detail: "2 related past runs found (EU energy policy, HVAC pricing).", ms: 140 },
        { node: "planner", edges: ["e2", "e11"], title: "Plan drafted", detail: "4 sub-tasks: install base, growth rate, pricing, policy drivers.", ms: 2100 },
        { node: "research", edges: ["e3", "e5"], title: "Evidence gathered", detail: "11 queries → 23 sources → 9 kept after dedupe.", ms: 8400 },
        { node: "analyst", edges: ["e7", "e4", "e6"], title: "Numbers computed", detail: "Sandbox ran a 3-scenario model; produced 2 tables.", ms: 6200 },
        { node: "critic", edges: ["e8"], title: "Review", detail: "1 unsupported claim found → revise. Second pass approved.", ms: 3100 },
        { node: "out", edges: ["e9"], title: "Report delivered", detail: "1,400 words, 9 citations, 2 tables.", ms: 40 },
      ],
    },
    decisions: [
      {
        title: "A graph of agents, not one big prompt",
        why: "Separate agents can use cheaper models for simple work and stronger ones for judgment, and each step is testable on its own.",
        tradeoff: "More moving parts — solved with typed state and checkpointing.",
      },
      {
        title: "A dedicated Critic with structured output",
        why: "Self-review inside the same prompt rarely catches errors. A separate reviewer with a strict schema made rejections measurable.",
      },
      {
        title: "Durable runs with checkpoints",
        why: "Long research runs fail mid-way (rate limits, timeouts). Checkpoints let a run resume instead of restarting and re-spending tokens.",
      },
    ],
  },

  {
    slug: "construction-ai",
    builtBy: "Solo: product, brand, architecture and code",
    // TODO: replace logo, palette and screenshots with the real product assets
    brand: {
      logo: "/projects/construction-ai/logo.svg",
      colors: [{ name: "Safety Orange", hex: "#E8641B" }, { name: "Concrete", hex: "#3B3F46" }, { name: "Sand", hex: "#F4E9DC" }, { name: "Steel", hex: "#7C8896" }],
      typeface: "Inter Tight",
      tone: "Sturdy, practical, site-ready: big type, high contrast.",
      screenshots: [{ caption: "Main screen" }, { caption: "Detail view" }, { caption: "Mobile" }],
    },
    name: "Construction AI",
    tagline: "Reads construction documents and turns them into clean, checked data.",
    category: "Document Automation",
    accent: "peach",
    status: "pilot",
    year: "2025",
    github: "https://github.com/Alielber1010", // TODO: point at this project’s repo
    demo: undefined, // TODO: live demo or video URL
    summary:
      "Construction firms receive thousands of invoices, delivery notes and change orders as scanned PDFs. This system reads them, pulls out the important fields, checks them against project rules, and only asks a human when something looks wrong.",
    outcomes: [
      "Manual data entry reduced to exception handling",
      "Every extracted field carries a confidence score",
      "Rule violations are flagged before they reach accounting",
    ],
    stack: ["Python", "Azure Document Intelligence", "GPT-4o", "Pydantic", "PostgreSQL", "Celery"],
    nodes: [
      {
        id: "upload", label: "Document Upload", kind: "input", x: 0, y: 160,
        summary: "Scanned PDFs, photos and emails arrive from site managers and suppliers.",
        io: { in: "PDF / JPG / email", out: "Stored file + job id" },
      },
      {
        id: "ocr", label: "OCR & Layout", kind: "service", x: 290, y: 160, tech: "Document Intelligence",
        summary: "Converts each page into text while keeping tables and positions intact.",
        io: { in: "File", out: "Text + tables + bounding boxes" },
      },
      {
        id: "classify", label: "Classifier", kind: "agent", x: 580, y: 160, tech: "gpt-4o-mini",
        summary: "Decides what kind of document it is — invoice, delivery note, change order…",
        io: { in: "Layout text", out: "doc_type + confidence" },
      },
      {
        id: "extract", label: "Extractor", kind: "agent", x: 870, y: 160, tech: "gpt-4o",
        summary: "Pulls out the fields that matter for that document type.",
        responsibilities: ["One Pydantic schema per document type", "Returns the source region for every field", "Retries with a narrower prompt on schema failure"],
        io: { in: "Layout text + doc_type", out: "Typed record" },
        code: {
          lang: "python",
          snippet: `class Invoice(BaseModel):
    supplier: str
    invoice_no: str
    project_code: str
    lines: list[LineItem]
    total: Decimal
    evidence: dict[str, BBox]  # where each field came from`,
        },
      },
      {
        id: "validate", label: "Validator", kind: "agent", x: 1160, y: 160, tech: "rules + LLM",
        summary: "Checks the numbers add up and match the project budget and purchase orders.",
        responsibilities: ["Deterministic checks first (totals, VAT, dates)", "LLM only for fuzzy matching (supplier names)", "Produces a list of explained issues"],
        io: { in: "Typed record", out: "pass | issues[]" },
      },
      {
        id: "rules", label: "Project Rules & POs", kind: "data", x: 1160, y: 360, tech: "PostgreSQL",
        summary: "Budgets, purchase orders and approved suppliers for every project.",
      },
      {
        id: "review", label: "Human Review", kind: "service", x: 1450, y: 20,
        summary: "A simple screen where someone fixes only the flagged fields.",
        io: { in: "Record + highlighted issues", out: "Corrected record" },
      },
      {
        id: "erp", label: "ERP Export", kind: "output", x: 1450, y: 260,
        summary: "Clean data is pushed into the accounting system automatically.",
      },
    ],
    edges: [
      { id: "c1", from: "upload", to: "ocr" },
      { id: "c2", from: "ocr", to: "classify", kind: "data" },
      { id: "c3", from: "classify", to: "extract", label: "doc_type" },
      { id: "c4", from: "extract", to: "validate", kind: "data", label: "record" },
      { id: "c5", from: "rules", to: "validate", fromSide: "top", toSide: "bottom", kind: "data" },
      { id: "c6", from: "validate", to: "review", label: "issues" },
      { id: "c7", from: "validate", to: "erp", label: "pass" },
      { id: "c8", from: "review", to: "erp", fromSide: "bottom", toSide: "top", label: "fixed" },
    ],
    trace: {
      prompt: "Supplier invoice INV-20931 (3 pages, scanned).",
      steps: [
        { node: "upload", title: "Received", detail: "3-page scan uploaded from site tablet.", ms: 20 },
        { node: "ocr", edges: ["c1"], title: "Layout parsed", detail: "2 tables, 41 lines detected.", ms: 2300 },
        { node: "classify", edges: ["c2"], title: "Classified", detail: "invoice (0.98).", ms: 600 },
        { node: "extract", edges: ["c3"], title: "Fields extracted", detail: "14 fields + 22 line items, all schema-valid.", ms: 4100 },
        { node: "validate", edges: ["c4", "c5"], title: "Validated", detail: "Line total ≠ PO amount on item 7 → 1 issue.", ms: 380 },
        { node: "review", edges: ["c6"], title: "Human fix", detail: "Reviewer corrected quantity on line 7.", ms: 45000 },
        { node: "erp", edges: ["c8"], title: "Exported", detail: "Posted to ERP with audit trail.", ms: 210 },
      ],
    },
    decisions: [
      {
        title: "Rules before LLMs in validation",
        why: "Arithmetic and date checks are cheaper and 100% reliable in code. The LLM is only used where judgment is needed.",
      },
      {
        title: "Field-level evidence",
        why: "Storing the page region for every field lets reviewers verify in one glance — this is what made people trust the system.",
      },
      {
        title: "Human-in-the-loop on exceptions only",
        why: "Reviewing everything defeats the purpose; reviewing nothing is risky. Routing only flagged documents kept both speed and safety.",
      },
    ],
  },

  {
    slug: "hybrid-rag",
    builtBy: "Solo: product, brand, architecture and code",
    // TODO: replace logo, palette and screenshots with the real product assets
    brand: {
      logo: "/projects/hybrid-rag/logo.svg",
      colors: [{ name: "Leaf", hex: "#19845A" }, { name: "Paper", hex: "#FAFAF7" }, { name: "Graphite", hex: "#2B2D35" }, { name: "Mint", hex: "#DCF5E9" }],
      typeface: "Geist",
      tone: "Quiet and trustworthy: answers first, sources always visible.",
      screenshots: [{ caption: "Main screen" }, { caption: "Detail view" }, { caption: "Mobile" }],
    },
    name: "Hybrid RAG",
    tagline: "Answers questions from company documents — with sources you can check.",
    category: "Retrieval Systems",
    accent: "mint",
    status: "production",
    year: "2025",
    github: "https://github.com/Alielber1010", // TODO: point at this project’s repo
    demo: undefined, // TODO: live demo or video URL
    summary:
      "A question-answering assistant over internal knowledge. It combines keyword and semantic search, re-ranks the results and only answers from what it found — every sentence comes with a citation, and it says “I don’t know” instead of guessing.",
    outcomes: [
      "Keyword + semantic search beats either alone",
      "Answers cite the exact passage they came from",
      "Evaluated continuously on a golden question set",
    ],
    stack: ["Python", "pgvector", "BM25", "Cohere Rerank", "Claude", "Ragas"],
    nodes: [
      {
        id: "docs", label: "Source Documents", kind: "data", x: 0, y: 380,
        summary: "PDFs, wikis and tickets — the company’s knowledge.",
      },
      {
        id: "ingest", label: "Chunk & Embed", kind: "service", x: 290, y: 380, tech: "bge-m3",
        summary: "Splits documents into passages and turns them into searchable vectors.",
        responsibilities: ["Structure-aware chunking (headings, tables)", "Adds title + section to each chunk", "Incremental re-indexing on change"],
      },
      {
        id: "q", label: "User Question", kind: "input", x: 0, y: 120,
        summary: "“What is our refund policy for enterprise customers?”",
      },
      {
        id: "rewrite", label: "Query Rewriter", kind: "agent", x: 290, y: 120, tech: "claude-haiku",
        summary: "Rewrites the question into better search queries.",
        io: { in: "Question + chat history", out: "2–4 search queries" },
      },
      {
        id: "bm25", label: "Keyword Index", kind: "memory", x: 600, y: 20, tech: "BM25",
        summary: "Finds passages that share exact words — great for names and codes.",
      },
      {
        id: "vec", label: "Vector Index", kind: "memory", x: 600, y: 240, tech: "pgvector · HNSW",
        summary: "Finds passages that mean the same thing, even with different wording.",
      },
      {
        id: "fuse", label: "Fusion + Rerank", kind: "model", x: 900, y: 120, tech: "RRF · cohere-rerank",
        summary: "Merges both result lists and keeps only the most relevant passages.",
        code: {
          lang: "python",
          snippet: `def rrf(results: list[list[Doc]], k=60):
    scores = defaultdict(float)
    for ranked in results:
        for rank, doc in enumerate(ranked):
            scores[doc.id] += 1 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)`,
        },
      },
      {
        id: "gen", label: "Answer Generator", kind: "agent", x: 1200, y: 120, tech: "claude-sonnet",
        summary: "Writes the answer using only the retrieved passages.",
        responsibilities: ["Cites a passage id for every sentence", "Abstains when evidence is missing"],
      },
      {
        id: "cite", label: "Citation Check", kind: "tool", x: 1200, y: 330,
        summary: "Verifies each citation actually supports its sentence.",
      },
      {
        id: "ans", label: "Cited Answer", kind: "output", x: 1500, y: 120,
        summary: "The answer, with clickable sources.",
      },
    ],
    edges: [
      { id: "r1", from: "docs", to: "ingest" },
      { id: "r2", from: "ingest", to: "vec", kind: "data" },
      { id: "r3", from: "ingest", to: "bm25", kind: "data", fromSide: "top", toSide: "left" },
      { id: "r4", from: "q", to: "rewrite" },
      { id: "r5", from: "rewrite", to: "bm25", label: "keywords" },
      { id: "r6", from: "rewrite", to: "vec", label: "embedding" },
      { id: "r7", from: "bm25", to: "fuse", kind: "data" },
      { id: "r8", from: "vec", to: "fuse", kind: "data" },
      { id: "r9", from: "fuse", to: "gen", label: "top-8" },
      { id: "r10", from: "gen", to: "cite", fromSide: "bottom", toSide: "top" },
      { id: "r11", from: "gen", to: "ans" },
    ],
    trace: {
      prompt: "What is our refund policy for enterprise customers?",
      steps: [
        { node: "q", title: "Question in", detail: "Short question, no chat history.", ms: 5 },
        { node: "rewrite", edges: ["r4"], title: "Rewritten", detail: "3 queries incl. “enterprise refund SLA”.", ms: 420 },
        { node: "bm25", edges: ["r5"], title: "Keyword search", detail: "20 hits.", ms: 30 },
        { node: "vec", edges: ["r6"], title: "Semantic search", detail: "20 hits, 11 overlap with keyword results.", ms: 45 },
        { node: "fuse", edges: ["r7", "r8"], title: "Fused & reranked", detail: "29 candidates → top 8 passages.", ms: 260 },
        { node: "gen", edges: ["r9"], title: "Answer drafted", detail: "4 sentences, 4 citations.", ms: 1900 },
        { node: "cite", edges: ["r10"], title: "Citations verified", detail: "4/4 supported.", ms: 600 },
        { node: "ans", edges: ["r11"], title: "Answered", detail: "Delivered with links to 2 policy docs.", ms: 10 },
      ],
    },
    decisions: [
      {
        title: "Hybrid retrieval over pure vectors",
        why: "Embeddings miss exact identifiers (SKUs, contract numbers). BM25 catches them; fusion keeps the best of both.",
      },
      {
        title: "Abstain instead of guess",
        why: "A confident wrong answer costs more trust than “I couldn’t find that”. The generator is instructed and evaluated on abstention.",
      },
      {
        title: "Evaluation as a first-class component",
        why: "A golden set of real questions runs on every change, so retrieval tweaks are measured, not guessed.",
      },
    ],
  },

  {
    slug: "mcp-integrations",
    builtBy: "Solo: product, brand, architecture and code",
    // TODO: replace logo, palette and screenshots with the real product assets
    brand: {
      logo: "/projects/mcp-integrations/logo.svg",
      colors: [{ name: "Circuit Blue", hex: "#2470BD" }, { name: "Night", hex: "#121826" }, { name: "Sky", hex: "#DDEEFC" }, { name: "Amber", hex: "#E2A23B" }],
      typeface: "JetBrains Mono",
      tone: "Technical but friendly: a developer tool that feels safe.",
      screenshots: [{ caption: "Main screen" }, { caption: "Detail view" }, { caption: "Mobile" }],
    },
    name: "MCP Integrations",
    tagline: "Gives AI assistants safe, audited access to real company tools.",
    category: "Tools & APIs",
    accent: "sky",
    status: "production",
    year: "2026",
    github: "https://github.com/Alielber1010", // TODO: point at this project’s repo
    demo: undefined, // TODO: live demo or video URL
    summary:
      "A set of Model Context Protocol servers that let AI assistants work with GitHub, the company database and internal docs — with per-user permissions, read-only defaults and a full audit log of every action an AI takes.",
    outcomes: [
      "One protocol, many assistants (Claude, IDEs, internal bots)",
      "Every tool call is permission-checked and logged",
      "New tools ship in under a day",
    ],
    stack: ["TypeScript", "MCP SDK", "OAuth 2.1", "PostgreSQL", "GitHub API", "Docker"],
    nodes: [
      {
        id: "client", label: "AI Assistant", kind: "agent", x: 0, y: 180, tech: "Claude / IDE",
        summary: "Any MCP-compatible assistant that wants to use a tool.",
      },
      {
        id: "gw", label: "MCP Gateway", kind: "service", x: 300, y: 180, tech: "Streamable HTTP",
        summary: "One front door: discovers tools, routes calls, enforces limits.",
        responsibilities: ["Tool discovery & schema versioning", "Rate limiting per user", "Streams results back"],
        code: {
          lang: "ts",
          snippet: `server.registerTool("query_db", {
  description: "Run a read-only SQL query",
  inputSchema: { sql: z.string() },
}, async ({ sql }, ctx) => {
  await authorize(ctx.user, "db:read");
  return audit(ctx, () => db.readonly(sql));
});`,
        },
      },
      {
        id: "auth", label: "Auth & Policy", kind: "service", x: 300, y: 400, tech: "OAuth 2.1",
        summary: "Checks who is asking and what they are allowed to do.",
      },
      {
        id: "gh", label: "GitHub Tools", kind: "tool", x: 640, y: 0,
        summary: "Read issues and PRs, open draft PRs.",
      },
      {
        id: "db", label: "Database Tools", kind: "tool", x: 640, y: 180,
        summary: "Read-only SQL with row limits and schema hints.",
      },
      {
        id: "kb", label: "Docs Tools", kind: "tool", x: 640, y: 360,
        summary: "Search and read internal documentation.",
      },
      {
        id: "audit", label: "Audit Log", kind: "data", x: 960, y: 180, tech: "PostgreSQL",
        summary: "A permanent record of every action an AI took, and for whom.",
      },
    ],
    edges: [
      { id: "m1", from: "client", to: "gw", label: "tools/call" },
      { id: "m2", from: "gw", to: "auth", fromSide: "bottom", toSide: "top", kind: "control" },
      { id: "m3", from: "gw", to: "gh" },
      { id: "m4", from: "gw", to: "db" },
      { id: "m5", from: "gw", to: "kb" },
      { id: "m6", from: "gh", to: "audit", kind: "data" },
      { id: "m7", from: "db", to: "audit", kind: "data" },
      { id: "m8", from: "kb", to: "audit", kind: "data" },
    ],
    trace: {
      prompt: "“How many enterprise signups did we get last week?”",
      steps: [
        { node: "client", title: "Tool chosen", detail: "Assistant picks query_db.", ms: 900 },
        { node: "gw", edges: ["m1"], title: "Call received", detail: "Schema-validated input.", ms: 8 },
        { node: "auth", edges: ["m2"], title: "Authorized", detail: "User has db:read on analytics schema.", ms: 15 },
        { node: "db", edges: ["m4"], title: "Query run", detail: "Read-only replica, 1 row returned.", ms: 120 },
        { node: "audit", edges: ["m7"], title: "Logged", detail: "Call, user, SQL and row count stored.", ms: 6 },
      ],
    },
    decisions: [
      {
        title: "A gateway instead of many direct servers",
        why: "Central auth, rate limits and audit — adding a new tool doesn’t mean re-implementing security.",
      },
      {
        title: "Read-only by default",
        why: "Write tools require an explicit scope and produce drafts (e.g. draft PRs) a human approves.",
      },
    ],
  },
];

export const getProject = (slug: string) => [...projects, workflow].find((p) => p.slug === slug);
