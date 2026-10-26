export type NodeKind =
  | "input"
  | "agent"
  | "model"
  | "tool"
  | "memory"
  | "service"
  | "data"
  | "output";

export type Side = "top" | "right" | "bottom" | "left";

export type SystemNode = {
  id: string;
  label: string;
  kind: NodeKind;
  x: number;
  y: number;
  /** e.g. "claude-sonnet", "bge-reranker" */
  tech?: string;
  /** One plain-English sentence — written for a recruiter. */
  summary: string;
  /** What it actually does — written for an engineer. */
  responsibilities?: string[];
  io?: { in: string; out: string };
  code?: { lang: string; snippet: string };
};

export type SystemEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
  /** control = orchestration / calls, data = payload flow */
  kind?: "control" | "data";
  fromSide?: Side;
  toSide?: Side;
};

export type TraceStep = {
  node: string;
  /** edges lit up when this step runs */
  edges?: string[];
  title: string;
  detail: string;
  ms: number;
};

export type Brand = {
  /** Path under /public, e.g. "/projects/aegis/logo.svg" */
  logo?: string;
  colors?: { name: string; hex: string }[];
  typeface?: string;
  /** One line on the product's tone of voice / visual direction */
  tone?: string;
  /** Paths under /public. Empty slots render as "add screenshot" frames. */
  screenshots?: { src?: string; caption: string }[];
  /** A vertical sample video the product made. Paths under /public. */
  reel?: { src: string; poster?: string; caption: string };
};

export type Decision ={ title: string; why: string; tradeoff?: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  accent: "lavender" | "mint" | "sky" | "peach";
  status: "production" | "pilot" | "research" | "building";
  year: string;
  /** Recruiter-friendly: what problem, for whom, what result. */
  summary: string;
  outcomes: string[];
  stack: string[];
  /** Repo URL. Leave undefined to show “Private repo”. */
  github?: string;
  /** Live demo / video URL. Leave undefined to show “Demo on request”. */
  demo?: string;
  /** Who did what — e.g. "Solo: product, design, architecture, code". */
  builtBy?: string;
  brand?: Brand;
  nodes: SystemNode[];
  edges: SystemEdge[];
  trace: { prompt: string; steps: TraceStep[] };
  decisions: Decision[];
};
