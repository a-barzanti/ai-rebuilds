#!/usr/bin/env bun
// Writes the generated parts of index.html and README.md from data/projects.json.
// Run it after editing the data: `bun run sync`.
import { join } from "node:path";
import { renderIndex, renderReadme, type Data } from "./render.ts";

export const ROOT = join(import.meta.dir, "..");
export const DATA = join(ROOT, "data/projects.json");

export async function loadData(): Promise<Data> {
  return Bun.file(DATA).json();
}

const RENDERERS = { "index.html": renderIndex, "README.md": renderReadme } as const;

/** The full text a generated file should have. */
export async function renderFile(file: keyof typeof RENDERERS, data: Data) {
  return RENDERERS[file](await Bun.file(join(ROOT, file)).text(), data);
}

/** Returns the files whose generated content changed (and writes them unless `dryRun`). */
export async function sync(data: Data, dryRun = false) {
  const changed: (keyof typeof RENDERERS)[] = [];
  for (const file of Object.keys(RENDERERS) as (keyof typeof RENDERERS)[]) {
    const path = join(ROOT, file);
    const before = await Bun.file(path).text();
    const after = await renderFile(file, data);
    if (after !== before) {
      changed.push(file);
      if (!dryRun) await Bun.write(path, after);
    }
  }
  return changed;
}

if (import.meta.main) {
  const changed = await sync(await loadData());
  console.log(changed.length ? `✓ updated ${changed.join(", ")}` : "✓ already in sync");
}
