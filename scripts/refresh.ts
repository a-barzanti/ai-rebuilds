#!/usr/bin/env bun
// Refreshes GitHub stars, last-commit dates and archive status for every listed repo,
// follows renamed repos, checks that other links still answer, then re-syncs the page.
// The weekly "Refresh" workflow runs this. Locally: GITHUB_TOKEN=$(gh auth token) bun run refresh
import { appendFileSync } from "node:fs";
import { DATA, loadData, sync } from "./sync.ts";
import type { Project } from "./render.ts";

const token = process.env.GITHUB_TOKEN;
const headers: Record<string, string> = { accept: "application/vnd.github+json", "user-agent": "ai-rebuilds-refresh" };
if (token) headers.authorization = `Bearer ${token}`;

const data = await loadData();
const problems: string[] = [];
const GH = /^https:\/\/github\.com\/([^/]+)\/([^/#?]+)\/?$/;

async function refreshRepo(p: Project) {
  const m = p.repo?.match(GH);
  if (!m) return;
  const res = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}`, { headers });
  if (!res.ok) {
    problems.push(`${p.id}: ${p.repo} answered HTTP ${res.status}`);
    return;
  }
  const r = (await res.json()) as any;
  const canonical = `https://github.com/${r.full_name}`;
  if (canonical !== p.repo) {
    problems.push(`${p.id}: repo moved, ${p.repo} → ${canonical} (updated)`);
    p.repo = canonical;
  }
  p.github = {
    stars: r.stargazers_count,
    pushed: String(r.pushed_at).slice(0, 10),
    archived: !!r.archived,
    licence: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
  };
}

async function checkLink(id: string, url: string) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(20_000), headers: { "user-agent": "Mozilla/5.0 (ai-rebuilds link check)" } });
    if (res.status >= 400 && res.status !== 403 && res.status !== 429) problems.push(`${id}: ${url} answered HTTP ${res.status}`);
  } catch (e) {
    problems.push(`${id}: ${url} failed (${(e as Error).message})`);
  }
}

// A few at a time keeps us well inside GitHub's rate limits.
const jobs: (() => Promise<void>)[] = [];
for (const p of data.projects) {
  jobs.push(() => refreshRepo(p));
  for (const url of [p.url, p.writeup]) if (url) jobs.push(() => checkLink(p.id, url));
}
for (const s of data.sources) jobs.push(() => checkLink(`source "${s.name}"`, s.url));
for (let i = 0; i < jobs.length; i += 8) await Promise.all(jobs.slice(i, i + 8).map((j) => j()));

data.refreshed = new Date().toISOString().slice(0, 10);
await Bun.write(DATA, JSON.stringify(data, null, 2) + "\n");
const changed = await sync(data);

const report = [
  `Refreshed ${data.projects.filter((p) => p.github).length} GitHub repos on ${data.refreshed}. Re-rendered: ${changed.join(", ") || "nothing"}.`,
  ...(problems.length ? ["", "Needs a look:", ...problems.map((p) => `- ${p}`)] : ["All links answered."]),
].join("\n");
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n");
