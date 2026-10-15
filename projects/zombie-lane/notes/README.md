# Notes

Write specs here, one Markdown file per system (game loop, input, save format, asset format, AI, ...).

A good spec describes **behavior**, not code. For example: "Zombies spawn every 12 s on lane edges, at most 6 at
once, and the cap goes up by 1 per player level." Cite the REA evidence each claim rests on, such as the
function address, class/method name or capture, so someone else can check it.

Do **not** paste decompiled source here. Short identifiers, constants, struct layouts and file-format tables are fine.

REA evidence bundles exported with `export_evidence_bundle` can go in `../evidence/`, as long as they
contain no copyrighted code or assets.

## Index

| Spec | Covers |
| ---- | ------ |
| [architecture.md](architecture.md) | Code layers, main loop and time step, game-engine states, startup steps, offline behavior, rendering model |
| [resource-formats.md](resource-formats.md) | Indexed table container, resource/text IDs, text tables, config, the `r1` map, data-table encoding, audio |
| [sprites-and-animations.md](sprites-and-animations.md) | Texture bundles, image references, animation/frame/timeline layout, HD/SD variants, server-only art |
| [scenes-and-saves.md](scenes-and-saves.md) | Item tables, scene layouts, the saved scene record and its storage, isometric projection, draw order, idle animations |
| [online-dependencies.md](online-dependencies.md) | Game server API, third-party SDKs, what the rebuild replaces |
| [evidence.md](evidence.md) | REA evidence IDs behind every claim |

The scripts in [../tools](../tools/) check these specs against your own APK.
