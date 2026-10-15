# Sprites and animations

How the game stores its art: texture bundles (PNG atlases plus a region list) and animation descriptors in `r1`.
All integers are big-endian. Evidence IDs are listed in [evidence.md](evidence.md).

Tags: **[obs]** observed in REA output · **[sh]** checked against the extracted bytes with
[our own tools](../tools/) · **[inf]** inferred · **[?]** unknown

**Validated:** **[sh]** the layouts below parse all 18,670 animation entries in `r1` exactly, and 536 of the 537
bundle descriptors (`tools/check-anims.ts`, `tools/check-bundles.ts`).

## Texture bundles: `assets/bundle_<id>/`

Each folder holds a descriptor file `0` and the atlases `1.png`, `2.png`, …, which are **[sh]** RGBA PNGs, typically
512×512.

### Descriptor `0`

**[obs]** (`E-readBundle`, `E-readTexture`)

| Field | Type | Meaning |
| ----- | ---- | ------- |
| bundle id | s32 | Equals the folder number |
| version | s32 | For example `1000001`. Shown as text by splitting off groups of three digits: `1_0_1`. Used only in asset-server paths. |
| (unused) | u8 | |
| color depth | u8 | **[sh]** Values 0, 1, 2, 3 and 6 occur. **[?]** Meaning. |
| PNG count | s16 | |
| for each PNG: region count | s16 | |
| for each region | 4 × s16 | `x, y, w, h` in that PNG |

**[obs]** `bundle_0/0` starts with an extra 8-byte master header (`E-textureInit`), followed by bundle 0's own
descriptor:

| Field | Type | Value in 1.0.33 |
| ----- | ---- | --------------- |
| bundle slots | s32 | 1,523 (ids 0–1522; 537 are used by folders in the APK) |
| (bundle count) | s16 | **[sh]** 669 |
| total PNGs | s16 | **[sh]** 925. **[obs]** Sizes the texture table. |

**[sh]** Oddities: `bundle_1413` lists 0 PNGs and has 46 unexplained bytes after the header. Ten folders ship one PNG
more than their descriptor lists. **[inf]** The extra PNGs are leftovers that the game never loads.

### Image references

**[obs]** (`E-loadTextureImage`) An image is named by one 32-bit int:

| Bits | Meaning |
| ---- | ------- |
| 20–31 | bundle id |
| 14–19 | PNG number, starting at 1 (`bundle_<id>/<n>.png`) |
| 0–13 | region index in that PNG's region list |

## Animation entries in `r1`

