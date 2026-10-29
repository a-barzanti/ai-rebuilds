#!/usr/bin/env bun
// Validates data/projects.json, makes sure index.html and README.md were re-synced after an edit,
// and keeps binaries out of the repo. `bun run check`; CI runs it on every push and pull request.
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { AI_LABEL, METHOD_LABEL, type Data } from "./render.ts";
import { ROOT, loadData, renderFile, sync } from "./sync.ts";

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);
const isText = (v: unknown) => typeof v === "string" && v.trim() !== "";
const isDate = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const isUrl = (v: unknown) => typeof v === "string" && /^https:\/\/[^\s]+$/.test(v);
const ID = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
const KEYS = new Set(["id", "name", "category", "rebuilds", "summary", "ai", "method", "year", "by", "url", "repo", "writeup", "featured", "added", "github"]);

let data: Data | null = null;
try {
  data = await loadData();
} catch (e) {
  fail(`data/projects.json: invalid JSON (${(e as Error).message})`);
}

if (data) {
  const today = new Date().toISOString().slice(0, 10);
  if (!isDate(data.updated)) fail(`"updated" must be a YYYY-MM-DD date`);
  if (data.refreshed !== null && !isDate(data.refreshed)) fail(`"refreshed" must be a YYYY-MM-DD date or null`);
  const categories = new Set(data.categories.map((c) => c.id));
  for (const c of data.categories) if (!ID.test(c.id) || !isText(c.title) || !isText(c.blurb)) fail(`category ${c.id}: needs an id, title and blurb`);

  const ids = new Set<string>();
  const repos = new Map<string, string>();
  let newest = "";
  for (const [i, p] of data.projects.entries()) {
    const at = `projects[${i}]${p?.id ? ` (${p.id})` : ""}`;
    for (const k of Object.keys(p)) if (!KEYS.has(k)) fail(`${at}: unknown field "${k}"`);
    if (!isText(p.id) || !ID.test(p.id)) fail(`${at}: "id" must be lowercase with dashes, e.g. "open-rct2"`);
    if (ids.has(p.id)) fail(`${at}: duplicate id`);
    ids.add(p.id);
    for (const k of ["name", "rebuilds", "summary"] as const) if (!isText(p[k])) fail(`${at}: "${k}" is required`);
    if (p.summary && p.summary.length > 280) fail(`${at}: keep "summary" under 280 characters`);
    if (!categories.has(p.category)) fail(`${at}: "category" must be one of ${[...categories].join(", ")}`);
    if (!(p.ai in AI_LABEL)) fail(`${at}: "ai" must be one of ${Object.keys(AI_LABEL).join(", ")}`);
    if (!(p.method in METHOD_LABEL)) fail(`${at}: "method" must be one of ${Object.keys(METHOD_LABEL).join(", ")}`);
    if (p.year !== undefined && (!Number.isInteger(p.year) || p.year < 1950 || p.year > 2100)) fail(`${at}: "year" must be a year`);
    for (const k of ["url", "repo", "writeup"] as const) if (p[k] !== undefined && !isUrl(p[k])) fail(`${at}: "${k}" must be an https URL`);
    if (!p.url && !p.repo && !p.writeup) fail(`${at}: needs at least one of "url", "repo" or "writeup"`);
    if (p.repo) {
      const key = p.repo.toLowerCase();
      if (repos.has(key)) fail(`${at}: same repo as ${repos.get(key)}`);
      repos.set(key, p.id);
    }
    if (!isDate(p.added)) fail(`${at}: "added" must be today's date as YYYY-MM-DD`);
    else if (p.added > today) fail(`${at}: "added" is in the future`);
    else if (p.added > newest) newest = p.added;
  }
  if (newest && data.updated < newest) fail(`"updated" (${data.updated}) is older than the newest "added" date (${newest}); set it to ${newest}`);
  for (const s of data.sources) if (!isText(s.name) || !isUrl(s.url) || !isText(s.by) || !isText(s.used_for)) fail(`source ${s.name}: needs name, by, url and used_for`);

  if (!errors.length) {
    const stale = await sync(data, true);
    for (const file of stale) {
      const now = (await Bun.file(join(ROOT, file)).text()).split("\n");
      const want = (await renderFile(file, data)).split("\n");
      const i = want.findIndex((line, n) => line !== now[n]);
      fail(`${file} out of date: run \`bun run sync\` and commit the result (first difference at line ${i + 1}: expected ${JSON.stringify(want[i]?.slice(0, 160))})`);
    }
  }
}

// Nothing binary or huge belongs in a list of links.
const FORBIDDEN = /\.(apk|xapk|aab|ipa|obb|exe|dll|msi|dmg|pkg|iso|bin|cue|img|rom|nes|sfc|smc|gb|gbc|gba|nds|n64|z64|swf|unity3d|assets|pak|wad|grp|dex|so|zip|7z|rar)$/i;
const tracked = (await Bun.$`git ls-files -z`.cwd(ROOT).quiet().text()).split("\0").filter(Boolean);
for (const file of tracked) {
  if (FORBIDDEN.test(file)) fail(`${file}: binaries and archives must not be committed`);
  else if (existsSync(join(ROOT, file)) && statSync(join(ROOT, file)).size > 2 * 1024 * 1024) fail(`${file}: larger than 2 MB`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log(`✓ ${data!.projects.length} projects OK, page and README in sync, ${tracked.length} tracked files clean`);
