import type { ReactNode } from "react";

/** Renders the small Markdown subset used in lib/articles.ts. */
export function ArticleBody({ source }: { source: string }) {
  const blocks = parse(source);
  return <div className="flex flex-col gap-5">{blocks}</div>;
}

function parse(src: string): ReactNode[] {
  const lines = src.trim().split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(
        <h2 key={i} className="mt-6 font-display text-2xl sm:text-3xl">
          {inline(line.slice(3))}
        </h2>,
      );
      i++;
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|[\s|:-]+\|$/.test(lines[i].trim())) rows.push(cells(lines[i]));
        i++;
      }
      const [head, ...body] = rows;
      out.push(
        <div key={i} className="overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {head.map((c, k) => (
                  <th key={k} className="border-b border-line px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                    {inline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child_td]:border-b-0">
              {body.map((r, k) => (
                <tr key={k} className={r.some((c) => c.startsWith("**")) ? "bg-lavender/60" : undefined}>
                  {r.map((c, j) => (
                    <td key={j} className="border-b border-line px-4 py-3 align-top">
                      {inline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const ordered = /^\d+\. /.test(line);
    if (ordered || line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : lines[i].startsWith("- "))) {
        items.push(lines[i].replace(/^(\d+\. |- )/, ""));
        i++;
      }
      const cls = `flex flex-col gap-1.5 pl-6 text-ink-soft ${ordered ? "list-decimal" : "list-disc"}`;
      const lis = items.map((t, k) => <li key={k}>{inline(t)}</li>);
      out.push(ordered ? <ol key={i} className={cls}>{lis}</ol> : <ul key={i} className={cls}>{lis}</ul>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(## |\||- |\d+\. )/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      <p key={i} className="text-ink-soft">
        {inline(para.join(" "))}
      </p>,
    );
  }
  return out;
}

function cells(row: string) {
  return row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
}

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const k = m.index;
    if (m[1]) parts.push(<strong key={k} className="font-semibold text-ink">{m[1]}</strong>);
    else if (m[2]) parts.push(<code key={k} className="rounded bg-paper px-1.5 py-0.5 font-mono text-[0.85em] text-ink">{m[2]}</code>);
    else
      parts.push(
        <a key={k} href={m[4]} target="_blank" rel="noreferrer" className="font-medium text-lavender-ink underline underline-offset-4">
          {m[3]}
        </a>,
      );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
