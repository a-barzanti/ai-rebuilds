# Contributing to AI Rebuilds

The full guide is on the site: **[ai-rebuilds.com/contribute](https://ai-rebuilds.com/contribute/)**
(source: [`contribute/index.html`](contribute/index.html)). The essentials are below.

## Start a new project

1. Check the [projects](https://ai-rebuilds.com/#projects) and [issues](https://github.com/a-barzanti/ai-rebuilds/issues) to make sure the game isn't already covered.
2. `cp -r projects/_template projects/your-game-slug` (lowercase, dashes)
3. Add an entry to [`projects/projects.json`](projects/projects.json). The home page cards and each project's
   status, facts and help-wanted list are rendered from it.
4. Fill in `projects/your-game-slug/index.html`: replace `your-game-slug` and `Game Title`, then write the history and build details.
5. `bun run check`, then open a pull request.

Each project folder belongs to its maintainers. They choose the stack, structure and roadmap.

## Ground rules

1. **Never commit original game files.** That includes binaries, ROMs, APKs, ISOs and extracted assets. CI rejects common formats.
2. **Commit specs, not decompiled code.** Describe behavior and formats in your own words and cite REA evidence.
3. **Write rebuilds from scratch**, working from the specs.
4. **Bring your own copy.** Rebuilds load original assets from the player's own files in the browser, or use new assets.
5. **"Abandonware" has no legal meaning.** If a rights holder asks, the project is removed promptly.
6. **No cheating, piracy or DRM-bypass tools.**
7. **Be kind.**

## Local preview

The site is plain HTML/CSS/JS with no build step. You only need [Bun](https://bun.sh) for the dev server and checks:

```sh
bun run dev     # http://localhost:3000
bun run check   # validate projects.json, forbid game files
```

Any static server works too, e.g. `python3 -m http.server`.
