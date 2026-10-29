# Contributing to AI Rebuilds

The full guide is on the site: **[ai-rebuilds.com/contribute](https://ai-rebuilds.com/contribute/)**.

## Suggest a project (no code)

Open the [suggestion form](https://github.com/a-barzanti/ai-rebuilds/issues/new?template=suggest-project.yml).

## Add a project yourself

1. Add an object to `"projects"` in [`data/projects.json`](data/projects.json). See the
   [field reference](https://ai-rebuilds.com/contribute/#fields).
2. Set `"added"` on your entry, and `"updated"` at the top of the file, to today's date (`YYYY-MM-DD`).
3. `bun run sync` regenerates the list in `index.html` and `README.md`.
4. `bun run check`, then open a pull request.

If you can't run Bun, open the pull request anyway and say so. A maintainer will run the sync for you.

## What gets in

- It rebuilds something that already exists: an app, an engine, a protocol or a game.
- It's public: source code, a usable build, or a detailed write-up.
- It doesn't distribute the original's code, binaries, ROMs or assets, or link to pirated copies.
- AI involvement is labelled the way its authors describe it.

Listing is not endorsement. Rights holders and project maintainers can ask for changes or removal through the
[fix an entry](https://github.com/a-barzanti/ai-rebuilds/issues/new?template=fix-entry.yml) form.

## Local preview

```sh
bun run dev     # http://localhost:3000
bun run check
```
