import Image from "next/image";
import { ImagePlus, Sparkles } from "lucide-react";
import type { Project } from "@/lib/types";

/** The "Product" tab: the brand and UI that sit on top of the architecture. */
export function BrandPanel({ project }: { project: Project }) {
  const brand = project.brand;
  if (!brand) return null;

  return (
    <div className="space-y-6">
      {project.builtBy && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-ink p-3.5 text-paper">
          <Sparkles className="mt-0.5 size-4 shrink-0" />
          <p className="text-[13px] leading-snug">{project.builtBy}</p>
        </div>
      )}

      {brand.logo && (
        <div className="dot-grid grid place-items-center rounded-2xl border border-line py-8">
          <Image src={brand.logo} alt={`${project.name} logo`} width={88} height={88} unoptimized className="rounded-[22px] shadow-[var(--shadow-lift)]" />
          <div className="mt-3 font-display text-xl">{project.name}</div>
        </div>
      )}

      {brand.colors?.length ? (
        <div>
          <h2 className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Palette</h2>
          <div className="grid grid-cols-4 gap-2">
            {brand.colors.map((c) => (
              <div key={c.hex}>
                <div className="aspect-square rounded-xl border border-line" style={{ background: c.hex }} />
                <div className="mt-1.5 truncate text-[11px] font-medium">{c.name}</div>
                <div className="font-mono text-[10px] text-ink-faint">{c.hex}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(brand.typeface || brand.tone) && (
        <div className="grid gap-2">
          {brand.typeface && (
            <div className="flex items-baseline justify-between rounded-2xl border border-line p-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Type</span>
              <span className="font-display text-lg">{brand.typeface}</span>
            </div>
          )}
          {brand.tone && (
            <div className="rounded-2xl border border-line p-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Tone</span>
              <p className="mt-1 text-ink-soft">{brand.tone}</p>
            </div>
          )}
        </div>
      )}

      {brand.screenshots?.length ? (
        <div>
          <h2 className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-faint">Interface</h2>
          <div className="space-y-3">
            {brand.screenshots.map((s) => (
              <figure key={s.caption}>
                {s.src ? (
                  <Image src={s.src} alt={s.caption} width={640} height={400} className="w-full rounded-2xl border border-line" />
                ) : (
                  <div className="grid aspect-[16/10] place-items-center rounded-2xl border border-dashed border-line bg-paper text-ink-faint">
                    <span className="flex items-center gap-2 text-xs"><ImagePlus className="size-4" /> Add screenshot</span>
                  </div>
                )}
                <figcaption className="mt-1.5 text-xs text-ink-faint">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
