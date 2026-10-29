// Turns data/projects.json into the static HTML on the home page and the list in README.md.
// `bun run sync` writes both; `bun run check` fails if either is out of date.

export type AI = "built" | "assisted" | "none" | "unknown";
export type Method = "clean-room" | "reimplementation" | "decompilation" | "recompilation" | "port" | "rewrite" | "tool";

export type Project = {
  id: string;
  name: string;
  category: string;
  rebuilds: string;
  summary: string;
  ai: AI;
  method: Method;
  year?: number;
  by?: string;
  url?: string;
  repo?: string;
  writeup?: string;
  featured?: boolean;
  added: string;
  github?: { stars: number; pushed: string; archived: boolean; licence: string | null };
};
export type Category = { id: string; title: string; blurb: string };
export type Source = { name: string; by: string; url: string; licence: string | null; used_for: string };
export type Data = { updated: string; refreshed: string | null; categories: Category[]; projects: Project[]; sources: Source[] };

export const AI_LABEL: Record<AI, string> = { built: "AI-built", assisted: "AI-assisted", none: "No AI", unknown: "AI use not stated" };
export const METHOD_LABEL: Record<Method, string> = {
  "clean-room": "Clean-room",
  reimplementation: "Reimplementation",
  decompilation: "Decompilation",
  recompilation: "Recompilation",
  port: "Port",
  rewrite: "Rewrite",
  tool: "Tool",
};

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function formatStars(n: number) {
  if (n < 1000) return String(n);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  const k = n / 1000;
  return (k < 100 ? k.toFixed(1).replace(/\.0$/, "") : Math.round(k).toString()) + "k";
}

const primaryLink = (p: Project) => p.url ?? p.repo ?? p.writeup!;

export function sorted(projects: Project[]) {
  return [...projects].sort(
    (a, b) => Number(!!b.featured) - Number(!!a.featured) || (b.github?.stars ?? -1) - (a.github?.stars ?? -1) || a.name.localeCompare(b.name),
  );
}

function entry(p: Project) {
  const search = [p.name, p.rebuilds, p.summary, p.by, METHOD_LABEL[p.method], AI_LABEL[p.ai]].join(" ").toLowerCase();
  const links = [
    p.url && `<a href="${esc(p.url)}">Website</a>`,
    p.repo && `<a href="${esc(p.repo)}">Source</a>`,
    p.writeup && `<a href="${esc(p.writeup)}">Write-up</a>`,
  ].filter(Boolean);
  const gh = p.github;
  const stats = [
    gh && `<span class="stars" title="${gh.stars.toLocaleString("en-US")} GitHub stars"><span aria-hidden="true">★</span> ${formatStars(gh.stars)}<span class="sr"> GitHub stars</span></span>`,
    gh && (gh.archived
      ? `<span class="quiet">Archived</span>`
      : `<span>Last commit <time class="ago" datetime="${gh.pushed}">${formatDate(gh.pushed)}</time></span>`),
    (p.year || p.by) && `<span>${[p.year, p.by && esc(p.by)].filter(Boolean).join(", ")}</span>`,
  ].filter(Boolean);
  const marks = [
    (p.ai === "built" || p.ai === "assisted") && `<span class="mark mark-${p.ai}">${AI_LABEL[p.ai]}</span>`,
    `<span class="mark mark-method">${METHOD_LABEL[p.method]}</span>`,
  ].filter(Boolean);

  return `<li class="entry${p.featured ? " entry-featured" : ""}" id="${esc(p.id)}" data-ai="${p.ai}" data-stars="${gh?.stars ?? -1}" data-pushed="${gh?.pushed ?? ""}" data-added="${p.added}" data-name="${esc(p.name.toLowerCase())}" data-search="${esc(search)}">
  <p class="entry-original"><span class="sr">Rebuilds </span>${esc(p.rebuilds)}</p>
  <div class="entry-main">
    <h3 class="entry-name"><a href="${esc(primaryLink(p))}">${esc(p.name)}</a></h3>
    <p class="entry-marks">${marks.join(" ")}</p>
    <p class="entry-summary">${esc(p.summary)}</p>
    <p class="entry-links">${links.join(" ")}</p>
  </div>
  <p class="entry-stats">${stats.join("")}</p>
</li>`;
}

