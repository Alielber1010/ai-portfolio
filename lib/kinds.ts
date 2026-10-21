import {
  Bot,
  Box,
  Cpu,
  Database,
  FileOutput,
  MessageSquare,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { NodeKind } from "./types";

type KindStyle = {
  label: string;
  icon: LucideIcon;
  bg: string;
  ink: string;
  /** theme-aware CSS color for SVG thumbnails / edges */
  stroke: string;
  fill: string;
};

export const KINDS: Record<NodeKind, KindStyle> = {
  input: { label: "Input", icon: MessageSquare, bg: "bg-butter", ink: "text-butter-ink", stroke: "var(--butter-ink)", fill: "var(--butter)" },
  agent: { label: "Agent", icon: Bot, bg: "bg-lavender", ink: "text-lavender-ink", stroke: "var(--lavender-ink)", fill: "var(--lavender)" },
  model: { label: "Model", icon: Cpu, bg: "bg-sky", ink: "text-sky-ink", stroke: "var(--sky-ink)", fill: "var(--sky)" },
  tool: { label: "Tool", icon: Wrench, bg: "bg-peach", ink: "text-peach-ink", stroke: "var(--peach-ink)", fill: "var(--peach)" },
  memory: { label: "Memory", icon: Database, bg: "bg-mint", ink: "text-mint-ink", stroke: "var(--mint-ink)", fill: "var(--mint)" },
  service: { label: "Service", icon: Server, bg: "bg-rose", ink: "text-rose-ink", stroke: "var(--rose-ink)", fill: "var(--rose)" },
  data: { label: "Data", icon: Box, bg: "bg-mint", ink: "text-mint-ink", stroke: "var(--mint-ink)", fill: "var(--mint)" },
  output: { label: "Output", icon: FileOutput, bg: "bg-butter", ink: "text-butter-ink", stroke: "var(--butter-ink)", fill: "var(--butter)" },
};

export const ACCENTS = {
  lavender: { bg: "bg-lavender", ink: "text-lavender-ink", color: "var(--lavender-ink)" },
  mint: { bg: "bg-mint", ink: "text-mint-ink", color: "var(--mint-ink)" },
  sky: { bg: "bg-sky", ink: "text-sky-ink", color: "var(--sky-ink)" },
  peach: { bg: "bg-peach", ink: "text-peach-ink", color: "var(--peach-ink)" },
} as const;