Entries 22–18,691 of `r1` are animations (see [resource-formats.md](resource-formats.md#r1-map)). **[obs]** The first
byte says which kind of entry it is (`E-createAnimation`):

- `1`: a **link entry** that chooses a resolution variant.
- `0`: an **animation**.

### Link entries (resolution variants)

**[obs]** `[u8 1][s32 n]`, then `n` pairs of `[s32 profile][s32 resource id]`. Profile `0` = default (SD), `1` = VGA,
`2` = HD. **[sh]** All 5,815 link entries have a default and an HD target. 1,225 also have a VGA target.

**[obs]** Selection rules (`E-createAnimation`):

| Device | Uses |
| ------ | ---- |
| VGA | VGA target if there is one, otherwise default |
| Not HD | default. On screens ≤ 480 px wide, 12 specific animations are drawn at 0.6× scale. |
| HD | HD target if there is one, otherwise default drawn at **2×** |
| HD, but the HD target's bundle was never downloaded | default at **2×** |

**[sh]** Every default and VGA target's art is in the APK. The 2,553 HD targets with missing art all point at
server-only bundles (see below). **For the rebuild:** use the default targets, and optionally the 3,262 HD targets
whose art is present.

### Animation layout

**[obs]** (`E-createAnimation`, `E-initAnimation`, `E-isFrameRef`). "coord" means s8 when the *wide* flag is clear
and s16 when it is set. "size" means u8 or s16 in the same way.

| Field | Type | Meaning |
| ----- | ---- | ------- |
| kind | u8 | `0` |
| bundle id | s32 | Main bundle. Used to check whether its art is loaded. |
| flags | u8 | bit 0: *wide* coordinates · bit 1: *wide* durations (u16 instead of u8) |
| frame count | u8 | |
| loop | u8 | Bool: the animation prefers to loop |
| continuous nested | u8 | Bool: nested animations keep running across frames **[inf]** |
| bounds | coord x, coord y, size w, size h | |
| alignment | u8 | Bit flags: TOP 1, LEFT 2, VCENTER 4, BOTTOM 8, HCENTER 16, RIGHT 32 |
| frame sharing | u8 × frame count | `255` = the frame has its own data. Otherwise the index of the frame whose data it reuses. **[sh]** Every frame in 1.0.33 has its own data. |
| durations | (u8 or u16) × frame count | Per-frame duration in milliseconds **[obs]** (`E-spriteUpdate`: the player advances by the frame's `dt`). `0` = hold forever, which makes the animation's length infinite. |
| has timeline | u8 | Bool |
| timeline | see below | Only if *has timeline* |
| frames | see below | Only for frames with their own data, in order |

Frame *i* starts at the sum of the earlier durations. The animation's length is the sum of all durations.

### Timeline (tweened transforms)

**[obs]** (`E-initAnimation`, `E-timelineLoad`, `E-timelineValue`) The timeline bounds come first (coord, coord,
size, size), then six channels in this fixed order:

| # | Channel | Key value type |
| - | ------- | -------------- |
| 0 | color modification | s32 |
| 1 | x offset | coord |
| 2 | y offset | coord |
| 3 | scale width | s32 |
| 4 | scale height | s32 |
| 5 | rotation | s32 |

Each channel is `[u8 key count]`, then for each key `[s32 time][u8 easing][value]`. Easing: 0 linear, 1 constant,
2 quad in, 3 quad out, 4 quad in-out. **[sh]** 376 animations have a timeline. Units are in *Drawing* below.

### Frame

| Field | Type | Meaning |
| ----- | ---- | ------- |
| size | size w, size h | |
| collision boxes | u8 count, then `[u8 id][coord x][coord y][size w][size h]` each | Hit areas, for example for tapping |
| renderables | s16 count, then one record each | Drawn in order |

**[obs]** (`E-loadFrame`) Renderable records start with a u8 type. The counts are **[sh]** across all of `r1`.

| Type | Name | Fields after the type | Count |
| ---- | ---- | --------------------- | ----- |
| 1 | image | coord x, coord y, u8 flags (low 4 bits: 0 none, 1 flip horizontally, 2 flip vertically, 3 both), s32 image reference, u8 pixel format (always 253) | 62,562 |
| 2 | filled rect | s32 color, coord x, coord y, size w, size h | 105 |
| 3 | rect outline | same as 2 | 4 |
| 4 | line | s32 color, coord x1, y1, x2, y2 | 11,433 |
| 5 | filled ellipse | same as 2 | 104 |
| 6 | filled polygon | s32 color, u8 point count, then (coord x, coord y) per point | 0 |
| 7 | clip rect | coord x, coord y, size w, size h | 140 |
| 8 | path | same as 6. The last type 6/8 record becomes the frame's collision polygon. | 2,590 |
| 9 | nested animation | coord x, coord y, u8 loop, s32 animation resource id | 1,597 |
| 10 | particle emitter | see below | 6 |

**[inf]** Colors are ARGB. **[obs]** The coordinates of primitives (types 2–8) are multiplied by the animation's
scale (0.6×, 1× or 2×, see link entries).

**Particle emitter** **[obs]**: s16 *n*, then *n* × s32 animation ids (the particles), then the emitter rect (coord, coord,
size, size), then 5 × u8 bools: randomize animation choice, draw newest first, randomize spread, dynamic emitter
position, fixed particle life. Then 13 × s16: id, max particles, gravity x, gravity y, min/max acceleration,
min/max angle, spread step, min/max start velocity, min/max end velocity. Then 4 × s32: min/max particle life,
duration, emission interval.

## Drawing

**[obs]** How the game draws an animation (`E-spriteDraw`, `E-animDoDraw`, `E-frameDoDraw`, `E-drawTexture`).
`lib/render.js` follows these rules.

**Time.** A sprite keeps an elapsed time in ms (`E-spriteUpdate`). Drawing at time *t* first wraps *t* by the
animation's length, then picks the last frame whose start time is ≤ *t*. Nested animations get the time since their
parent frame started, or the parent's full time when *continuous nested* is set.

**Timeline** (only when the animation has one), applied around the anchor in this order:

- color channel: alpha is the top byte. Alpha 0 skips the whole sprite. RGB is a tint where `0x80` per channel is
  neutral: above it brightens, below it darkens (`E-blending`).
- x/y offset: added to the anchor (`E-timelineX`).
- rotation: in 1/65536 of a full turn (`E-angle`). Scale: 1024 = 1× (`E-scale`).
- Channels without keys use neutral values: color `0xFF808080`, scale 1024, others 0 (`E-neutral`). Before the first
  key a channel returns −1.
- Interpolation uses integer math: linear is `a + (b − a)·dt / span`, the quad easings are the usual
  Penner formulas with truncating division (`E-lerp`, `E-ease`). After the last key, looping animations ease back to
  the first key across the remaining length, and others hold the last value (`E-timelineValue2`).

**Frame.** Renderables are drawn in order, relative to the anchor:

- **image:** the region's top-left corner goes at (x, y) (`E-drawTexture`). The image's own flip flags mirror it
  inside its own rectangle. Mirroring the whole sprite negates the scale, so positions mirror around the anchor.
- **clip rect:** clips everything after it in the frame, at (anchor + x, anchor + y), without rotation or scale. A
  second clip rect replaces the first. The clip is restored at the end of the frame.
- **nested animation:** drawn at (x, y), negated on mirrored axes, with the parent's mirroring.
- **primitives:** colors are opaque RGB (`E-colorRGB`). When the sprite is mirrored horizontally, rects and ellipses
  with x ≠ 0 are moved to `−x − w`. Lines are not mirrored.
- **Alignment** is applied by the caller, not the animation. It shifts the draw position by the full or half box
  size for BOTTOM/RIGHT or VCENTER/HCENTER (`E-drawAligned`).

**Blending by bundle color depth** (`E-blending`): depth 1 is premultiplied (`ONE, ONE_MINUS_SRC_ALPHA`), depth 3
is opaque, and the others use normal alpha. **[sh]** Sampled depth-1 PNGs have only fully opaque or fully transparent
pixels, and their transparent pixels are black, so normal browser drawing gives the same result.

**Names.** **[sh]** In `ResourceIDs`, the suffixes `_IPHONE`, `_IPAD` and `_VGA` mark the default (SD), HD and VGA
variants. The unsuffixed name is the link entry. Path renderables appear in animations named `*_COLLISION` and
`FLOOR*`, so **[inf]** they are mostly hit areas and floor outlines.

## Server-only bundles

**[obs]** (`E-serverAssets`, `E-textureInit`, `E-bundleLoadFile`) `r1` entry 18,692 lists the bundles that were
meant to be downloaded: `[s32 count]`, then for each `[s32 bundle id][s32 version][s32 PNG count]`.

- **[sh]** 133 bundles with 266 PNGs. None of them are in the APK.
- **[obs]** The game downloads them only when the device uses HD graphics *and* a test connection to the asset
  server succeeds. They are fetched as `<asset server>bundle_<id>/<version>/<n>.png` and stored on the device.
- **[obs]** A missing server bundle is skipped. Animations that need it fall back to the default variant at 2×.

**[inf]** Nothing is lost for a standard-definition rebuild. Only extra HD art for some animations was server-only.

## Animation names

**[sh]** `toolkit.ResourceIDs` names 18,670 animations in `r1`, by family. The largest are player avatars
(`ANM_MALE_*` 6,194, `ANM_FEMALE_*` 5,449, `ANM_PAPERDOLL_*` 800), missions (1,381), zombies (788), icons (537),
HUD (460), the dog (411), menus (396), decorations (282), objects (270) and buildings (201). Extract the
name-to-ID table with `tools/dex-consts.ts` to label animations in a viewer.

## For the rebuild

Done: [`lib/`](../lib/) reads the APK in the browser (`zip.js`, `dex.js`), parses these formats (`formats.js`,
`assets.js`) and draws animations (`render.js`). The [asset viewer](https://ai-rebuilds.com/projects/zombie-lane/viewer/)
uses it. Still missing: particle emitters (6 frames in the whole game) and timeline RGB tints.
