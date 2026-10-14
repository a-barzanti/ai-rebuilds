---
# Copy this whole folder to projects/<your-game-slug>/ and fill in the fields.
# Folders starting with "_" are not published, so this template never shows up on the site.
layout: project
title: Game Title
summary: One sentence. What the game is and why it needs a rebuild.
status: proposed # proposed | analysis | rebuilding | playable | complete
original:
  developer: Studio Name
  publisher: Publisher Name # optional
  year: 1999
  platforms: [Windows] # e.g. [DOS], [Android, iOS], [Flash], [Facebook]
target: HTML5 Canvas + vanilla JS # the stack used for the rebuild
play: # "play/" once play/index.html works, or a full URL if hosted elsewhere
repo: # optional: a separate repository if the rebuild needs its own build pipeline
maintainers: [] # GitHub usernames without the @, e.g. [octocat]
tags: [] # e.g. [strategy, isometric, multiplayer]
help_wanted:
  - Identify the exact build and version people still have
  - Map the asset formats with REA
---

## About the original

What the game was, who made it, when and why it stopped running (store delisting, servers shut down,
platform discontinued, etc.). Link to sources such as Wikipedia, MobyGames or archived pages.

**Rights status:** what you know about who holds the rights today. "Unknown" is a valid answer. Do not guess.

## Which build we target

| Field    | Value                            |
| -------- | -------------------------------- |
| Version  | e.g. 1.0.33                      |
| Platform | e.g. Android (armeabi)           |
| Format   | e.g. APK, Dalvik bytecode        |
| Hash     | SHA-256 of the original file     |

Record a hash so other contributors can check they have the same build. **Never commit the file itself.**

## Findings

Short summaries of what REA showed, each linking to a spec in [`notes/`](notes/). For example:

- Game loop and timing: [notes/game-loop.md](notes/game-loop.md)
- Asset archive format: [notes/asset-format.md](notes/asset-format.md)

## Rebuild plan

How the web version is structured, what it loads, and what is already implemented.

## Log

- YYYY-MM-DD: Project proposed.
