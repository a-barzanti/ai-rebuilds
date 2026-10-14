---
layout: page
title: Rebuild guide
summary: How to take a game from "won't run anymore" to "playable in the browser" with an AI agent and REA.
permalink: /guide/
---

This is how every project here works. Each project can choose its own tools, stack and pace, but they all
go through the same four steps. The rule that matters most is to **study the original, write down what it
does, and then build a new version from what you wrote down.**

## 1. Set up REA

[REA](https://github.com/morluto/rea) ("Reverse Engineer Anything") is an open-source MCP server. It gives
an AI agent such as Claude Code, Codex, Cursor or Gemini CLI tools to inspect software, and every finding
comes with its evidence. Analysis runs on your machine.

You need Node.js 22.19+, 24.11+ or 26+. Then:

```sh
# Register REA with your agent(s) and install its workflow instructions
npx rea-agents setup

# Optional: install the CLI globally
npm install --global rea-agents
rea --help
```

Native binaries (DOS/Windows EXEs, native mobile libraries, console executables) need a disassembler that REA
can drive: [Ghidra](https://ghidra-sre.org/) (free), Hopper or IDA. JavaScript, Electron, WASM, .NET, Android
APKs and websites can be analyzed without one. Some formats need extra tools. See the REA README for the full list.

> Only get REA from its official sources: the `morluto/rea` repository, rea.tools, or the `rea-agents` npm package.

## 2. Pick the right starting point

Different games need different tools. Start from whatever the game was built with:

| Original                         | Where to start                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| Android APK (Java/Kotlin)        | `inspect_android_package`, `search_android_classes`, `inspect_android_method`, `decode_android_resources` |
| Native EXE / ELF / Mach-O        | `binary_overview`, `list_procedures`, `procedure_pseudo_code`, `get_call_graph`                      |
| .NET / Unity (Mono)              | `inspect_managed_artifact`, `inspect_managed_members`                                              |
| Flash-era / HTML5 / Electron     | `analyze_javascript_application`, `analyze_web_bundle`, `recover_javascript_sources`                |
| Unknown container or data file   | `inspect_artifact`, `extract_artifact`, `list_strings`, `read_bytes`                                |

You can also run a quick check from the terminal without an agent:

```sh
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

## 3. Analyze: ask questions, write specs

Work one system at a time. Good prompts to give your agent:

- *"Using REA, find the main game loop in this APK. What is the tick rate, and what does each tick update?"*
- *"Trace what happens when the player places a building. Which checks run, and what state changes?"*
- *"Work out the layout of `assets/l0_0`. Give me a table of the header fields and how entries are indexed."*
- *"List every network call the game makes at startup, and what the game does when each one fails."*
- *"Record anything you couldn't resolve as an unknown so we can come back to it."*

REA can keep a list of what a rebuild needs to cover and check the rebuild against it, with tools such as
`record_unknown`, `build_reconstruction_obligation_ledger` and `evaluate_reconstruction_coverage`.
Use them to track what's left.

Turn the answers into specs under `projects/<slug>/notes/`, one Markdown file per system.
A spec describes **behavior** (rules, timings, formats, edge cases) and cites the evidence behind each claim.
**Do not commit decompiled code.** Constants, struct layouts and file-format tables are fine.

## 4. Rebuild for the web

Write the new version from the specs, in whatever stack fits the game:

- **Small 2D games:** plain HTML5 Canvas + JavaScript/TypeScript. The project template has a starter in `play/`.
- **Bigger games:** a separate repository with its own build (Vite, Phaser, PixiJS, Rust→WASM, …). Set
  `repo:` and `play:` in the project's front matter so the site links to it.
- **Assets:** load them in the browser from the player's own copy of the original (File API, never uploaded),
  or make new ones. Never commit the original assets.

## 5. Verify

Record the original (screenshots, input/output traces, save files) and compare it to the rebuild.
REA's capture and compare tools (`capture_browser_scenario`, `compare_web_captures`,
`compare_web_screenshots`, `verify_reconstruction`) help when both run somewhere it can observe.
When the rebuild matches well enough to play, set the project's status to `playable`.

## Project layout

```text
projects/<slug>/
├── index.md      # the project page; its front matter drives the cards and status
├── notes/        # behavior specs written from REA findings
├── evidence/     # optional: exported REA evidence bundles (no copyrighted code or assets)
└── play/         # the browser rebuild, served at /projects/<slug>/play/
```

Ready? [Start a project →](/contribute/#start-a-new-project)
