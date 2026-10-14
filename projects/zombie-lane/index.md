---
layout: project
title: Zombie Lane
summary: Digital Chocolate's zombie-survival builder game. The Android build depended on Facebook login and online services from 2015.
status: proposed
original:
  developer: Digital Chocolate
  year: 2011
  platforms: [Facebook, Android]
target: HTML5 Canvas + TypeScript (proposed)
play:
repo:
maintainers: [a-barzanti]
tags: [zombies, builder, social, mobile]
help_wanted:
  - Confirm the rights status of Digital Chocolate's catalogue today
  - Run `inspect_android_package` on build 1.0.33 and record the class layout in `notes/`
  - Reverse the packed asset archives (`assets/l0_0` … `assets/l4_0`, `assets/p`, `assets/r1`)
  - Find out which features break without the original servers (Facebook login, billing, offers)
---

## About the original

Zombie Lane was a social survival game by Digital Chocolate. It first ran on Facebook, and an
Android version followed. You built up your neighborhood while fighting off zombies. Like many social
games of its time, it relied on Facebook login and online purchases, so it stopped working when those
services shut down.

**Rights status:** unknown. Needs research before any assets are reused in a public build.

## Which build we target

Facts below come from a first look at the APK's file listing and manifest strings. REA has not been run on it yet.

| Field           | Value                                                                           |
| --------------- | ------------------------------------------------------------------------------- |
| Version         | `1.0.33` ("multi")                                                              |
| Platform        | Android, `armeabi`                                                              |
| Package         | `com.dchoc.*`, main activity `DCiDead`                                          |
| Code            | Java / Dalvik (`classes.dex`). No native game engine library                     |
| Native libs     | `liballjoyn_java.so`, `libdaemon-jni.so` (AllJoyn peer-to-peer), dated 2015-04-24 |
| Assets          | Custom packed files: `assets/l0_0` … `assets/l4_0`, `assets/p`, `assets/r1`, `assets/56` |
| Online services | Facebook SDK login, Google Play billing, Fortumo, PayPal MEP, Tapjoy, Flurry     |
| SHA-256         | `39b93f6f5409a3e9f84a47efdd23e3067333117bc5edad6c27887091ebda0ad6`              |

The game logic is in Dalvik bytecode, not a native engine, so REA's Android tools are the place to
start. Use the `.dex` classes for logic and the custom archives for art, maps and balance data.

## Findings

Nothing yet. Specs go in [`notes/`](https://github.com/a-barzanti/ai-rebuilds/tree/main/projects/zombie-lane/notes)
once analysis starts.

## Rebuild plan

1. **Analysis:** map the game loop, save format, building and zombie rules, and asset archive layout.
2. **Offline rules:** swap every online dependency (login, purchases, friends, offers) for local state.
3. **Rebuild:** write a Canvas/TypeScript version from the specs. Players load the original art from
   their own APK in the browser. Nothing is uploaded or hosted here.

## Log

- 2026-10-14: Project proposed. First look at APK 1.0.33.
