<p align="center"><a href="https://ai-rebuilds.com"><img src="assets/logo-512.png" width="96" height="96" alt="AI Rebuilds"></a></p>

# AI Rebuilds

**A tracked list of software and games rebuilt from the outside in.** It covers apps written by AI agents, game
decompilations finished with Claude, engine reimplementations, and the clean-room classics that came first.

**[Browse, search and filter it at ai-rebuilds.com →](https://ai-rebuilds.com)**

[![List updated](https://img.shields.io/github/last-commit/a-barzanti/ai-rebuilds/main?path=data%2Fprojects.json&label=list%20updated)](data/projects.json)
[![Stars](https://img.shields.io/github/stars/a-barzanti/ai-rebuilds?style=flat)](https://github.com/a-barzanti/ai-rebuilds/stargazers)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-0d6a57)](CONTRIBUTING.md)

Every entry says what it rebuilds, how it was done (clean-room, reimplementation, decompilation, port…) and whether AI
was involved. GitHub stars and last-commit dates are refreshed automatically every week. Want to make your own? Read
the guide to [rebuilding software with REA](https://ai-rebuilds.com/guide/), the open-source reverse-engineering
toolkit for AI agents.

If this list is useful to you, **star the repo**. It helps other people find it.

## The list

<!-- list:start -->
_81 projects. List updated 29 Oct 2026; GitHub stars refreshed 29 Oct 2026. Browse, search and filter it at [ai-rebuilds.com](https://ai-rebuilds.com)._

- [ArtCraft Crafting Apps](#artcraft-crafting-apps)
- [Software rebuilt with AI](#software-rebuilt-with-ai)
- [Games rebuilt with AI](#games-rebuilt-with-ai)
- [Game engine reimplementations](#game-engine-reimplementations)
- [Decompilations and recompilations](#decompilations-and-recompilations)
- [Clean-room classics](#clean-room-classics)
- [Tools for rebuilders](#tools-for-rebuilders)

### ArtCraft Crafting Apps

A suite of desktop apps, each rebuilding a well-known creative or office tool from scratch in Rust. The authors describe them as clean-room reimplementations written predominantly by Claude Code and other AI agents.

- **[PhotoCraft](https://github.com/storytold/photocraft)**: rebuilds Adobe Photoshop. A layer-based photo editor written from scratch in Rust. _AI-built, Clean-room, ★ 74.6k_
- **[ArtCraft](https://getartcraft.com)**: rebuilds Adobe Creative Cloud and Microsoft Office. The umbrella project and launcher for the Crafting Apps below. ([write-up](https://www.phoronix.com/news/Photocraft-Filmcraft-AI)) _AI-built, Clean-room, ★ 37.5k_
- **[PdfCraft](https://github.com/storytold/pdfcraft)**: rebuilds Adobe Acrobat. A PDF reader and editor written from scratch in Rust. _AI-built, Clean-room, ★ 18.5k_
- **[FilmCraft](https://github.com/storytold/filmcraft)**: rebuilds Adobe Premiere Pro. A nonlinear video editor written from scratch in Rust. _AI-built, Clean-room, ★ 16.8k_
- **[WordCraft](https://github.com/storytold/wordcraft)**: rebuilds Microsoft Word. A word processor, described as a clean-room reimplementation in pure Rust. _AI-built, Clean-room, ★ 16.5k_
- **[LightCraft](https://github.com/storytold/lightcraft)**: rebuilds Adobe Lightroom. A non-destructive photo developer and organizer written from scratch in Rust. _AI-built, Clean-room, ★ 15k_
- **[VectorCraft](https://github.com/storytold/vectorcraft)**: rebuilds Adobe Illustrator. A vector art tool written from scratch in Rust. _AI-built, Clean-room, ★ 11k_
- **[EffectCraft](https://github.com/storytold/effectcraft)**: rebuilds Adobe After Effects. Motion graphics and compositing, written from scratch in Rust. _AI-built, Clean-room, ★ 8.1k_
- **[CADCraft](https://github.com/storytold/cadcraft)**: rebuilds AutoCAD. Computer-aided design and drafting, described as a clean-room AutoCAD-style app in Rust. _AI-built, Clean-room, ★ 7.1k_
- **[GridCraft](https://github.com/storytold/gridcraft)**: rebuilds Microsoft Excel. A spreadsheet, described as a clean-room reimplementation in pure Rust. _AI-built, Clean-room, ★ 6.8k_
- **[DesignCraft](https://github.com/storytold/designcraft)**: rebuilds Adobe InDesign. A page layout and publishing editor written from scratch in Rust. _AI-built, Clean-room, ★ 4.9k_
- **[DeckCraft](https://github.com/storytold/deckcraft)**: rebuilds Microsoft PowerPoint. Presentations and slide shows, described as a clean-room reimplementation in pure Rust. _AI-built, Clean-room, ★ 4.4k_
- **[SoundCraft](https://github.com/storytold/soundcraft)**: rebuilds Avid Pro Tools. A digital audio workstation, described as a clean-room reimplementation in pure Rust. _AI-built, Clean-room, ★ 3.9k_
- **[FigCraft](https://github.com/storytold/figcraft)**: rebuilds Figma. Interface design and prototyping, a clean-room take on collaborative design tools in Rust. _AI-built, Clean-room, ★ 3.8k_
- **[AniCraft](https://github.com/storytold/AniCraft)**: rebuilds Adobe Animate. A 2D animation editor written from scratch in Rust. The newest app in the suite. _AI-built, Clean-room, ★ 61_

### Software rebuilt with AI

Frameworks, compilers, parsers and engines that were rebuilt, ported or rewritten mostly by coding agents, with the people directing them.

- **[Ladybird LibJS in Rust](https://github.com/LadybirdBrowser/ladybird)**: rebuilds Ladybird's C++ JavaScript engine frontend. Andreas Kling ported LibJS's lexer, parser, AST and bytecode generator from C++ to Rust in about two weeks, using Claude Code and Codex. ([write-up](https://ladybird.org/posts/adopting-rust/)) _AI-assisted, Port, ★ 66.7k_
- **[vinext](https://github.com/cloudflare/vinext)**: rebuilds Next.js. Cloudflare reimplemented the Next.js API surface on Vite in about a week, with one engineer directing AI models. ([write-up](https://blog.cloudflare.com/vinext/)) _AI-built, Reimplementation, ★ 9.3k_
- **[Claude's C Compiler](https://github.com/anthropics/claudes-c-compiler)**: rebuilds GCC, as a C compiler. Sixteen parallel Claude agents wrote a dependency-free C compiler in Rust that can build the Linux kernel. Not validated for production use. ([write-up](https://www.anthropic.com/engineering/building-c-compiler)) _AI-built, Reimplementation, ★ 2.8k_
- **[chardet 7](https://github.com/chardet/chardet)**: rebuilds chardet 6 (LGPL). An AI-driven rewrite of the Python encoding detector that changed its licence from LGPL to MIT, then 0BSD. The project's original author disputes the relicensing. It became the test case for AI clean-room claims. ([write-up](https://simonw.substack.com/p/can-coding-agents-relicense-open)) _AI-built, Rewrite, ★ 2.7k_
- **[FastRender](https://github.com/wilsonzlin/fastrender)**: rebuilds A web browser engine. An experimental browser engine written by thousands of parallel agents in Cursor's research on long-running autonomous coding. ([write-up](https://simonwillison.net/2026/Jan/23/fastrender/)) _AI-built, Reimplementation, ★ 1.6k_
- **[JustHTML](https://github.com/EmilStenstrom/justhtml)**: rebuilds html5lib. A pure-Python HTML5 parser built with coding agents against the official html5lib test suite, which it passes in full. ([write-up](https://emilstenstrom.github.io/justhtml/correctness.html)) _AI-built, Reimplementation, ★ 1.2k_
- **[justjshtml](https://github.com/simonw/justjshtml)**: rebuilds JustHTML, in JavaScript. Simon Willison had a coding agent port JustHTML to JavaScript, using the same test suite as the referee. _AI-built, Port, ★ 174_

### Games rebuilt with AI

Decompilations, recompilations and reconstructions of games where AI agents did much of the work. Every one needs your own copy of the game.

- **[Super Smash Bros. Melee decompilation](https://github.com/doldecomp/melee)**: rebuilds Super Smash Bros. Melee (GameCube, 2001). A human-led project since 2020 that finished matching all functions in 2026. AI tools proposed candidates, and some commits credit AI co-authors. _AI-assisted, Decompilation, ★ 2.4k_
- **[Super Mario 64 DS decompilation](https://github.com/tangosdev/sm64ds-decomp)**: rebuilds Super Mario 64 DS (Nintendo DS, 2004). A from-scratch, byte-matching decompilation into C and C++, nearly complete, made with Claude, Codex and other models. _AI-built, Decompilation, ★ 233_
- **[Snowboard Kids 2 decompilation](https://github.com/cdlewis/snowboardkids2-decomp)**: rebuilds Snowboard Kids 2 (N64, 1999). Chris Lewis ran Claude in an unattended loop, one function at a time, and reached a 100% matching decompilation. His blog posts made the method famous. ([write-up](https://blog.chrislewis.au/using-coding-agents-to-decompile-nintendo-64-games/)) _AI-built, Decompilation, ★ 197_
- **[Brave Fencer Musashi decompilation](https://github.com/Druthulu/BFM-decomp)**: rebuilds Brave Fencer Musashi (PlayStation, 1998). A matching decompilation whose rebuilt binaries are byte-identical to the originals. The repo documents how AI was used. ([write-up](https://github.com/Druthulu/BFM-decomp/blob/main/docs/story.md)) _AI-assisted, Decompilation, ★ 86_
- **[DX-Ball reconstruction](https://github.com/N0zoM1z0/dx-ball)**: rebuilds DX-Ball 1.07 (Windows, 1996). A coding agent driving REA reconstructs the game, checked against the original x86 with differential tests and a pinned MSVC toolchain. _AI-built, Reimplementation, ★ 78_
- **[Snowboard Kids decompilation](https://github.com/cdlewis/snowboardkids-decomp)**: rebuilds Snowboard Kids (N64, 1998). The same approach applied to the first game, again reaching 100% matching code, with several AI models. _AI-built, Decompilation, ★ 58_
- **[Little Planet](https://github.com/carl0srmz/littleplanet)**: rebuilds Sonic CD (Mega-CD, 1993). A static recompilation of Sonic CD into a native PC program. _AI-assisted, Recompilation, ★ 50_
- **[Klonoa: Empire of Dreams decompilation](https://github.com/Dream-Atelier/kl-eod-decomp)**: rebuilds Klonoa: Empire of Dreams (GBA, 2001). A matching decompilation in progress since March 2026, with Claude Code credited in its commits. _AI-assisted, Decompilation, ★ 17_

### Game engine reimplementations

Long-running community engines that play classic games on modern systems. Most load the data files from a copy you own.

- **[OpenRA](https://www.openra.net)**: rebuilds Command & Conquer, Red Alert and Dune 2000. A modern engine for early Westwood strategy games, with online play. _Reimplementation, ★ 17.7k_
- **[OpenRCT2](https://openrct2.io)**: rebuilds RollerCoaster Tycoon 2. A full reimplementation of the game with multiplayer, bigger maps and modern display support. Uses the data files from your copy. _Reimplementation, ★ 16.5k_
- **[openage](https://github.com/SFTtech/openage)**: rebuilds Age of Empires II. A free engine clone of Age of Empires and its successors. _Reimplementation, ★ 14.6k_
- **[DevilutionX](https://github.com/diasurgical/DevilutionX)**: rebuilds Diablo and Hellfire. Diablo for modern systems, built from reconstructed source code. Needs the data file from your copy. _Port, ★ 10k_
- **[OpenTTD](https://www.openttd.org)**: rebuilds Transport Tycoon Deluxe. Started as a reimplementation and grew into its own game. It runs on free replacement graphics and sound, so you don't need the original. _Reimplementation, ★ 8.4k_
- **[OpenMW](https://openmw.org)**: rebuilds The Elder Scrolls III: Morrowind. A new open-world RPG engine that plays Morrowind from your own data files. _Reimplementation, ★ 6.7k_
- **[VCMI](https://vcmi.eu)**: rebuilds Heroes of Might and Magic III. An open engine for Heroes III with mod support and new features. _Reimplementation, ★ 6k_
- **[OpenLara](https://github.com/XProger/OpenLara)**: rebuilds Tomb Raider (1996). A classic Tomb Raider engine that runs on everything from browsers to old consoles. _Reimplementation, ★ 5.1k_
- **[CorsixTH](https://github.com/CorsixTH/CorsixTH)**: rebuilds Theme Hospital. An open-source clone of Theme Hospital's engine, using the original game's data. _Reimplementation, ★ 4.6k_
- **[fheroes2](https://github.com/ihhub/fheroes2)**: rebuilds Heroes of Might and Magic II. A recreation of the Heroes II engine with modern resolutions and quality-of-life fixes. _Reimplementation, ★ 3.7k_
- **[Julius](https://github.com/bvschaik/julius)**: rebuilds Caesar III. Reimplements Caesar III exactly, keeping the original gameplay. _Reimplementation, ★ 3.4k_
- **[ScummVM](https://www.scummvm.org)**: rebuilds LucasArts SCUMM and hundreds of other adventure engines. A collection of reimplemented point-and-click engines. Several games it supports are legally free to download. _Reimplementation, ★ 2.9k_
- **[OpenXcom](https://openxcom.org)**: rebuilds UFO: Enemy Unknown (X-COM) and Terror from the Deep. An open-source clone of the original X-COM, with a large modding scene. _Reimplementation, ★ 2.2k_
- **[Augustus](https://github.com/Keriew/augustus)**: rebuilds Caesar III. A fork of Julius that adds gameplay changes and new features. _Reimplementation, ★ 2.1k_
- **[OpenSAGE](https://github.com/OpenSAGE/OpenSAGE)**: rebuilds EA's SAGE engine (Command & Conquer: Generals). A reimplementation of the 3D strategy engine behind Generals and its successors. _Reimplementation, ★ 1.7k_
- **[Freedoom](https://freedoom.github.io)**: rebuilds Doom's game data. Complete free replacement art, sound and levels for any Doom engine. It shows how a project can avoid the original assets altogether. _Reimplementation, ★ 1.4k_
- **[GemRB](https://gemrb.org)**: rebuilds BioWare's Infinity Engine (Baldur's Gate, Planescape: Torment). A portable implementation of the Infinity Engine. _Reimplementation, ★ 1.3k_
- **[Falltergeist](https://github.com/falltergeist/falltergeist)**: rebuilds Fallout 2. A cross-platform Fallout 2 engine in C++. Development has been quiet since 2023. _Reimplementation, ★ 886_
- **[Exult](https://exult.info)**: rebuilds Ultima VII. Recreates Ultima VII and its expansion for modern systems from the original data files. _Reimplementation, ★ 702_
- **[Open Fodder](https://github.com/OpenFodder/openfodder)**: rebuilds Cannon Fodder. An open-source engine for Cannon Fodder that also runs the free demo data. _Reimplementation, ★ 614_

### Decompilations and recompilations

Human-led projects that turned console games back into buildable source code or native PC programs. They ship no game assets.

- **[Super Mario 64 decompilation](https://github.com/n64decomp/sm64)**: rebuilds Super Mario 64 (N64, 1996). The landmark matching decompilation that started the modern decomp scene and led to PC ports. _Decompilation, ★ 8.9k_
- **[Zelda64Recomp](https://github.com/Zelda64Recomp/Zelda64Recomp)**: rebuilds The Legend of Zelda: Majora's Mask (N64, 2000). A static recompilation into a native PC program, with high frame rates and widescreen support. _Recompilation, ★ 7.6k_
- **[Ship of Harkinian](https://github.com/HarbourMasters/Shipwright)**: rebuilds The Legend of Zelda: Ocarina of Time (N64, 1998). A PC port built on the Ocarina of Time decompilation. It reads the assets from your own ROM. _Port, ★ 5.8k_
- **[Ocarina of Time decompilation](https://github.com/zeldaret/oot)**: rebuilds The Legend of Zelda: Ocarina of Time (N64, 1998). A matching decompilation by the zeldaret team. _Decompilation, ★ 5.6k_
- **[2 Ship 2 Harkinian](https://github.com/2ship2harkinian/2ship2harkinian)**: rebuilds The Legend of Zelda: Majora's Mask (N64, 2000). A PC port of Majora's Mask built on its decompilation. _Port, ★ 2.4k_
- **[Perfect Dark PC port](https://github.com/perfect-dark-pc-port/perfect_dark)**: rebuilds Perfect Dark (N64, 2000). A port of the Perfect Dark decompilation to modern platforms. _Port, ★ 2.1k_

### Clean-room classics

Famous independent reimplementations, from the BIOS that made PC clones possible to a Photoshop-compatible editor in the browser.

- **[ReactOS](https://reactos.org)**: rebuilds Windows NT. A free Windows-compatible operating system. It audited its own code to keep it clean-room. _Clean-room, ★ 18.4k_
- **[Mono](https://www.mono-project.com)**: rebuilds Microsoft .NET Framework. An open implementation of .NET from the published ECMA standards. It is now looked after by the Wine project. _Reimplementation, ★ 11.5k_
- **[Photopea](https://www.photopea.com)**: rebuilds Adobe Photoshop. One developer's browser-based editor that opens and saves PSD files. It began as a PSD viewer and is written from scratch in plain JavaScript. ([write-up](https://blog.photopea.com/creating-photopea.html)) _Reimplementation, ★ 8.5k_
- **[Wine](https://www.winehq.org)**: rebuilds The Windows API. Runs Windows programs on Linux and macOS by reimplementing Windows itself. It is also what Steam's Proton is built on. _Clean-room, ★ 4.3k_
- **[Asahi Linux](https://asahilinux.org)**: rebuilds Drivers for Apple Silicon Macs. Reverse-engineered Apple's undocumented GPU and hardware to run Linux on M-series Macs. _Reimplementation, ★ 3k_
- **[Haiku](https://www.haiku-os.org)**: rebuilds BeOS. An operating system that reimplements BeOS and runs its applications. _Reimplementation, ★ 2.4k_
- **[Samba](https://www.samba.org)**: rebuilds Windows file sharing (SMB) and Active Directory. Reimplemented Microsoft's networking protocols by watching them on the wire. _Clean-room, ★ 1.1k_
- **[FreeDOS](https://www.freedos.org)**: rebuilds MS-DOS. A complete DOS-compatible operating system, still used to run old games and firmware tools. _Reimplementation, ★ 1.1k_
- **[AROS](https://aros.sourceforge.io)**: rebuilds AmigaOS 3.1. A portable reimplementation of the AmigaOS 3.1 programming interfaces. _Reimplementation, ★ 519_
- **[Apache Harmony](https://harmony.apache.org)**: rebuilds Java SE. A clean-room Java class library whose code lived on in Android. The project was retired in 2011. _Clean-room, ★ 95_
- **[Nouveau](https://nouveau.freedesktop.org)**: rebuilds NVIDIA's graphics drivers. Open-source NVIDIA drivers, built by tracing what the proprietary driver does. _Reimplementation_
- **[Phoenix BIOS](https://en.wikipedia.org/wiki/Clean-room_design)**: rebuilds The IBM PC BIOS. The textbook clean-room project. One team described the IBM BIOS and a separate team that had never seen it wrote new code. That made PC clones possible. Compaq did the same for its own machines a year earlier. _Clean-room_

### Tools for rebuilders

What people use to study the original and check the rebuild against it: decompilers, AI bridges, matching and diffing tools.

- **[REA](https://github.com/morluto/rea)**: rebuilds Reverse engineering for AI agents. Gives a coding agent tools to study apps and binaries, including APKs, native code, .NET, Electron and web pages. Every finding cites its evidence. The DX-Ball reconstruction above uses it. _Tool, ★ 405k_
- **[Ghidra](https://github.com/NationalSecurityAgency/ghidra)**: rebuilds Disassembler and decompiler. The NSA's free reverse-engineering suite, with disassembly, pseudocode and scripting. _Tool, ★ 95.6k_
- **[jadx](https://github.com/skylot/jadx)**: rebuilds Android app decompiler. Decompiles DEX and APK files to readable Java. _Tool, ★ 51.4k_
- **[IDA Pro MCP](https://github.com/mrexodia/ida-pro-mcp)**: rebuilds IDA Pro, for AI agents. Connects IDA Pro to language models over MCP. _Tool, ★ 13.2k_
- **[GhidraMCP](https://github.com/LaurieWired/GhidraMCP)**: rebuilds Ghidra, for AI agents. An MCP server that lets an AI model drive Ghidra. _Tool, ★ 11.6k_
- **[N64Recomp](https://github.com/N64Recomp/N64Recomp)**: rebuilds N64 static recompiler. Turns N64 game code into C that compiles to a native program. Zelda64Recomp is built with it. _Tool, ★ 8.3k_
- **[GhidrAssist](https://github.com/symgraph/GhidrAssist)**: rebuilds LLM help inside Ghidra. A Ghidra extension that explains functions and suggests names with an LLM. _Tool, ★ 773_
- **[m2c](https://github.com/matt-kempster/m2c)**: rebuilds Assembly to C. A decompiler that turns MIPS, PowerPC, ARM and SuperH assembly into a first draft of C. _Tool, ★ 668_
- **[decomp.me](https://decomp.me)**: rebuilds Shared matching decompilation. Paste a function and work with others in the browser until the compiled output matches the original. _Tool, ★ 643_
- **[objdiff](https://github.com/encounter/objdiff)**: rebuilds Object file diffing. A local tool that diffs your compiled code against the original, used by most decompilation projects. _Tool, ★ 610_
- **[decomp.wtf](https://github.com/i12bp8/decomp.wtf)**: rebuilds Agent-driven matching decompilation. A command-line tool that lets Claude Code and similar agents decompile GameCube and Wii games you own, function by function. Its author archived it in October 2026. _Tool, ★ 543_
- **[splat](https://github.com/ethteck/splat)**: rebuilds Binary splitter. Splits a ROM into code and asset files to start a decompilation. _Tool, ★ 374_
- **[decomp-permuter](https://github.com/simonlindholm/decomp-permuter)**: rebuilds Match finder. Randomly rewrites C code to find a version that compiles to the original bytes. _Tool, ★ 238_

### Sources and credits

We found many of these projects through the lists below. The descriptions here are our own.

- [awesome-game-remakes](https://github.com/radek-sprta/awesome-game-remakes) by Radek Sprta (CC BY-SA 4.0). Used for: Game engine reimplementations.
- [Open Source Game Clones](https://osgameclones.com) by opengaming. Used for: Game engine reimplementations.
- [open-source-games](https://github.com/bobeff/open-source-games) by bobeff (CC0 1.0). Used for: Game engine reimplementations.
- [List of game engine recreations](https://en.wikipedia.org/wiki/List_of_game_engine_recreations) by Wikipedia (CC BY-SA 4.0). Used for: Game engine reimplementations.
- [AI reverse engineered games](https://reversedwithai.com/ai-game-decompilation) by reversedwithai.com. Used for: Games rebuilt with AI.
- [AI-assisted decompilation for retro games](https://www.retroreversing.com/ai-assisted-decompilation) by Retro Reversing. Used for: Games rebuilt with AI, tools.
- [Which games has AI decompiled? The verified list](https://capitalandcompute.net/md/which-games-has-ai-decompiled.md) by Capital and Compute. Used for: Games rebuilt with AI.
- [decomp.dev](https://decomp.dev) by encounter. Used for: Decompilation progress.
- [clean-room-reimplementation topic](https://github.com/topics/clean-room-reimplementation) by GitHub. Used for: Software rebuilt with AI.
- [AI makes open-source clean-room implementations of Photoshop and Premiere](https://www.phoronix.com/news/Photocraft-Filmcraft-AI) by Phoronix. Used for: ArtCraft Crafting Apps.

### Related directories

Other lists that track rebuilds, reimplementations and decompilations. Worth browsing and starring.

- [Remade](https://remade.wiki) by replicraft. Community directory of open-source reimplementations of closed-source apps, mostly creative and productivity tools.
- [Awesome REA](https://awesomerea.org) by reacher-z. Bilingual, searchable catalog of reverse-engineering tools, reconstruction projects, case studies and research.
- [Awesome Reverse Engineering](https://github.com/morluto/awesome-reverse-engineering) by morluto. Task-oriented list of reverse-engineering tools and learning resources, by REA's maintainer.
- [Awesome Decomp Games](https://submitgame.github.io/awesome-decomp-games/) by SubmitGame. Rated index of game decompilations, recompilations, source ports and engine remakes.
- [awesome-game-decompilations](https://github.com/CharlotteCross1998/awesome-game-decompilations) by CharlotteCross1998. Hundreds of game decompilation and recompilation projects, grouped by console.
- [awesome-unofficial-pc-ports](https://github.com/Sebastrion/awesome-unofficial-pc-ports) by Sebastrion. Player-friendly guide to unofficial PC ports of console games.
- [Awesome REA Cases](https://github.com/songshikang0111/awesome-REA-cases) by songshikang0111. AI-assisted reverse-engineering case studies, separating reported from reproduced results.
- [awesome-rea](https://github.com/yibie/awesome-rea) by yibie. AI-assisted game decompilations and ports organized around their stated acceptance checks, plus practitioner write-ups.
<!-- list:end -->

## Contributing

Add a project by filling in the [suggestion form](https://github.com/a-barzanti/ai-rebuilds/issues/new?template=suggest-project.yml),
or edit [`data/projects.json`](data/projects.json) and open a pull request. The steps and fields are in
[CONTRIBUTING.md](CONTRIBUTING.md).

## How it works

Plain HTML, CSS and JavaScript with no framework and no build step. [Bun](https://bun.sh) runs the scripts.

```text
data/projects.json       the list: categories, projects, sources
index.html               home page; the list inside it is generated
README.md                this file; the list above is generated
scripts/render.ts        data → HTML and Markdown
scripts/sync.ts          writes the generated parts (bun run sync)
scripts/check.ts         validates the data, checks the generated parts are current (bun run check)
scripts/refresh.ts       updates GitHub stars and activity, checks links (bun run refresh)
guide/  contribute/  privacy/
docs/promotion.md        promotion plan, status and ready-to-paste posts
```

`.github/workflows/site.yml` checks and deploys to GitHub Pages on every push to `main`.
`.github/workflows/refresh.yml` runs `bun run refresh` every Monday, commits the result, and that triggers a deploy.

## License

The code and the list are MIT licensed. Listed projects belong to their authors. Descriptions are our own; see the
sources and credits above for the lists that helped us find them.
