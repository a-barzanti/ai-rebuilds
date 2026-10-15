# Resource formats

How the game stores text, data, config and art inside the APK. Evidence IDs are listed in
[evidence.md](evidence.md).

Tags: **[obs]** observed in REA output · **[sh]** observed by reading the extracted bytes with ordinary tools
(not REA Evidence) · **[inf]** inferred · **[?]** unknown

## Where things live

**[obs]** In total there are 1,471 archive members (`E-extract`). Under `assets/` (**[sh]**):

| Path | Size | What it is |
| ---- | ---- | ---------- |
| `l0_0` … `l4_0` | ~138–154 KB each | Text tables, one per language |
| `r1` | 2,094,207 B | Binary data table, 18,766 entries |
| `p` | 470 B | Key/value config ("properties") |
| `56` | 580 B | A standalone resource (resource ID 56): the in-app coin-pack catalogue |
| `bundle_<id>/` | 537 folders, ids 0–1522 (gaps between) | Sprite/animation bundles: a descriptor file `0` plus `1.png`, `2.png`, … (669 PNGs in total) |

**[sh]** Sounds are in `res/raw/`: 47 WAV files (PCM, 16-bit, mono, 22.05 kHz) and 2 MP3 files. All of them
play natively in browsers.

## Indexed table container (used by `l*_*` and `r*`)

**[obs]** (`E-loadFile`, `E-fromLoaded`). All integers are big-endian.

| Offset | Type | Meaning |
| ------ | ---- | ------- |
| 0 | u32 | Total file size in bytes, including this field. The loader reads 4 bytes, then reads the rest of the file. |
| 4 | u32 | `count`: number of entries |
| 8 + 4·i | u32 | Absolute byte offset of entry *i* |

Entry *i* runs from `offset[i]` to `offset[i+1]`. The last entry runs to the end of the file.

**[sh]** This matches all six files. For example, `l0_0` has count 3,026 and its first entry starts at
8 + 4·3026 = 12,112. `r1` has count 18,766 and its first entry starts at 75,072.

**[obs]** One file is cached in memory at a time. Loading a different file replaces it.

## Resource and text IDs

**[obs]** (`E-getResBytes`, `E-getText`). An ID is a 32-bit int:

- **high 16 bits** = file number, **low 16 bits** = entry index.
- **Resources:** if the file number is *N* > 0, read entry *index* from file `r<N>`. If it is 0, read the
  standalone file named `<index>` (that's how `assets/56` is used).
- **Text:** read entry *index* from file `l<language>_<N>`, where *language* is the selected language number.
  Two special IDs: −1 means no text, and −2 means the empty string.
- **Text entry encoding:** Java `DataInput.readUTF`, which is a u16 big-endian byte length followed by
  *modified* UTF-8.
  - **[inf]** Modified UTF-8 is the same as UTF-8 except that NUL and characters outside the BMP are encoded
    differently. Decode it carefully, or use a small custom decoder.

**[sh]** In `l0_0`, entry 0 = `"English"` (language name), 1 = `"en"` (code), 2 = the game-server base URL,
3 = a private-network dev server URL, and later entries are UI and game text. There are five language files,
each with 3,026 entries: `l0` English (`en`), `l1` Français (`fr`), `l2` Italiano (`it`), `l3` Deutsch (`de`),
`l4` Español (`es`).

## `p`: config properties

**[sh]** A sequence of records, each `[u8 key][u16 BE length][length bytes]`, with ASCII values. Keys found:
1–6, 8, 15–22. Values are flags (`T`/`0`), a number (`358`), and Digital Chocolate portal URLs
(`mobile.post.digitalchocolate.com`, `moregames.digitalchocolate.com`). **[inf]** These are Toolkit properties
read through `Toolkit.getToolkitProperty(int)`. None of them is needed for offline play.

## `56`: coin-pack catalogue

**[sh]** Contains product IDs `coins1` … `coins6` with prices (`$0.49`, `$0.99`, `$4.99`, `$8.99`, `$17.99`, …)
and numeric fields. **[?]** The exact record layout. Decode it only if the rebuild shows the shop.

## `r1`: game data

**[sh]** 18,766 binary entries, 8 bytes to 42 KB each.

### r1 map

**[sh]** Every resource name in `toolkit.ResourceIDs` and its value, read from the DEX constants with
`tools/dex-consts.ts` (`E-ResourceIDs` lists the names). The value's low 16 bits give the `r1` index:

| Entries | What | Names |
| ------- | ---- | ----- |
| 0 | Menu flow | `RID_MENU_FLOW` |
| 1–21 | 7 bitmap fonts × 3 sizes (SD, `_IPAD`, `_VGA`) | `RID_DAT_FONT_*` |
| 22–18,691 | 18,670 animations | `ANM_*`, see [sprites-and-animations.md](sprites-and-animations.md) |
| 18,692 | Server-only bundle list | `RID_SERVER_BUNDLES` |
| 18,693–18,765 | 73 data tables | `RID_CSV_BINARY_*` |

Data tables by index (18,693 + offset):

| Index | Table | Index | Table | Index | Table |
| ----- | ----- | ----- | ----- | ----- | ----- |
| 18693 | GAMESETUP | 18718 | UPGRADES | 18743 | BUILDINGUPGRADEITEMS |
| 18694 | CURRENCIES | 18719 | COLLECTIONS | 18744 | MISSIONS |
| 18695 | PLAYERSTARTVALUES | 18720 | GAMEFIELDSETUPEDITOR | 18745 | TUTORIALSETUP |
| 18696 | RECOVERYSETUP | 18721 | NPC | 18746 | MISSIONSETUP |
| 18697 | FENCESANDCROPSDECAYINGPARAMETERS | 18722 | BUILDING | 18747 | MISSINGITEMSFORCONTENTUPDATES |
| 18698 | TUTORVALUES | 18723 | GAMEFIELDSETUP | 18748 | DEFAULTMISSIONEVENTS |
| 18699 | DEFAULTMALEITEMS | 18724 | GAMEFIELDSETUPTUTOR | 18749 | POSTMISSIONEVENTS |
| 18700 | DEFAULTFEMALEITEMS | 18725 | ITEMTYPES | 18750 | MISSIONOBJECTIVES |
| 18701 | DEFAULTDOGITEMS | 18726 | DEFAULTITEMS | 18751 | OBJECTIVEPROGRESSEVENTS |
| 18702 | DEFAULTGIFTITEMS | 18727 | PAYMENTITEMS | 18752 | LIFESTRIPS |
| 18703 | AVATARS | 18728 | PLAYERITEMS | 18753 | MAINSHOP |
| 18704 | PLAYERRECHARGEINTERVALS | 18729 | EDIBLEITEMS | 18754 | ENERGYTAB |
| 18705 | EVENTS | 18730 | FARMINGITEMS | 18755 | BUILDINGTAB |
| 18706 | NEIGHBORSETUP | 18731 | CONSTRUCTIONITEMS | 18756 | FARMINGTAB |
| 18707 | VISITNEIGHBORREWARDS | 18732 | CRAFTINGITEMS | 18757 | DECOTAB |
| 18708 | HIDEATNEIGHBORS | 18733 | DECORATIONITEMS | 18758 | WEAPONTAB |
| 18709 | COMBOMETER | 18734 | FENCEITEMS | 18759 | FOODSHOP |
| 18710 | ZOMBIEBEHAVIOR | 18735 | ZOMBIEITEMS | 18760 | FOODTAB |
| 18711 | LEVELS | 18736 | DESTRUCTIBLEITEMS | 18761 | EDITORSHOP |
| 18712 | ACHIEVEMENTLEVELS | 18737 | COLLECTIBLEITEMS | 18762 | EDITORTAB |
| 18713 | ACHIEVEMENTS | 18738 | GIFTITEMS | 18763 | SPAWNINGDEFINITIONS |
| 18714 | ACHIEVEMENTTARGETS | 18739 | BUNDLEITEMS | 18764 | LOCATIONDEFINITIONS |
| 18715 | WEIGHTS | 18740 | WEAPONITEMS | 18765 | NOTIFICATIONS |
| 18716 | BOOSTERS | 18741 | AVATARITEMSUBTYPES | | |
| 18717 | DAILYREWARDS | 18742 | AVATARITEMS | | |

**[sh]** Rows refer to each other by **CSV IDs**. `toolkit.CsvIDs` names 3,262 of them (for example
`CSVID_PICKETFENCE_*`, `CSVID_ZOMBIEPINEMART_*`).

### Data table encoding

**[obs]** (`E-Tuner-init`, `E-readIntArray`) The tables have **no header and no column schema**. Each one is a
stream of fields that its reader consumes in a fixed order:

- int: s32. bool: u8 (non-zero = true).
- int array: s32 count, then that many s32. A count ≤ 0 means "none".
- Tables with many rows (for example LEVELS and COMBOMETER) are read record by record until the data runs out.

So each table's layout has to be recovered from its reader class. Done so far:

**GAMESETUP** (entry 18693, 85 bytes) **[obs]** field order from `Tuner.init`, **[sh]** values from 1.0.33:

| # | Field | Value |
| - | ----- | ----- |
| 1 | max levels | 100 |
| 2 | max daily rewards | 5 |
| 3–4 | initial area width × height (tiles) | 50 × 50 |
| 5 | sell value % | 30 |
| 6 | cash-to-coins rate | 100 |
| 7 | level-up points | 2 |
| 8 | max attack % points | 50 |
| 9 | max wish-list items | 5 |
| 10 | mission that completes the tutorial | 1 |
| 11 | mission that unlocks visiting Rob | 2 |
| 12 | mission that unlocks fences | 2 |
| 13 | default spawning interval | 5 |
| 14 | level that unlocks achievements | 8 |
| 15 | (bool) decrease ammo at neighbors | true |
| 16 | mission that unlocks building parts | 2311 |
| 17 | mission that unlocks crafting | 4 |
| 18 | mission that unlocks tutor helping | 5 |
| 19 | mission that unlocks the daily bonus | 6 |
| 20 | mission that unlocks building upgrades | 2065 |
| – | two more ints this version doesn't read | 4, 30 |

**[?]** Whether 2311 and 2065 are mission IDs in a different numbering, or "never" sentinels. Check them against
MISSIONS.

**[?]** All other tables. Readers to trace: `ItemManager.init` (items, shops, tabs), `MissionManager`
(missions/objectives/events), `SpawningManager` (SPAWNINGDEFINITIONS, ZOMBIEBEHAVIOR), `LevelDefinition`,
`ComboDefinition`, and `SceneLoader.load` (GAMEFIELDSETUP, also the save-file format).

## `bundle_<id>/`: sprite bundles

Decoded. See [sprites-and-animations.md](sprites-and-animations.md). **[sh]** The art for every standard-definition
animation ships in the APK. Only 133 HD-only bundles were server downloads, and they are gone.

## For the rebuild

- Parse these formats **in the browser** from the player's own APK: unzip it, then read the indexed tables. Never
  host the extracted files.
- Write one small reader for the indexed table container and a `readUTF` decoder. Those two cover all text and
  the entry lookup for `r1`.
