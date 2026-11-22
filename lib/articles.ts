// Articles: what I tested, how I did it and what I found.
// Body is a small Markdown subset: ## headings, paragraphs, - and 1. lists, | tables |, **bold**, `code`, [links](url).

export type Article = {
  slug: string;
  title: string;
  /** One or two sentences shown on the card and as the page description. */
  summary: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  /** Project this came out of, by slug in lib/projects.ts. */
  project?: string;
  /** Where else it is published. */
  medium?: string;
  /** Raw results people can open. */
  results?: { label: string; href: string }[];
  body: string;
};

export const articles: Article[] = [
  {
    slug: "pdf-parser-benchmark",
    title: "Docling vs Marker vs Unstructured vs PyMuPDF: Best Open-Source PDF Parser Benchmark (2026)",
    summary:
      "I tested 4 free PDF parsers on real construction drawings: tables, images and floor plans. Docling won. Then I made it faster and taught it to spot floor plans, with no paid API.",
    date: "2026-11-22",
    tags: ["PDF", "RAG", "Document AI", "Python"],
    project: "aegis",
    medium:
      "https://medium.com/@ali.melbermawy/docling-vs-marker-vs-unstructured-vs-pymupdf-best-open-source-pdf-parser-benchmark-2026-e0218bf99fca",
    results: [
      { label: "Parser comparison", href: "https://bench.ali-elber.space/parsers.html" },
      { label: "Floor plan results", href: "https://bench.ali-elber.space/floorplans.html" },
    ],
    body: `
I'm building a personal AI project that reads construction documents. The first step is parsing the PDFs. If the parser gets that wrong, everything after it is wrong too.

I needed a parser that finds four things:

- text
- tables
- images
- floor plans

Floor plans matter most.

So I tested four open-source libraries: PyMuPDF, Unstructured, Docling and Marker.

## The setup

I used public construction documents I found online. I picked 5 pages that cover every case.

| Document | Page | What it tests |
|---|---|---|
| San Miguel Fire Station, geotechnical report | 6 | Text, a figure, header and footer |
| | 31 | 2 bordered tables |
| | 38 | Boring log (looks like a table, hard) |
| Anchorage School District, CAD drawings | 11 | Floor plan with room labels |
| | 40 | Light-fixture schedule on a drawing |

Each parser ran in Docker, on CPU only, with 3 cores and 5 GB of RAM. No GPU.

| Parser | Settings |
|---|---|
| PyMuPDF | Text blocks + \`find_tables()\`. No AI. My baseline. |
| Unstructured | \`partition_pdf(strategy="hi_res", infer_table_structure=True)\` |
| Docling | Default settings: layout model, OCR, tables |
| Marker | Default settings, JSON output |

## The results

| Parser | Time (5 pages) | Tables (p31) | Floor plan (p11) | Images |
|---|---|---|---|---|
| PyMuPDF | 82 s | 2, with empty junk columns | Raw text only | Raw image blocks |
| **Docling** | **537 s** | **2, clean** | **1 picture + 22 room labels** | **Found and labelled** |
| Unstructured | 955 s | 2, OK | Some plans found, labels lost | Partial |
| Marker | 115 s | 1 | 11 fake tables | 0 |

You can check every page and every box yourself here:
[Open the parser comparison](https://bench.ali-elber.space/parsers.html)

## What I saw

**Marker** was a mess. It invented 11 tables on a floor plan and found zero images.

**Unstructured** was almost twice as slow as Docling. It caught some floor plans, but not all. It lost the room labels inside them.

**Docling** kept each floor plan as one picture. It kept the 22 room labels inside it, each with its own position. The tables came out clean.

Docling wins.

## Docling still has problems

| Problem | What happens |
|---|---|
| Slow | About 107 s per page on CPU |
| No floor plan type | Every floor plan comes back as "picture" |
| Boring log | Read as text, not as a table. No parser got it. |
| Fixture schedule | Found, but some columns shift |

So I tried to fix the two big ones: speed and floor plans.

## Fix 1: speed

I timed every Docling step on 14 drawing pages.

| Step | Time | Share |
|---|---|---|
| OCR | 762 s | 71% |
| Table structure | 111 s | 10% |
| Layout model | 82 s | 8% |
| Everything else | 121 s | 11% |
| **Total** | **1,076 s** | |

OCR takes 71% of the time. These are digital PDFs, so the text is already in the file. OCR reads it again from the image.

The fix: turn OCR off for digital PDFs (\`do_ocr=False\`). Keep it only for scanned ones.

## Fix 2: telling floor plans apart

I want every picture stored in the right place, as a floor plan, a drawing (section, elevation, detail), or an image (photo, logo, stamp). I also don't want any picture missed.

My rule: no paid API. Everything runs locally.

I tested three cheap add-ons against plain Docling, on 57 pictures from 14 pages:

1. **Classifier.** Docling's built-in picture classifier. It has 40 labels, but no "floor plan".
2. **Rules.** The classifier plus simple checks: the title near the picture ("FLOOR PLAN", "SECTION"), room names inside it, and its size on the page.
3. **Local VLM.** The rules plus a small vision model (SmolVLM-256M) for the pictures the rules aren't sure about.

| Method | Right type | Floor plans found | Wrong floor plans | Extra time |
|---|---|---|---|---|
| Plain Docling | 72% | 0 / 3 | 0 | 0 |
| 1. Classifier | 86% | 0 / 3 | 0 | ~0 |
| **2. Classifier + rules** | **95%** | **3 / 3** | **0** | **45 s** |
| 3. Rules + local VLM | 91% | 3 / 3 | 0 | 574 s |
| Local VLM alone | 51% | 0 / 3 | 9 | 8+ hours |

Full results with every picture:
[Open the floor plan results](https://bench.ali-elber.space/floorplans.html)

Classifier + rules won. The small vision model made things worse. It gave answers like "kim" and "101", and it was very slow on CPU.

Docling missed or merged 3 pictures:

| Page | What happened |
|---|---|
| Report cover | 4 photos came back as 1 picture |
| Drawing p40 | A small logo was not found |
| Drawing p23 | The plan title sits outside the picture, so it wasn't attached |

## What I'm going with

1. Docling as the parser.
2. OCR off for digital PDFs.
3. Classifier + rules to find floor plans.
4. Later: train my own small floor plan model.

## Limits

- It's a small test: 5 pages, then 57 pictures.
- I labelled the pictures myself.
- I tuned the rules on the same pages, so real numbers will be a bit lower.
- CPU only. A GPU changes the speed numbers a lot.
- No scanned PDFs yet. That's next.
`,
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
