#!/usr/bin/env bun
// Validates projects/projects.json against the project folders and makes sure no
// original game files are tracked. Run with `bun run check`. CI runs it on every push and PR.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const STATUSES = ["proposed", "analysis", "rebuilding", "playable", "complete"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORBIDDEN =
  /\.(apk|xapk|aab|ipa|obb|exe|dll|msi|dmg|pkg|iso|bin|cue|img|rom|nes|sfc|smc|gb|gbc|gba|nds|n64|z64|swf|unity3d|assets|pak|wad|grp|dex|so|zip|7z|rar)$/i;
const MAX_BYTES = 5 * 1024 * 1024;

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

// ---------- projects.json ----------
type Project = {
  slug: string;
  title: string;
  summary: string;
  status: string;
  original: { developer?: string | null; publisher?: string | null; year?: number | null; platforms: string[] };
  target?: string | null;
  play?: string | null;
  tools?: { label: string; href: string }[];
  repo?: string | null;
  maintainers: string[];
  tags: string[];
  help_wanted: string[];
};

let projects: Project[] = [];
try {
  projects = await Bun.file(join(ROOT, "projects/projects.json")).json();
  if (!Array.isArray(projects)) throw new Error("top level must be an array");
} catch (e) {
  fail(`projects/projects.json: invalid JSON (${(e as Error).message})`);
}

const isText = (v: unknown) => typeof v === "string" && v.trim() !== "";
const isList = (v: unknown) => Array.isArray(v) && v.every(isText);
const seen = new Set<string>();

for (const [i, p] of projects.entries()) {
  const at = `projects.json[${i}]${p?.slug ? ` (${p.slug})` : ""}`;
  if (!isText(p.slug) || !SLUG.test(p.slug)) fail(`${at}: "slug" must be kebab-case, e.g. "zombie-lane"`);
  if (seen.has(p.slug)) fail(`${at}: duplicate slug`);
  seen.add(p.slug);
  for (const key of ["title", "summary"] as const) if (!isText(p[key])) fail(`${at}: "${key}" is required`);
  if (!STATUSES.includes(p.status)) fail(`${at}: "status" must be one of ${STATUSES.join(", ")}`);
  if (!p.original || typeof p.original !== "object") fail(`${at}: "original" is required`);
  else if (!isList(p.original.platforms) || p.original.platforms.length === 0)
    fail(`${at}: "original.platforms" must be a non-empty list of strings`);
  for (const key of ["maintainers", "tags", "help_wanted"] as const)
    if (!isList(p[key])) fail(`${at}: "${key}" must be a list of strings (use [] if empty)`);
  for (const m of p.maintainers ?? []) if (m.startsWith("@")) fail(`${at}: maintainer "${m}" should not start with @`);
  if (p.repo && !/^https:\/\//.test(p.repo)) fail(`${at}: "repo" must be an https URL`);

  const page = join(ROOT, "projects", p.slug ?? "", "index.html");
  if (!existsSync(page)) {
    fail(`${at}: missing projects/${p.slug}/index.html (copy projects/_template/)`);
  } else {
    const html = await Bun.file(page).text();
    if (!html.includes(`data-project="${p.slug}"`)) fail(`projects/${p.slug}/index.html: needs data-project="${p.slug}"`);
    if (!html.includes(`<h1>${p.title}</h1>`)) fail(`projects/${p.slug}/index.html: <h1> should match the title "${p.title}"`);
  }
  if (p.tools !== undefined && !Array.isArray(p.tools)) fail(`${at}: "tools" must be a list`);
  for (const tool of p.tools ?? []) {
    if (!isText(tool?.label) || !isText(tool?.href)) fail(`${at}: each tool needs a "label" and an "href"`);
    else if (!/:\/\//.test(tool.href) && !existsSync(join(ROOT, "projects", p.slug, tool.href.replace(/^\.?\//, ""))))
      fail(`${at}: tool "${tool.label}" points to ${tool.href}, which doesn't exist in projects/${p.slug}/`);
  }
  if (p.play && !/:\/\//.test(p.play) && !existsSync(join(ROOT, "projects", p.slug, p.play.replace(/^\.?\//, ""))))
    fail(`${at}: "play" points to ${p.play}, which doesn't exist in projects/${p.slug}/`);
}

// Every project folder must be listed.
for (const dir of readdirSync(join(ROOT, "projects"))) {
  if (dir.startsWith("_") || dir.startsWith(".")) continue;
  if (!statSync(join(ROOT, "projects", dir)).isDirectory()) continue;
  if (!seen.has(dir)) fail(`projects/${dir}/ has no entry in projects/projects.json`);
}

// ---------- No original game files ----------
const tracked = (await Bun.$`git ls-files -z`.cwd(ROOT).quiet().text()).split("\0").filter(Boolean);
for (const file of tracked) {
  if (FORBIDDEN.test(file)) fail(`${file}: game binaries and archives must not be committed (see /contribute/#ground-rules)`);
  else if (existsSync(join(ROOT, file)) && statSync(join(ROOT, file)).size > MAX_BYTES)
    fail(`${file}: larger than 5 MB. Original assets must not be committed`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log(`✓ ${projects.length} project(s) OK, ${tracked.length} tracked files clean`);
