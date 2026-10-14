# AI Rebuilds

**Abandoned games, rebuilt for the open web.** → [ai-rebuilds.com](https://ai-rebuilds.com)

A community-run collection of projects that bring back abandonware and legacy games. Contributors use AI agents
and [REA](https://github.com/morluto/rea) to work out how each game behaves, write that up as specs, and then
build a new version from the specs that runs in any browser.

## How it's organized

```text
projects/<slug>/          one folder per game, maintained on its own
  index.md                project page; front matter drives the site (status, platforms, help wanted)
  notes/                  behavior specs written from REA findings
  play/                   the browser rebuild, served at /projects/<slug>/play/
projects/_template/       copy this to start a new project
guide.md                  the rebuild workflow (/guide/)
CONTRIBUTING.md           how to contribute + ground rules (/contribute/)
_layouts, _includes,      site chrome (Jekyll, no JS framework)
assets/
_plugins/                 build-time validation of project front matter
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), especially the **ground rules**. In short: never commit original game
files, commit specs and not decompiled code, and rebuilds load assets from the player's own copy.

```sh
cp -r projects/_template projects/my-game
bundle install && bundle exec jekyll serve --livereload
```

## Deployment

Every push to `main` is built and deployed to GitHub Pages by `.github/workflows/pages.yml`.
Pull requests run the same build, which also validates project front matter and checks for game binaries.

## License

MIT for this repository's code and docs. Original games and their assets belong to their rights holders and are not distributed here.
