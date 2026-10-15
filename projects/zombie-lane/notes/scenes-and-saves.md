# Scenes, items and saves

How a scene (the player's home, or a neighbor's place) is described, stored and drawn: the item tables, the
layout tables in `r1`, the saved scene record, the isometric grid and draw order. Tags: **[obs]** seen in the
decompiled code, **[sh]** checked against the shipped data of 1.0.33, **[inf]** inferred, **[?]** unknown.
Evidence refs (`E-…`) are listed in [evidence.md](evidence.md#fourth-pass-scenes-and-saves-2026-10-15).

All integers are big-endian (Java `DataInputStream`/`DataOutputStream`, `E-DChocByteArray`, `E-dba-readInt`).

## Items

**[obs]** (`E-im-loadData`) `ItemManager` reads one table per item class. Each table is a run of records with no
header, read one record at a time until the data runs out. Items are looked up by **(type, id)**.

| Table (r1 entry) | Class | Type | Records **[sh]** |
| ---------------- | ----- | ---- | ---------------- |
| DECORATIONITEMS (18733) | Decoration | 405 | 38 |
| PAYMENTITEMS (18727) | Payment | 3003 | not decoded |
| CONSTRUCTIONITEMS (18731) | Construction (buildings) | 147 | 7 |
| ZOMBIEITEMS (18735) | Zombie (a destructible) | 50 | 16 |
| DESTRUCTIBLEITEMS (18736) | Destructible (rubble, brush, litter, NPCs) | 50 | 41 |
| AVATARITEMS, EDIBLEITEMS, WEAPONITEMS | Avatar, Edible, Weapon | 1911, 101, 1907 | not decoded |
| PLAYERITEMS (18728) | Player | 837 | 4 |
| COLLECTIBLEITEMS, CRAFTINGITEMS, GIFTITEMS | Collectible, Crafting, Gift | 47, 1913, 1909 | not decoded |
| FARMINGITEMS (18730) | Farming (crops) | 1583 | 19 |
| FENCEITEMS (18734) | Fence | 1104 | 3 |
| COLLECTIONS (18719) | collections, not items | – | not decoded |

Type values are `Item.TYPE_*` constants **[sh]** (`E-Item`). Zombies and other destructibles share type 50.

### Record layouts

Field types: `i` = s32, `b` = bool (u8, non-zero = true), `–` = s32 the reader skips, `b–` = skipped bool.
Lists: `ids` = s32 count then that many s32 (count ≤ 0 = none); `id1` = one s32 where −1 = none;
`pairs` = s32 count then that many (s32, s32) (`E-th-readRIDs`, `E-th-readVL`). Animation and icon fields are
**resource IDs**: the low 16 bits are the `r1` entry (see [resource-formats.md](resource-formats.md)). Title and
description are **text IDs**.

**Destructible** and **Zombie** (`E-di-load`, `E-zi-load`), in order: id, layer, title, description, subType,
action, –, killedOnlyCraftable `b`, hideAtNeighbor `b`, price, currency, –, –, shopItem `b`, rewardXp,
rewardCoins, rewardStone, rewardFood, rewardEnergy, –, –, maxHealth, tileSizeX, tileSizeY, tileSizeZ,
walkable `b`, –, icon, animations `ids`, collision `id1`, rewardExtraType, rewardExtra `pairs`, shadow.
Zombie items then append a fixed list of shared effect animations to `animations`.

**Fence** (`E-fi-load`): id, layer, title, description, action, destructibleItem, –, price, currency, –, –,
shopItem `b`, tileSizeX, tileSizeY, tileSizeZ, walkable `b`, maxHealth, damageProbability, rewardXp, –, –,
icon, animations `ids`, collisions `ids`.

**Construction** (`E-ConstructionItem-load`): id, layer, title, description, actions `ids`, –,
requiredMission, price, currency, –, –, requiredClicks, stonePerClick, coinsPerClick, clickRewardXp, –,
tileSizeX, tileSizeY, tileSizeZ, walkable `b`, collectibleItems `pairs`, craftingItems `ids`, icon,
animations `ids`, collision `id1`, shopItem `b`, upgradeItems `pairs`.

**Decoration** (`E-DecorationItem-load`): id, layer, title, description, action, –, unlockMission, price,
currency, –, –, tileSizeX, tileSizeY, tileSizeZ, walkable `b`, `b–`, rotatable `b`, icon, animations `ids`,
collisions `ids`, shopItem `b`, shadow.

**Farming** (`E-FarmingItem-load`): id, title, description, layer, actions `ids`, subType, requiredMission, –,
price, currency, –, –, tileSizeX, tileSizeY, tileSizeZ, walkable `b`, growing time (minutes), rewardFood,
rewardCash, rewardEnergy, rewardXp, rewardCoins, rewardItemType, rewardItem, neighborRewardFood,
neighborRewardXp, neighborRewardCoins, wither time (minutes), witherRewardXp, witherRewardCoins, max age
(minutes), `b–`, icon, animation `id1`, collision `id1`, shopItem `b`, revivePrice, reviveCurrency, shadow.

**Player** (`E-PlayerItem-load`): id, title, description, layer, gender, torsoAnimations `ids`,
animations `ids`, collision `id1`, shadow.

**[sh]** All seven layouts consume their tables exactly (0 bytes left; `tools/check-scenes.ts`), and the
names resolve to sensible text: item 1029 is "Grass" (`ANM_OBJECTS_GRASS01`), zombie 55 is "Supermart
Zombie (Weak)" (first animation `ANM_ZOMBIE_SUPERMART_IDLE_DOWN`, shadow `ANM_CHARACTER_SHADOW`),
construction 148 is "House" (`ANM_BUILDINGS_HOME01`…`04`), fence 1977 is "Wooden Fence".

## Layout tables

**[obs]** (`E-ge-load`, `E-pl-loadScene`, `E-rp-init`) A scene that isn't saved is built from a **layout table**:

| Table (r1 entry) | Used for | Rows **[sh]** |
| ---------------- | -------- | ------------- |
| GAMEFIELDSETUP (18723) | The home on first launch (no `RMS_GAMEFIELD` record yet) | 499 |
| GAMEFIELDSETUPTUTOR (18724) | Rob's place (`RobsPlace`: neighbor type 2514, level 7). Loaded from the table on **every** visit; only Rob's profile data is stored, in `RMS_ROBSPLACE`. | 553 |
| GAMEFIELDSETUPEDITOR (18720) | **[?]** Not read by the scene loader. 19,456 bytes, not a multiple of 36, so a different format. | – |

**[obs]** (`E-ol-loadU`) Each row is nine s32 (36 bytes), read until the data runs out:

| # | Field | Notes |
| - | ----- | ----- |
| 0 | object ID | **[sh]** unique within a table |
| 1 | item type | 50, 147, 405, 837, 1104 or 1583 |
| 2 | item ID | with the type, looks up the item |
| 3 | column | 0–49 |
| 4 | row | 0–49 |
| 5 | – | never read. **[sh]** Always 0. |
| 6 | minutes ago | farming only: planted this many minutes before now |
| 7 | health | set if ≥ 0 (destructibles, zombies, fences) |
| 8 | mission | −1 = always; otherwise the row is placed only if that mission is completed |

Placement rules **[obs]**:

- Skip the row if its mission isn't −1 and isn't completed. **[sh]** At Rob's place 23 rows wait for missions
  (IDs 2, 5, 1984, 1986, 2310, 3010, 3114), so mission IDs run into the thousands. **[inf]** That makes the
  GAMESETUP values 2311 and 2065 plausible mission IDs rather than sentinels.
- At a neighbor's place, skip destructibles whose item has `hideAtNeighbor`.
- The anchor tile is (column, row + item.tileSizeY), unless that would leave the 50-row grid.
- Type 837 places the player's active avatar. Every other type creates an object of the matching kind and sets
  its ID. Destructibles become a **zombie** if the item is a zombie, otherwise **loot**.

**[sh]** GAMEFIELDSETUP places 1 player, 1 house (construction 148), 3 weak Supermart zombies, Rent-A-Cop Rob,
a shovel, 154 fences (95 picket, 59 plank) and 338 pieces of rubble, brush, grass and litter. All 499 rows
resolve to known items.

## Saved scene (`RMS_GAMEFIELD`)

### Where it's stored

**[obs]** (`E-tk-writeRec`, `E-tk-readRec`, `E-tk-writeDB`, `E-tk-readDB`) Records go into an SQLite database
**[sh]** `dchoc.db`, table `millionaire (_id integer primary key autoincrement, key text, value blob,
time_is integer)`. The record name is the key and the bytes are the value. If a key isn't in the database,
the loader falls back to an older J2ME RecordStore file of the same name.

**[obs]** (`E-ge-saveCommon`) A save writes three records together: `RMS_PROFILE` (player profile),
`RMS_GAMEFIELD` (scene) and `RMS_MISSIONS` (missions). The scene and missions are written only while playing
at home (engine state 2). **Nothing is saved until the tutorial is completed.** Backup sets use the suffixes
`_BKUP_V1`…`_V3` and a debug set `…_BACKUP`. When connected, the same three blobs were also uploaded with
`UpdateAccountInformation` (see [online-dependencies.md](online-dependencies.md)).

### Format

**[obs]** (`E-sl-save`, `E-ol-save`, `E-sl-load`, `E-ol-load`, `E-olo-readCrash`, `E-olo-writeCrash`)

| Part | Encoding |
| ---- | -------- |
| version | `writeUTF` of the app version with dots replaced by underscores (`E-sw-init`). **[inf]** `1_0_33` for this build. The loader keeps only its digits (`E-sw-parseVersion`): below 103 (or none) means the pre-1.0.3 object format, which isn't described here. |
| count | s32, number of objects |
| 8-byte block | s16 0, s16 −1, s16 −1, u8 0, u8 0. Skipped on load. |
| sizes | `count` × u8: each object's body size, **not** counting its 4-byte item header |
| objects | `count` × (item header + body), in the scene's per-layer object order |
| breakable-update time | long (see below) |

Each object:

| Field | Type | Notes |
| ----- | ---- | ----- |
| item type | s16 | header |
| item ID | s16 | header. If the item is unknown, or it's a hidden-at-neighbor destructible, the loader skips `size` bytes. |
| object type | s16 | 0 construction, 1 player, 2 zombie, 3 loot, 4 decoration, 5 fence, 6 farming (`IsometricObject.TYPE_*`, 7 = neighbor isn't saved) |
| object ID | s16 | |
| column, row | u8, u8 | the object's current tile, already the anchor tile |
| construction | s8 state, s8 clicks | state picks the building animation |
| player | s32 character | which avatar |
| zombie, loot | s8 health, bool hasReward, [s16 reward item ID], s16 spawn ID | |
| decoration | s16 rotation | |
| fence | s8 health | |
| farming | long planted, long destroyed-at, bool revived, bool harvested, bool destroyed, bool attacked | |

**Longs** (`E-th-writeLong`, `E-th-readLong`, `E-TH`): the writer stores the **high** s32 first, but the reader
takes the **first** s32 as the low half. As written, a long doesn't survive a save and load; it comes back
with its halves swapped. **[?]** How the game copes (farm timers, the breakable-update timer) needs a runtime
check. The rebuild should store its own saves in a sane format, and only an importer for original saves needs
to care.

**[obs]** After loading a saved home, any avatar the profile owns that isn't in the scene is added back
(`E-fx-missing`).

**[?]** The profile (`PlayerProfile.save`) and missions (`MissionManager.save`) formats.

## Isometric grid

**[obs]** (`E-is-init`, `E-it-getX`, `E-it-getTileSize`, `E-tr-init`, `E-tm-transform`, `E-tm-scale`)

- The grid is **50 × 50** tiles. A tile is 48 world units (96 in HD), and an object's world position is its
  tile's centre: `x = column·48 + 24`, `y = row·48 + 24`.
- World to screen is a 2×2 matrix `(40, 26; −10, 26)` scaled by 0.65 / 48 (1.3 / 96 in HD):
  `screenX = (40x + 26y)·k`, `screenY = (−10x + 26y)·k`. One column step moves (26, −6.5) px and one row step
  (16.9, 16.9) px in standard definition. The camera subtracts its own position afterwards.
- **[sh]** Cross-checks: the camera bounds in `IsometricScene.init` start at y = −325 and span 2145 × 1170, which
  is exactly the projected 50 × 50 grid. The tile collision shapes (for example `ANM_OBJECTS_GRASS_COLLISION`)
  are parallelograms with the same two edge vectors.

## Drawing a scene

**[obs]** (`E-is-doDraw`, `E-is-bg`, `E-if-init`, `E-if-doDraw`, `E-io-init`, `E-io-setPosition`)

1. Sky: `ANM_SKY01` stretched over the whole screen.
2. Floor: `ANM_FLOOR02`, anchored at the projected world origin. It is drawn with filled triangles
   (type 8 renderables, see [sprites-and-animations.md](sprites-and-animations.md)) plus nested edge and
   street-sign animations.
3. Objects visible to the camera, sorted (`E-is-sort`, `E-is-front`): lower **layer** first; within a layer,
   smaller world y first; on equal y, larger world x first.
4. Each object draws its **shadow** animation (if the item has one) and then its current animation, both
   anchored at its projected position. Hidden objects use a transparent color, and highlighted ones a glow
   tint.

**[obs]** Objects that overlap several tiles can defer drawing until a "deferring" object on their tile has
been drawn. **[?]** The exact rule. The viewer doesn't model it, and no artefacts are visible in the two built-in
layouts.

### Which animation an object shows

**[obs]** An object starts on its item's first animation (`E-an-load`). Changes (`E-tr-changeAnim`):

- **Fence** (`E-fo-updateEdges`, `E-fo-setEdges`, `E-fo-upd`): checks for fences on the tiles north
  (row − 1), south (row + 1), west (column − 1) and east (column + 1), then picks:

  | Neighbors | Index | Neighbors | Index |
  | --------- | ----- | --------- | ----- |
  | N and/or S only | 0 | S + E | 5 |
  | W and/or E only | 1 | S + W | 6 |
  | all four | 2 | S + W + E | 7 |
  | N + E | 3 | N + S + W | 8 |
  | N + W | 4 | N + S + E | 9 |
  | | | N + W + E | 10 |

  A fence with no neighbors keeps index 0. Within that animation the fence **holds frame**
  `min(maxHealth − health, frames − 1)`, so its frames are damage stages.
- **Other objects with health** (`E-owh-init`, `E-owh-upd`): with maxHealth > 1 and several animations, the
  index is `min(max(maxHealth − health, 0), count − 1)`. With maxHealth = 1 and several animations, one is
  picked at random when the object is created (variety, such as different grass tufts).
- **Construction** (`E-co-cs`): index = state (0–3). Layout tables create buildings in state 0.
- **Decoration** (`E-do-cs`): index 1 if rotated, otherwise 0.
- **Zombie, player** (`E-zc-cs`): state-driven (idle, walk, attack, directions). State 0 uses index 0, which
  is the idle-down animation for zombies. **[?]** The full direction and state mapping.

## For the rebuild

- `lib/scene.js` reads every table above, places a layout and parses a saved scene. The viewer's
  **Scenes** tab draws the two built-in layouts with it.
- Start a new game from GAMEFIELDSETUP. Store the rebuild's own save as JSON with the same fields.
- Build Rob's place from GAMEFIELDSETUPTUTOR on each visit, as the game does.
