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
    slug: "web-mamak",
    builtBy: "Solo: product, brand, architecture and code",
    brand: {
      logo: "/projects/web-mamak/logo.png",
      colors: [{ name: "Signboard Yellow", hex: "#FAC34F" }, { name: "Navy", hex: "#0D3050" }, { name: "Teh Tarik Orange", hex: "#D9591C" }, { name: "Cream", hex: "#F3EBD4" }],
      typeface: "Archivo",
      tone: "“Cheap. Fast. Open late.” Warm, local and casual, like the mamak stall it is named after.",
      screenshots: [
        { src: "/projects/web-mamak/hq-demos.png", caption: "Web Mamak HQ, the CRM: every demo with its package, cost, send status and one-click redeploy" },
        { src: "/projects/web-mamak/samples.png", caption: "Public samples page: demos built around each shop's own logo, colours and style" },
      ],
    },
    name: "Web Mamak",
    tagline: "An AI sales CRM that finds shops without a website and builds their demo before the first message.",
    category: "Agentic SaaS",
    accent: "peach",
    status: "production",
    year: "2026",
    github: undefined, // private repo
    demo: "https://webmamak.ali-elber.space/samples-f8280b/",
    summary:
      "Web Mamak is a CRM for selling websites to small businesses. It finds well-rated shops on Google Maps that have no website, researches each one, builds a demo website in the shop's own brand and writes a personal WhatsApp message, so the pitch opens with “here is your website” instead of a cold ask. It runs Web Mamak's own agency in Malaysia and is built as a white-label SaaS: each agency gets its own deployment under its own name, prices, languages and sales method. Egypt is next, as SITEKOM (sitekom.ali-elber.space).",
    outcomes: [
      "71 brand-accurate demos live, 69 sent, from one dashboard",
      "Every pitch shows the shop its own finished website, not a promise",
      "White-label: one codebase, one deployment per agency; Egypt (SITEKOM) is next",
    ],
    stack: ["Claude Code", "n8n", "Docker", "Cloudflare Pages", "Google Places API", "Node.js"],
    nodes: [
      {
        id: "hq", label: "Web Mamak HQ", kind: "input", x: 0, y: 180, tech: "CRM dashboard",
        summary: "The CRM: leads, demos, clients and workers on one screen, with one button per step.",
        responsibilities: [
          "Start research, Build demo, Send on WhatsApp",
          "Tracks each demo's package, cost, send status and files",
          "Switches workers on and off; shows Cloudflare capacity",
        ],
        io: { in: "Agency clicks", out: "Jobs + lead updates" },
      },
      {
        id: "profile", label: "Agency Profile", kind: "data", x: 0, y: 400, tech: "Settings wizard",
        summary: "Each agency's brand, countries, languages, prices and sales method — the white-label layer.",
        responsibilities: [
          "One profile per deployment of the same code",
          "Niches, lead criteria, offer and outreach are the agency's own",
          "Web Mamak's own method ships as the default",
        ],
        io: { in: "Agency settings", out: "Formula pack for each run" },
      },
      {
        id: "queue", label: "Job Queue & Lead Store", kind: "service", x: 300, y: 180, tech: "n8n",
        summary: "Holds jobs from HQ and the leads the agents find, with ready WhatsApp links.",
        io: { in: "Jobs from HQ, leads from agents", out: "Next job for a worker" },
      },
      {
        id: "runner", label: "Worker Runner", kind: "service", x: 600, y: 180, tech: "Docker · Claude Code",
        summary: "Picks up a job and runs the right AI agents. Keeps no files, so more workers can be added anywhere.",
        responsibilities: [
          "Polls the queue every 10 seconds",
          "Checks a client folder out of the hub with a lock",
          "Logs cost, tokens and timings for every run",
        ],
        io: { in: "Job + formula pack", out: "Agent runs + usage receipt" },
      },
      {
        id: "researcher", label: "Researcher", kind: "agent", x: 900, y: 0, tech: "Claude Code agent",
        summary: "Finds shops with good ratings and no website, then gathers one shop's logo, photos and colours.",
        responsibilities: [
          "Leads mode: 4.0★+, 20+ reviews, a phone number, no website",
          "Client mode: writes a brief and collects brand assets",
        ],
        io: { in: "Niche + area", out: "Qualified leads / shop brief" },
      },
      {
        id: "builder", label: "Demo Builder", kind: "agent", x: 900, y: 180, tech: "Claude Code agent",
        summary: "Builds the demo website in the shop's own look, at the chosen package: Basic, Business or Premium.",
        responsibilities: [
          "Static HTML for design, content.json for the shop's facts",
          "Languages the market needs (EN / BM / 中文, Arabic for Egypt)",
        ],
        io: { in: "Shop brief + assets", out: "Site files" },
      },
      {
        id: "copywriter", label: "Copywriter", kind: "agent", x: 900, y: 360, tech: "Claude Code agent",
        summary: "Writes a short, personal WhatsApp message for that shop, with its demo link.",
        io: { in: "Research notes + demo link", out: "Message (EN + BM)" },
      },
      {
        id: "places", label: "Google Places", kind: "tool", x: 1200, y: -60, tech: "Places API",
        summary: "Search and details for local businesses: rating, reviews, phone, website.",
        io: { in: "query", out: "places[]" },
      },
      {
        id: "hub", label: "Hub", kind: "service", x: 1200, y: 180, tech: "Files · Cloudflare deployer",
        summary: "Stores every client folder, lead and cost log, and is the only part that deploys sites.",
        responsibilities: [
          "Holds a pool of Cloudflare accounts and fills the next one when one is full",
          "Remembers which account each demo lives on",
        ],
        io: { in: "Site files", out: "Deployed demo" },
      },
      {
        id: "site", label: "Demo Website", kind: "output", x: 1500, y: 180, tech: "Cloudflare Pages",
        summary: "The shop's own website, live on a link, ready to show on their phone.",
      },
      {
        id: "wa", label: "WhatsApp", kind: "output", x: 1200, y: 400, tech: "tap-to-send",
        summary: "The message opens in WhatsApp, written and ready. A person always presses send.",
      },
    ],
    edges: [
      { id: "w1", from: "hq", to: "queue", label: "job" },
      { id: "w2", from: "queue", to: "runner", kind: "control", label: "polls" },
      { id: "w3", from: "profile", to: "runner", toSide: "bottom", kind: "data", label: "formula pack" },
      { id: "w4", from: "runner", to: "researcher", kind: "control" },
      { id: "w5", from: "researcher", to: "places", label: "search" },
      { id: "w6", from: "researcher", to: "builder", fromSide: "bottom", toSide: "top", kind: "data", label: "brief" },
      { id: "w7", from: "builder", to: "hub", label: "push files" },
      { id: "w8", from: "hub", to: "site", label: "deploy" },
      { id: "w9", from: "builder", to: "copywriter", fromSide: "bottom", toSide: "top", kind: "data", label: "demo link" },
      { id: "w10", from: "copywriter", to: "wa", label: "message" },
    ],
    trace: {
      prompt: "Build demo: a 4.3★ Padang restaurant in Kampung Baru with no website (Business package).",
      steps: [
        { node: "hq", title: "Build demo clicked", detail: "Lead picked in HQ, Business package chosen.", ms: 10 },
        { node: "queue", edges: ["w1"], title: "Job queued", detail: "Job stored with the lead and package.", ms: 40 },
        { node: "runner", edges: ["w2", "w3"], title: "Worker picks it up", detail: "Folder checked out of the hub; agency formula loaded.", ms: 10000 },
        { node: "researcher", edges: ["w4", "w5"], title: "Shop researched", detail: "Logo, photos, colours, menu highlights and reviews gathered into a brief.", ms: 180000 },
        { node: "builder", edges: ["w6"], title: "Demo built", detail: "Menu and location page in the shop's own colours, 14 files.", ms: 420000 },
        { node: "hub", edges: ["w7"], title: "Deployed", detail: "Pushed to the hub and deployed to a Cloudflare account with room.", ms: 30000 },
        { node: "site", edges: ["w8"], title: "Demo live", detail: "Link ready to open on the owner's phone.", ms: 10 },
        { node: "copywriter", edges: ["w9"], title: "Message written", detail: "Personal WhatsApp message with the demo link, EN + BM.", ms: 60000 },
        { node: "wa", edges: ["w10"], title: "Ready to send", detail: "Shown in HQ as “Not sent yet” until someone taps send.", ms: 10 },
      ],
    },
    decisions: [
      {
        title: "Show the website before asking for the sale",
        why: "Small shop owners don't buy a promise. Sending their own finished site turns a cold message into a yes or no on something they can see.",
        tradeoff: "Every lead costs an agent run — so quick demos stay cheap and full brand demos are kept for shops that reply.",
      },
      {
        title: "White-label by deployment, not by fork",
        why: "Each agency runs its own copy of the same code with its own profile, data, dashboard and worker. Egypt (SITEKOM) is the next deployment, in Arabic, with no code fork.",
        tradeoff: "More deployments to run — the target is one multi-tenant app with per-tenant data.",
      },
      {
        title: "The engine is ours, the sales method is the agency's",
        why: "Agencies keep their own niches, lead criteria, offer and outreach; agents follow that method. Web Mamak's own method is just the default.",
      },
      {
        title: "Workers keep nothing; the hub stores and deploys",
        why: "A worker is one command on any machine, and Cloudflare keys live in one place. The hub spreads demos across a pool of Cloudflare accounts.",
      },
    ],
  },

  {
    slug: "ventureos",
    builtBy: "Solo: product, brand, design system, architecture and code",
    brand: {
      logo: "/projects/ventureos/logo.svg",
      colors: [{ name: "Signal Amber", hex: "#FD880A" }, { name: "Obsidian", hex: "#111318" }, { name: "Sunny Cream", hex: "#FFF8EC" }, { name: "Pattern Teal", hex: "#14B8A6" }],
      typeface: "Nunito · Inter · JetBrains Mono",
      tone: "“Expose the pain. Quantify the demand.” A game for people with ideas, honest like an analyst. Two theme packs: Sunny (default) and Obsidian, unlocked in the game.",
      screenshots: [
        { src: "/projects/ventureos/landing.png", caption: "Landing page in the Sunny theme: play your idea before you build it" },
        { src: "/projects/ventureos/play-obsidian.png", caption: "The play screen shows one next move, here in the Obsidian theme unlocked at level 3" },
        { src: "/projects/ventureos/interviews.png", caption: "Field missions: the engine plans who to talk to and what to ask; every real chat is logged" },
        { src: "/projects/ventureos/findings.png", caption: "After the interviews, the engine proposes findings drawn only from real interview quotes" },
        { src: "/projects/ventureos/stats.png", caption: "Stats live on their own page: points, runs, people talked to, achievements" },
        { src: "/projects/ventureos/play-sunny.png", caption: "The same play screen in the Sunny theme" },
      ],
    },
    name: "VentureOS",
    tagline: "Tests a startup idea against real evidence, then sends you out to talk to real customers.",
    category: "Agentic SaaS",
    accent: "peach",
    status: "production",
    year: "2026",
    github: undefined, // private repo
    demo: "https://ventureos.ali-elber.space",
    summary:
      "VentureOS checks a startup idea or product feature before anyone builds it. You pitch the idea, answer a few sharp questions, and watch AI agents research it live on the web. They come back with a case file: a verdict (Destroy it, Rework it, Test it first or Build it), a score across 8 dimensions, every claim marked verified, contradicted or unverified with its sources, and competitors. Then it turns into a game of ten steps: the engine plans field missions, you go and interview real people, and it finds the pattern in their own words and rescores the idea. The method is written as agent skills, not app code, and every AI call is metered against a cost cap.",
    outcomes: [
      "Live at ventureos.ali-elber.space, with sign-up, plans and an admin console for usage, AI cost and margin",
      "Every number in a report carries a source URL or is marked unverified",
      "Quick scan costs about $0.40 in AI; every engine call has a dollar, search and time cap",
      "Case files in 5 languages, including Arabic (RTL); a venture exports and imports as a markdown tree",
    ],
    stack: ["Node.js", "Vanilla JS", "Claude Code CLI (headless)", "Claude Sonnet · Opus", "Agent skills (SKILL.md)", "Docker", "Cloudflare Tunnel"],
    nodes: [
      {
        id: "pitch", label: "Idea Pitch", kind: "input", x: 0, y: 180, tech: "Web app",
        summary: "A person states an idea or a feature, optionally with the cities and languages of their market.",
        io: { in: "Idea + market", out: "New case (VOS-0001)" },
      },
      {
        id: "server", label: "App Server", kind: "service", x: 290, y: 180, tech: "Node.js · zero dependencies",
        summary: "Accounts, plans and quotas, the game, and a live event stream to the browser.",
        responsibilities: [
          "Checks the plan quota before any engine work",
          "Streams the investigation as it runs, no refresh",
          "Derives points from stored evidence; points never change a verdict",
        ],
        io: { in: "HTTP + form answers", out: "Engine jobs, live updates" },
      },
      {
        id: "triage", label: "Triage Agent", kind: "agent", x: 580, y: 0, tech: "Claude Sonnet",
        summary: "Picks which methods fit this idea and asks the few questions that matter before research starts.",
        io: { in: "Pitch + method list", out: "Chosen methods + questions" },
      },
      {
        id: "skills", label: "Method Library", kind: "memory", x: 580, y: 380, tech: "SKILL.md files",
        summary: "How to judge an idea, written as agent skills: desk research, field validation and a local-market lens.",
        responsibilities: [
          "No scoring rules in app code; the domain knowledge lives here",
          "Analysts can add new methods in the app, in the same format",
          "Customers only ever see “the VentureOS method”",
        ],
      },
      {
        id: "engine", label: "Investigation Engine", kind: "agent", x: 880, y: 180, tech: "Claude Code CLI · Sonnet / Opus",
        summary: "Runs the chosen methods against live web evidence and writes the case file.",
        responsibilities: [
          "Quick scan on Sonnet, deep investigation on Opus",
          "Only WebSearch and WebFetch allowed",
          "Answers in one JSON report contract, checked and repaired if broken",
        ],
        io: { in: "Methods + pitch + answers", out: "Case file (JSON)" },
      },
      {
        id: "web", label: "Live Web", kind: "tool", x: 1180, y: 0, tech: "WebSearch · WebFetch",
        summary: "Forums, reviews, competitors' sites and social pages: where people already ask for help.",
        io: { in: "query / URL", out: "Evidence + source URLs" },
      },
      {
        id: "costs", label: "Cost Meter", kind: "service", x: 880, y: 400, tech: "Ledger · caps · budgets",
        summary: "Every AI call has a dollar, search and page-read cap, plus a daily budget per user and overall.",
        responsibilities: [
          "A capped run still writes a case file from what it found",
          "Feeds the admin console: AI cost against plan revenue",
        ],
      },
      {
        id: "case", label: "Case File", kind: "output", x: 1180, y: 180,
        summary: "Verdict, 8-dimension profile, checked claims, competitors, kill shots and the cheapest next test.",
      },
      {
        id: "venture", label: "Venture Board", kind: "data", x: 1480, y: 180, tech: "Blocks · jobs · markdown tree",
        summary: "A closed case becomes a venture: missions, interviews, decisions and report versions.",
        responsibilities: [
          "Exports and imports as a markdown folder, so the user can leave any time",
          "Private interview fields never reach the engine or the public showcase",
        ],
      },
      {
        id: "field", label: "Field Jobs", kind: "agent", x: 1480, y: 400, tech: "Claude Sonnet",
        summary: "Plans interview missions, finds the pattern in real interviews, and rescores the idea.",
        responsibilities: [
          "Synthesis recounts from real interview ids and keeps only verbatim quotes",
          "A rescore keeps every earlier source",
        ],
        io: { in: "Logged interviews", out: "Findings + new score" },
      },
    ],
    edges: [
      { id: "v1", from: "pitch", to: "server" },
      { id: "v2", from: "server", to: "triage", kind: "control", label: "triage" },
      { id: "v3", from: "skills", to: "engine", kind: "data", label: "methods" },
      { id: "v4", from: "triage", to: "engine", kind: "control", label: "plan + answers" },
      { id: "v5", from: "engine", to: "web", label: "search" },
      { id: "v6", from: "engine", to: "case", kind: "data", label: "report" },
      { id: "v7", from: "engine", to: "costs", fromSide: "bottom", toSide: "top", kind: "control", label: "metered" },
      { id: "v8", from: "case", to: "venture", label: "close case" },
      { id: "v9", from: "venture", to: "field", fromSide: "bottom", toSide: "top", kind: "control", label: "job" },
      { id: "v10", from: "field", to: "case", fromSide: "left", toSide: "bottom", kind: "data", label: "rescore" },
    ],
    trace: {
      prompt: "“An interactive menu website for restaurants and mamak stalls”, market: Kuala Lumpur.",
      steps: [
        { node: "pitch", title: "Idea pitched", detail: "Case VOS-0001 opened with a target market.", ms: 20 },
        { node: "server", edges: ["v1"], title: "Quota checked", detail: "Scout plan: quick scan allowed, live stream opened.", ms: 30 },
        { node: "triage", edges: ["v2"], title: "Questions asked", detail: "Methods chosen; asks who orders, how orders reach the kitchen today, and what they pay now.", ms: 40000 },
        { node: "engine", edges: ["v3", "v4"], title: "Investigation running", detail: "Local-market lens added for Kuala Lumpur; the user watches each search type in.", ms: 300000 },
        { node: "web", edges: ["v5"], title: "Evidence gathered", detail: "Competitor menus, POS vendors and owner complaints, each with a source URL.", ms: 240000 },
        { node: "costs", edges: ["v7"], title: "Run metered", detail: "6 searches, 2 page reads, about $0.40, well under the cap.", ms: 10 },
        { node: "case", edges: ["v6"], title: "Verdict: Rework it", detail: "Score 2.6/10. A real pain exists, but not the one in the pitch.", ms: 50 },
        { node: "venture", edges: ["v8"], title: "Sent to the field", detail: "Mission: watch counter staff at the lunch rush, then interview the owner. Do not pitch.", ms: 6000 },
        { node: "field", edges: ["v9", "v10"], title: "Pattern found", detail: "From 3 interviews: the real bottleneck is getting orders to the kitchen, not taking them.", ms: 60000 },
      ],
    },
    decisions: [
      {
        title: "The method lives in skills, not in code",
        why: "How to judge an idea is written as agent skills. The app only routes, runs and renders, so a method can be improved, or a new one added by an analyst, without a code change.",
        tradeoff: "Results depend on the model following the skill, so the output is held to one strict JSON contract and repaired when it breaks.",
      },
      {
        title: "Evidence or it did not happen",
        why: "Any number or claim needs a source URL or is marked unverified. Prices without a currency and source are dropped. Interview findings keep only verbatim quotes.",
      },
      {
        title: "Every AI call is metered and capped",
        why: "A deep investigation can run 30 minutes on the web. Each process has its own dollar, search and time cap and there is a daily budget, so a $9 plan can never cost more than it earns.",
        tradeoff: "A capped run can be thinner, so it still writes a case file from what it found instead of failing.",
      },
      {
        title: "A game for normal people, not a report for investors",
        why: "People with ideas skip the hard part: talking to customers. Ten steps, one next move per screen, and points for honest moves, including facing a “Destroy it” verdict.",
      },
      {
        title: "Run the Claude Code CLI headless instead of the raw API",
        why: "Skills, web search and tool limits come built in, so one call loads the method and searches the web with only the tools it is allowed.",
      },
    ],
  },

  {
    slug: "spooky-blooms",
    builtBy: "Solo: brand, website, admin, AI box designer and hosting. Operators run the orders, content and delivery.",
    brand: {
      logo: "/projects/spooky-blooms/logo.png",
      colors: [{ name: "Pumpkin Orange", hex: "#FF7A00" }, { name: "Witch Purple", hex: "#4B266F" }, { name: "Midnight Black", hex: "#0A0A0A" }, { name: "Bone Cream", hex: "#F5EDE1" }],
      typeface: "Playfair Display · Montserrat",
      tone: "“Fresh blooms. Spooky vibes.” Dark, elegant and playful: a Halloween boutique, not a costume shop.",
      screenshots: [
        { src: "/projects/spooky-blooms/admin-boxes-cards.png", caption: "Admin, Dress Me boxes: paste a WhatsApp order, the AI designer builds the story, one reveal card per guest and a sized kit. Print-ready PDF in one click" },
        { src: "/projects/spooky-blooms/admin-boxes-list.png", caption: "The same box as a shopping list: prices against the budget, Shopee searches, and Bought / Packed ticks for each item" },
        { src: "/projects/spooky-blooms/admin-boxes-kit.png", caption: "Each guest's kit on a mannequin, split into accessories, top and bottom, sized from their height and weight" },
        { src: "/projects/spooky-blooms/admin-items.png", caption: "Admin, shop items: reorder, hide, mark sold out or feature on the home page, no developer needed" },
        { src: "/projects/spooky-blooms/admin-editor.png", caption: "Adding a bouquet is one form: name, price, what's inside, photos. It is live on the site when saved" },
        { src: "/projects/spooky-blooms/admin-plan.png", caption: "The Halloween plan inside the admin: dates, who does what, and the rule that nothing is bought before payment" },
        { src: "/projects/spooky-blooms/home.png", caption: "Public site: Halloween bouquets, ordered on WhatsApp, delivered in Kuala Lumpur and Selangor" },
        { src: "/projects/spooky-blooms/bouquet.png", caption: "A bouquet page with add-ons. The order button opens WhatsApp with the bouquet, extras and new total already written" },
      ],
    },
    name: "Spooky Blooms",
    tagline: "A Halloween flower shop whose admin lets one person run the whole season, with an AI that designs costume boxes.",
    category: "E-commerce · AI Ops",
    accent: "lavender",
    status: "pilot",
    year: "2026",
    github: undefined, // private repo
    demo: "https://spooky-blooms.pages.dev",
    summary:
      "Spooky Blooms is a Halloween 2026 pilot in Malaysia: spooky bouquets made by partner florists and “Dress Me for Halloween” mystery costume boxes, sold through Instagram ads and ordered on WhatsApp. The website is the easy part. The admin is what makes it work for the people running it. Operators add a bouquet, change a price, hide a sold-out item or set the delivery dates themselves, and it is live straight away. Each add-on shows what the florist charges and what we keep. The hardest job is designing a costume box by hand: picking a story, writing a sealed card for each guest and finding costume pieces that fit. Instead, the operator pastes the customer's WhatsApp order and an AI designer builds the whole box in minutes, with print-ready cards, a sized kit per guest and a shopping list with prices and Bought / Packed ticks.",
    outcomes: [
      "A costume box goes from a pasted WhatsApp order to print-ready cards and a priced shopping list in minutes",
      "Operators change products, prices, photos, add-ons and delivery dates themselves, live in seconds, with no developer",
      "Change one guest or the story by chatting (“make Arif a werewolf, no fake blood”); every version can be restored",
      "Orders arrive on WhatsApp already written: bouquet, extras, new total, sizes and delivery details",
    ],
    stack: ["Cloudflare Pages + Functions", "Node.js", "Vanilla JS", "Claude Code CLI (headless)", "Docker", "systemd", "Cloudflare Tunnel"],
    nodes: [
      {
        id: "shop", label: "Public Site", kind: "input", x: 0, y: 60, tech: "Cloudflare Pages",
        summary: "Bouquets, party items and Dress Me boxes, each with add-ons and a WhatsApp order button.",
        io: { in: "Customer from an Instagram ad", out: "Pre-written WhatsApp order" },
      },
      {
        id: "admin", label: "Admin", kind: "input", x: 0, y: 320, tech: "Signed-cookie login",
        summary: "Where the operators run the shop: shop items, add-ons, Dress Me boxes, settings and the Halloween plan.",
        responsibilities: [
          "Add, edit, reorder, hide or mark items sold out; photos are resized in the browser before upload",
          "Add-ons show what the florist charges and the margin we keep (never sent to the public site)",
          "Settings for WhatsApp number, delivery area and fee, delivery days and the last order day",
        ],
        io: { in: "Operator edits", out: "Live site changes, box jobs" },
      },
      {
        id: "proxy", label: "Pages Functions", kind: "service", x: 300, y: 180, tech: "Edge proxy",
        summary: "Forwards /api and /uploads to the backend with a shared key, so the backend is never reachable directly.",
      },
      {
        id: "api", label: "Shop API", kind: "service", x: 600, y: 180, tech: "Node.js · zero dependencies",
        summary: "Products, add-ons, photos, settings and sign-in, stored as files.",
        responsibilities: [
          "Answers 403 without the proxy key",
          "Rate-limited sign-in, signed session cookie",
          "Strips florist costs from everything public",
        ],
      },
      {
        id: "store", label: "Shop Data", kind: "data", x: 900, y: 40, tech: "JSON + images",
        summary: "Bouquets, add-ons, settings and photos, plus one order file and one run file per costume box.",
      },
      {
        id: "runner", label: "Agent Runner", kind: "service", x: 900, y: 320, tech: "systemd · Node",
        summary: "Watches for new box messages and runs the designer one job at a time, with a 12-minute limit and a Stop button.",
        responsibilities: [
          "Talks to the API only through files, so the web container needs no AI access",
          "Resumes the same agent session per box, so follow-up chats keep context",
          "Keeps the last 20 versions of every box",
        ],
      },
      {
        id: "designer", label: "Box Designer Agent", kind: "agent", x: 1200, y: 320, tech: "Claude Code CLI",
        summary: "Turns an order into a story, a sealed identity card per guest and a costume kit that fits.",
        responsibilities: [
          "Reads the house rules: budget, card word limits, characters, stories, avoid list",
          "Accessory-first kits; wearables only if loose or free-size, picked from height and top size",
          "Prices each item from typical Shopee Malaysia prices and writes the search phrase",
        ],
        io: { in: "Pasted order or an instruction for one guest", out: "Box JSON" },
      },
      {
        id: "tools", label: "Checks & Pictures", kind: "tool", x: 1500, y: 200, tech: "check.js · find-image.js",
        summary: "A validator the agent must pass, and a picture finder for each character (Wikipedia, Commons, movie posters).",
      },
      {
        id: "box", label: "Box Preview", kind: "output", x: 1500, y: 420, tech: "Card studio",
        summary: "Cards to edit, print or save as PDF, kits on a mannequin, and a shopping list with Bought / Packed ticks.",
      },
      {
        id: "wa", label: "WhatsApp Order", kind: "output", x: 300, y: -60,
        summary: "Bouquet, extras, total, delivery and sizes in one message. Payment first, then the florist is paid.",
      },
    ],
    edges: [
      { id: "s1", from: "shop", to: "proxy" },
      { id: "s2", from: "admin", to: "proxy", label: "edits" },
      { id: "s3", from: "proxy", to: "api", label: "proxy key" },
      { id: "s4", from: "api", to: "store", kind: "data" },
      { id: "s5", from: "store", to: "runner", fromSide: "bottom", toSide: "top", kind: "data", label: "new message" },
      { id: "s6", from: "runner", to: "designer", kind: "control", label: "claude -p" },
      { id: "s7", from: "designer", to: "tools", label: "check + find" },
      { id: "s8", from: "designer", to: "box", fromSide: "bottom", toSide: "left", kind: "data", label: "box JSON" },
      { id: "s9", from: "shop", to: "wa", fromSide: "top", toSide: "left", label: "order" },
    ],
    trace: {
      prompt: "Squad box for 4 office friends (Arif, Siti, Raj, Lina) with their sizes, no masks, delivery 28 Oct. Pasted from WhatsApp.",
      steps: [
        { node: "admin", title: "Order pasted", detail: "The operator opens Dress Me boxes, pastes the WhatsApp message and presses Design the box.", ms: 20 },
        { node: "proxy", edges: ["s2"], title: "Forwarded", detail: "Signed-in request passed to the backend with the proxy key.", ms: 40 },
        { node: "api", edges: ["s3"], title: "Message saved", detail: "Stored as the box's order file; the page starts showing live steps.", ms: 30 },
        { node: "runner", edges: ["s4", "s5"], title: "Job picked up", detail: "Runner sees the new message and starts the designer in its own session.", ms: 2000 },
        { node: "designer", edges: ["s6"], title: "Box designed", detail: "Story “The Graveyard Shift”: four characters, each with a mission that links to the others.", ms: 240000 },
        { node: "tools", edges: ["s7"], title: "Checked", detail: "Card limits and kit rules pass; a picture is found for every character.", ms: 30000 },
        { node: "box", edges: ["s8"], title: "Ready to print", detail: "Cards as PDF, a kit per guest, RM116 shopping list against an RM88–120 budget.", ms: 50 },
        { node: "admin", title: "One change", detail: "“Cheaper kit for Siti” is sent about Siti only; the rest of the box stays as it was.", ms: 90000 },
      ],
    },
    decisions: [
      {
        title: "The admin is the product for the people running it",
        why: "The operators are not developers. Every routine change, from a new bouquet to a sold-out add-on or the last order day, is a form in the admin that goes live at once, so nobody waits on me during the busiest three weeks of the year.",
      },
      {
        title: "Chat about one part, not the whole box",
        why: "Real changes are small: one guest dislikes clowns, one kit is too expensive. Each message is aimed at the whole box, one guest or the story, and the agent changes only that part. Quick actions fill in the common requests.",
        tradeoff: "Hand edits to card text stay in the browser until “Save my edits” turns them into a version, so the agent never overwrites someone's wording by surprise.",
      },
      {
        title: "Keep the AI out of the web container",
        why: "The agent runs as a separate host service and talks to the shop only through files. The public-facing container has no AI credentials and a crashed run can't take the shop down.",
      },
      {
        title: "Orders first, on WhatsApp",
        why: "Customers from Instagram ads already chat on WhatsApp, so the site writes the order message for them. Nothing is bought, from flowers to costume pieces, until the customer has paid.",
        tradeoff: "No online checkout; payment is checked by a person. Fine for a three-week pilot.",
      },
    ],
  },

  {
    // Under NDA: no code, no product or client names. Diagrams and descriptions only.
    slug: "cad-drafting-agents",
    builtBy: "Remote contract with a confidential US construction-tech startup (Jun – Oct 2026). I designed and built the agent pipeline, the MCP layer and the evals, and contributed to the team's ingestion pipeline.",
    brand: {
      logo: "/projects/cad-drafting-agents/logo.svg",
      colors: [{ name: "Blueprint", hex: "#1E5AA8" }, { name: "Drafting Ink", hex: "#0F1B2D" }, { name: "Vellum", hex: "#DCE8F7" }, { name: "Redline", hex: "#D64545" }],
      tone: "Under NDA, so this case study uses diagrams and my own words. I can walk through the architecture in an interview.",
    },
    name: "CAD Drafting Agents",
    tagline: "A planner, specialist drafters and a read-only QA agent that draw construction documents in AutoCAD.",
    category: "Multi-Agent Systems",
    accent: "sky",
    status: "pilot",
    year: "2026",
    github: undefined, // under NDA
    demo: undefined,
    summary:
      "Architecture firms turn project facts (scope, keynotes, door and wall schedules) into a set of construction drawings, sheet by sheet, by hand in AutoCAD. I built a multi-agent pipeline that does the drafting. A planner decides which sheets the set needs and in what order. A specialist drafter run draws each sheet through an MCP server that controls AutoCAD. A read-only QA agent checks every sheet and sends failures back for another round. An architect still signs off. Built as a remote contract engineer (Agentic AI Engineer, Jun – Oct 2026) for a confidential US construction-tech startup. The work is under NDA, so there is no code here and the company is not named.",
    outcomes: [
      "Planner returns a schema-valid sheet plan in dependency order, with open questions listed",
      "QA agent cannot change the drawing: write tools are blocked in code, not just in the prompt",
      "AutoCAD MCP server with 8 tool groups, 123/123 tests, and a headless mode that needs no AutoCAD install",
    ],
    stack: ["Python", "LangGraph", "Claude on AWS Bedrock", "MCP", "AutoCAD · AutoLISP", "ezdxf", "JSON Schema", "n8n"],
    nodes: [
      {
        id: "facts", label: "Project Facts", kind: "input", x: 0, y: 200, tech: "Ingestion pipeline",
        summary: "Emails, attachments and drawings from the client, turned into one structured facts package.",
        responsibilities: [
          "Team-built: n8n workflows, Python and Node workers, Postgres + pgvector",
          "My part: email classification, the provider layer and the job-queue workers",
        ],
        io: { in: "Emails, PDFs, DWGs", out: "Facts package (JSON)" },
      },
      {
        id: "orch", label: "Orchestrator", kind: "service", x: 300, y: 200, tech: "LangGraph StateGraph",
        summary: "Runs the job: plan, draft, check, and redraft only the sheets that failed.",
        responsibilities: [
          "Makes no model calls of its own; it only routes",
          "Sends failing sheets back with their QA issues, up to 2 revision rounds",
          "Keeps one MCP session open for a whole run",
        ],
        io: { in: "Facts package", out: "Per-sheet status" },
      },
      {
        id: "skills", label: "Skill Library", kind: "memory", x: 300, y: -20, tech: "Markdown skills",
        summary: "Drafting know-how written down as skills: sheet structure, keynotes, schedules, wall types, code compliance, client standards.",
        responsibilities: [
          "Agents load a skill only when the sheet in progress needs it",
          "Each skill has worked examples from a real project",
        ],
      },
      {
        id: "planner", label: "Planning Agent", kind: "agent", x: 620, y: 20, tech: "Claude · Bedrock",
        summary: "Decides which sheets the set needs and the order to build them in. Never draws.",
        responsibilities: [
          "Maps which sheets produce and which consume shared items (legends, schedules)",
          "Sorts the sheets by those dependencies",
          "Lists unclear sheet or dependency decisions as open items instead of guessing",
        ],
        io: { in: "Facts + skills", out: "Sheet blueprint" },
      },
      {
        id: "blueprint", label: "Sheet Blueprint", kind: "data", x: 940, y: 20, tech: "JSON Schema",
        summary: "The plan for the whole set: sheets, build order, open items, and each sheet's QA status.",
        io: { in: "Plan from the planner, verdicts from QA", out: "Build order for the orchestrator" },
      },
      {
        id: "drafter", label: "Specialist Drafter", kind: "agent", x: 620, y: 200, tech: "Claude · Bedrock",
        summary: "One run per sheet. Reads the facts and the current drawing, settles what it can, asks about what it can't, then draws.",
        responsibilities: [
          "Labels each layer as existing, demolition or new work before drawing",
          "Checks plan notes against what is actually in the drawing",
          "One agent with sheet-specific skills, not one agent per sheet",
        ],
        io: { in: "Sheet scope + skills + drawing state", out: "Geometry, keynotes, schedules" },
      },
      {
        id: "qa", label: "QA Agent", kind: "agent", x: 620, y: 380, tech: "Claude · Bedrock",
        summary: "Checks each finished sheet against the blueprint, the way a senior drafter marks up a set. It reports problems but cannot fix them.",
        responsibilities: [
          "Missing references, duplicate or orphaned keynotes, broken callouts",
          "Empty schedules and wrong sheet numbering",
          "Writes pass or fail plus issues back to the blueprint",
        ],
        io: { in: "Blueprint + read-only drawing", out: "pass | fail + issues" },
      },
      {
        id: "mcp", label: "AutoCAD MCP Server", kind: "tool", x: 940, y: 200, tech: "MCP · AutoLISP · ezdxf",
        summary: "Lets the agents draw in AutoCAD: drawings, entities, layers, blocks and annotations.",
        responsibilities: [
          "Live mode controls a running AutoCAD session through an AutoLISP bridge",
          "Headless mode edits DXF files directly, so tests and evals need no AutoCAD install",
          "Write tools are cut out of the QA agent's tool set",
        ],
        io: { in: "Tool calls", out: "Drawing changes + state" },
      },
      {
        id: "dxf", label: "Project Drawing", kind: "data", x: 1260, y: 200, tech: "DXF per project",
        summary: "One saved drawing per project, so the drafter and QA agent look at the same work across separate sessions.",
      },
      {
        id: "review", label: "Architect Sign-off", kind: "output", x: 1260, y: 380,
        summary: "Sheets that pass QA go to the architect of record. A person signs off; the AI does not.",
      },
    ],
    edges: [
      { id: "a1", from: "facts", to: "orch", label: "facts package" },
      { id: "a2", from: "orch", to: "planner", kind: "control", label: "plan" },
      { id: "a3", from: "skills", to: "planner", kind: "data" },
      { id: "a4", from: "planner", to: "blueprint", kind: "data", label: "write" },
      { id: "a5", from: "orch", to: "drafter", kind: "control", label: "per sheet" },
      { id: "a6", from: "drafter", to: "mcp", label: "draw" },
      { id: "a7", from: "mcp", to: "dxf", kind: "data", label: "save" },
      { id: "a8", from: "orch", to: "qa", kind: "control", label: "check" },
      { id: "a9", from: "qa", to: "mcp", label: "read-only" },
      { id: "a10", from: "qa", to: "review", label: "passed" },
      { id: "a11", from: "qa", to: "orch", fromSide: "left", toSide: "bottom", kind: "control", label: "revise (max 2)" },
    ],
    trace: {
      prompt: "Interior tenant-improvement project: build the demolition plan and its keynotes.",
      steps: [
        { node: "facts", title: "Facts loaded", detail: "Scope, keynotes and existing-drawing notes for the project.", ms: 50 },
        { node: "orch", edges: ["a1"], title: "Run started", detail: "No blueprint yet for this project, so planning comes first.", ms: 20 },
        { node: "planner", edges: ["a2", "a3"], title: "Set planned", detail: "Sheet structure and client-standard skills read; sheets sorted by what each one needs from the others.", ms: 240000 },
        { node: "blueprint", edges: ["a4"], title: "Blueprint written", detail: "Passed the schema check, with the build order and the open items a person needs to answer.", ms: 30 },
        { node: "drafter", edges: ["a5"], title: "Sheet in progress", detail: "Layers labelled existing, demolition or new; plan notes checked against the drawing.", ms: 180000 },
        { node: "mcp", edges: ["a6", "a7"], title: "Drawn", detail: "Demolition geometry, keynote callouts and legend drawn and saved to the project drawing.", ms: 60000 },
        { node: "qa", edges: ["a8", "a9"], title: "Checked", detail: "An orphaned keynote is found, so the sheet fails and goes back to the drafter with the issue.", ms: 90000 },
        { node: "drafter", edges: ["a11"], title: "Revised", detail: "Second round fixes only the flagged keynote.", ms: 60000 },
        { node: "review", edges: ["a10"], title: "Ready for sign-off", detail: "Sheet passes QA and goes to the architect.", ms: 10 },
      ],
    },
    decisions: [
      {
        title: "One drafter with skills, not an agent per sheet",
        why: "A human drafter reads the inputs and draws in one task. So there is one drafting agent, and it loads the skill for the sheet in progress. A 15-sheet set needs about 6 to 7 skills, not 15 agents.",
        tradeoff: "I added the planner and QA agents later, only after real runs showed the need for build ordering and an independent check.",
      },
      {
        title: "Read-only enforced in code, not in the prompt",
        why: "Telling a model not to edit the drawing isn't a guarantee. The QA agent's tool wrapper refuses every write operation, so a confused checker can't damage the work it is checking.",
      },
      {
        title: "Escalate, don't guess",
        why: "A wrong dependency in the plan puts every later sheet in the wrong order. When the facts don't settle a question, agents record it as an open item for a person instead of inferring an answer.",
      },
      {
        title: "Persist the drawing in a file, not in a process",
        why: "In headless mode every new MCP session starts with a blank drawing, so the QA agent saw nothing the drafter had just drawn. Each phase now opens and saves one drawing file per project.",
      },
      {
        title: "Evals and traces from the first run",
        why: "Every agent run writes a full trace with token counts against a per-run budget. That showed the real bottleneck early: Bedrock rate limits and daily token caps, not model quality.",
        tradeoff: "Long skill files make prompts heavy, so the planner reads skills on demand instead of loading them all up front.",
      },
    ],
  },

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
