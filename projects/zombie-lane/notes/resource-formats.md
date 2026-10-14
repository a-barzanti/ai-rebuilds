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

**[sh]** 18,766 binary entries, 8 bytes to 42 KB each (median 36 B). Many neighboring entries have the same
length (for example, a run of 2,917-byte entries). **[inf]** These are typed records: tuner/level definitions,
items, animations and scene templates. **[?]** Their layouts. Next probes: `toolkit.ResourceIDs` constants, then
the readers in `idead.tuner.Tuner`, `idead.items.ItemManager`, `idead.isometric.SceneLoader`/`ObjectLoader` and
`spriteobject.AnimationStore`.

## `bundle_<id>/`: sprite bundles

**[sh]** The descriptor `0` starts with a big-endian u32. In `bundle_224` it equals the bundle id (224). In
`bundle_0` it is 1523, which is one more than the highest bundle id. **[?]** The rest of the descriptor (frames,
regions, animation timelines). Next probes: `spriteobject.ServerBundle`, `AnimationStore`, `SpriteObject`,
`AssetServerPackageLoader`.

**[?]** Were any bundles downloaded from an asset server at runtime rather than shipped in the APK? The
`AssetServer*` classes exist. If some art was only ever on the server, it is lost and would need to be recreated.

## For the rebuild

- Parse these formats **in the browser** from the player's own APK: unzip it, then read the indexed tables. Never
  host the extracted files.
- Write one small reader for the indexed table container and a `readUTF` decoder. Those two cover all text and
  the entry lookup for `r1`.