export function renderDirectory(data: Data) {
  return data.categories
    .map((c) => {
      const items = sorted(data.projects.filter((p) => p.category === c.id));
      return `<section class="group" id="${esc(c.id)}" data-group aria-labelledby="${esc(c.id)}-title">
<header class="group-head">
  <h2 class="group-title" id="${esc(c.id)}-title">${esc(c.title)} <span class="group-count">${items.length}</span></h2>
  <p class="group-blurb">${esc(c.blurb)}</p>
</header>
<ol class="entries">
${items.map(entry).join("\n")}
</ol>
</section>`;
    })
    .join("\n");
}

export function renderChips(data: Data) {
  const chip = (id: string, label: string, n: number, on = false) =>
    `<button type="button" class="chip" data-category="${id}" aria-pressed="${on}">${esc(label)} <span class="chip-n">${n}</span></button>`;
  return [
    chip("all", "All", data.projects.length, true),
    ...data.categories.map((c) => chip(c.id, c.title, data.projects.filter((p) => p.category === c.id).length)),
  ].join("\n");
}

export function renderStamp(data: Data) {
  const stars = data.projects.reduce((n, p) => n + (p.github?.stars ?? 0), 0);
  return `<p class="stamp-label">List updated</p>
<p class="stamp-date"><time datetime="${data.updated}">${formatDate(data.updated)}</time></p>
<p class="stamp-meta">${data.projects.length} projects in ${data.categories.length} categories, ${formatStars(stars)} GitHub stars between them.</p>
<p class="stamp-meta">${
    data.refreshed
      ? `Stars and activity refreshed weekly, last on <time datetime="${data.refreshed}">${formatDate(data.refreshed)}</time>.`
      : "Stars and activity are refreshed weekly."
  }</p>`;
}

export function renderCredits(data: Data) {
  return data.sources
    .map(
      (s) =>
        `<li><a href="${esc(s.url)}">${esc(s.name)}</a> <span class="quiet">by ${esc(s.by)}${s.licence ? `, ${esc(s.licence)}` : ""}. Used for: ${esc(s.used_for)}.</span></li>`,
    )
    .join("\n");
}

export function renderReadmeList(data: Data) {
  const lines = [
    `_${data.projects.length} projects. List updated ${formatDate(data.updated)}${
      data.refreshed ? `; GitHub stars refreshed ${formatDate(data.refreshed)}` : ""
    }. Browse, search and filter it at [ai-rebuilds.com](https://ai-rebuilds.com)._`,
    "",
    data.categories.map((c) => `- [${c.title}](#${c.title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-")})`).join("\n"),
  ];
  for (const c of data.categories) {
    lines.push("", `### ${c.title}`, "", c.blurb, "");
    for (const p of sorted(data.projects.filter((x) => x.category === c.id))) {
      const tags = [p.ai === "built" || p.ai === "assisted" ? AI_LABEL[p.ai] : null, METHOD_LABEL[p.method], p.github ? `★ ${formatStars(p.github.stars)}` : null]
        .filter(Boolean)
        .join(", ");
      const extra = p.writeup ? ` ([write-up](${p.writeup}))` : "";
      lines.push(`- **[${p.name}](${primaryLink(p)})**: rebuilds ${p.rebuilds}. ${p.summary}${extra} _${tags}_`);
    }
  }
  lines.push("", "### Sources and credits", "", "We found many of these projects through the lists below. The descriptions here are our own.", "");
  for (const s of data.sources) lines.push(`- [${s.name}](${s.url}) by ${s.by}${s.licence ? ` (${s.licence})` : ""}. Used for: ${s.used_for}.`);
  return lines.join("\n");
}

/** Replace the text between `<!-- name:start -->` and `<!-- name:end -->`. */
export function splice(doc: string, name: string, content: string) {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  if (!re.test(doc)) throw new Error(`missing <!-- ${name}:start --> / <!-- ${name}:end --> markers`);
  return doc.replace(re, (_, a, b) => `${a}\n${content}\n${b}`);
}

export function renderIndex(html: string, data: Data) {
  html = splice(html, "stamp", renderStamp(data));
  html = splice(html, "chips", renderChips(data));
  html = splice(html, "directory", renderDirectory(data));
  html = splice(html, "credits", renderCredits(data));
  return html;
}

export function renderReadme(md: string, data: Data) {
  return splice(md, "list", renderReadmeList(data));
}
