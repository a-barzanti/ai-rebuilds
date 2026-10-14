# Contributing to AI Rebuilds

Thanks for helping bring old games back. Everyone can take part: reverse engineers, web developers, artists,
historians, and people who just remember how a game played. This file is also published at
[ai-rebuilds.com/contribute](https://ai-rebuilds.com/contribute/).

## Ways to help

- **Propose a game.** Open a [new project issue](https://github.com/a-barzanti/ai-rebuilds/issues/new?template=new-project.yml) or send the project folder as a pull request.
- **Analyze.** Run [REA](https://github.com/morluto/rea) on a game you own and write up what you find as specs in a project's `notes/`.
- **Rebuild.** Implement specs in a project's `play/` folder, or in its own repository.
- **Verify.** Play the original and the rebuild next to each other and report differences.
- **Research.** Fill in history, versions and rights status on project pages.

Every project page has a **Help wanted** list. Those are good first tasks.

## Start a new project

1. Search the [projects](https://ai-rebuilds.com/#projects) and [issues](https://github.com/a-barzanti/ai-rebuilds/issues) to make sure the game isn't already covered.
2. Fork the repo and copy the template:
   ```sh
   cp -r projects/_template projects/your-game-slug
   ```
   Use a lowercase slug with dashes, such as `zombie-lane` or `dark-reign-2`.
3. Fill in the front matter in `projects/your-game-slug/index.md`. `title`, `summary`, `status`
   and `original.platforms` are required. The build checks them.
4. Add yourself to `maintainers` if you plan to lead it. You can also leave it empty for someone else to pick up.
5. Open a pull request. Once it merges, the project gets its own page and a card on the home page.

Each project is self-contained. Maintainers decide their stack, structure and roadmap. Changes outside
a project folder (layouts, styles, docs) are reviewed by the site maintainers.

## Project front matter

```yaml
layout: project
title: Game Title
summary: One sentence.
status: proposed          # proposed | analysis | rebuilding | playable | complete
original:
  developer: Studio
  publisher: Publisher    # optional
  year: 1999
  platforms: [Windows]
target: HTML5 Canvas + TypeScript
play: play/               # or a full URL, once something runs
repo:                     # optional separate repository
maintainers: [your-github-username]
tags: [strategy]
help_wanted:
  - A task someone could pick up
```

## Ground rules

These rules protect the project and the people who made the original games. Pull requests that break them will be closed.

1. **Never commit original game files.** That means binaries, ROMs, APKs, ISOs, extracted art, audio, maps or text.
   `.gitignore` blocks common formats and CI rejects them, but you are still responsible.
2. **Commit specs, not decompiled code.** Notes describe behavior and file formats in your own words, with
   evidence references. Short identifiers, constants and format tables are fine. Pages of decompiled
   functions are not.
3. **Write rebuilds from scratch.** Implement from the specs. Do not translate decompiled code line by line.
4. **Bring your own copy.** A rebuild either loads original assets locally from the player's own files
   (in the browser, never uploaded) or uses new assets with a compatible license.
5. **"Abandonware" has no legal meaning.** Record what is known about each game's rights status. If a
   rights holder asks for a project to be removed, it will be removed promptly, without argument. Contact the
   maintainers through a [GitHub issue](https://github.com/a-barzanti/ai-rebuilds/issues) or privately via the
   repository owner's profile.
6. **No cheating, piracy or DRM-bypass tools.** The goal is preservation and playability, not getting around
   protections on games that are still sold.
7. **Be kind.** Critique work, not people. Harassment of any kind is not tolerated.

## Running the site locally

The site is plain [Jekyll](https://jekyllrb.com/). You need Ruby 3.2+ and Bundler.

```sh
bundle install
bundle exec jekyll serve --livereload
# open http://localhost:4000
```

The build fails with a clear message if a project's front matter is invalid. CI runs the same check on every pull request.

## Using AI responsibly

AI agents do most of the analysis here, and they can be wrong. Before you commit a finding:

- Make sure every claim in a spec points to REA evidence (an address, method, capture or file offset).
- Mark guesses as guesses, and keep open questions in the spec's "Unknowns" section.
- Read and understand the code you commit. You are its author.

## License

Site code and docs are MIT-licensed (see [`LICENSE`](LICENSE)). Each project's code is MIT by default unless its
folder includes a different `LICENSE`. Contributors keep the copyright to their contributions.
