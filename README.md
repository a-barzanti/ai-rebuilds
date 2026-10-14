# AI Rebuilds

**Abandoned games, rebuilt for the open web.** → [ai-rebuilds.com](https://ai-rebuilds.com)

A community-run collection of projects that bring back abandonware and legacy games. Contributors use AI agents
and [REA](https://github.com/morluto/rea) to work out how each game behaves, write that up as specs, and then
build a new version from the specs that runs in any browser.

## How it's organized

Plain HTML, CSS and JavaScript. No framework and no build step.

```text
index.html                 home: how it works, project grid (rendered from projects.json)
guide/index.html           the REA rebuild workflow
contribute/index.html      how to contribute + ground rules
projects/projects.json     one entry per game: status, facts, help wanted
projects/<slug>/
  index.html               project page (hand-written)
  notes/                   behavior specs written from REA findings
  play/                    the browser rebuild, served at /projects/<slug>/play/
projects/_template/        copy this to start a new project
assets/                    shared CSS, JS, favicon
scripts/check.ts           Bun script run by CI: validates projects.json, blocks game files
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md), especially the **ground rules**. In short: never commit original game
files, commit specs and not decompiled code, and rebuilds load assets from the player's own copy.

```sh
cp -r projects/_template projects/my-game   # then add it to projects/projects.json
bun run dev                                 # http://localhost:3000
bun run check
```

## Deployment

GitHub Pages serves the `main` branch as-is (`.nojekyll`), on the custom domain in `CNAME`.
`.github/workflows/check.yml` runs `bun run check` on every push and pull request.

## License

MIT for this repository's code and docs. Original games and their assets belong to their rights holders and are not distributed here.
