// Zombie Lane scenes: the item tables, the scene layout tables (GAMEFIELDSETUP*), the saved scene record
// (RMS_GAMEFIELD) and the isometric projection. Layouts are documented in ../notes/scenes-and-saves.md.

import { Reader } from "./formats.js";

/** Item.getType() values. Zombies and other destructibles share type 50. */
export const ITEM = { DESTRUCTIBLE: 50, CONSTRUCTION: 147, DECORATION: 405, PLAYER: 837, FENCE: 1104, FARMING: 1583 };

/** IsometricObject.getType() values, as stored in saves. */
export const OBJECT = { CONSTRUCTION: 0, PLAYER: 1, ZOMBIE: 2, LOOT: 3, DECORATION: 4, FENCE: 5, FARMING: 6, NEIGHBOR: 7 };

/** r1 entries of the tables used here. */
export const TABLE = {
  PLAYERITEMS: 18728, FARMINGITEMS: 18730, CONSTRUCTIONITEMS: 18731, DECORATIONITEMS: 18733,
  FENCEITEMS: 18734, ZOMBIEITEMS: 18735, DESTRUCTIBLEITEMS: 18736,
  GAMEFIELDSETUP: 18723, GAMEFIELDSETUPTUTOR: 18724,
};

export const GRID = 50; // columns and rows
export const NO_MISSION = -1;

// List encodings shared by the item tables.
const ids = (r) => { const n = r.s32(); return n <= 0 ? null : Array.from({ length: n }, () => r.s32()); };
const one = (r) => { const v = r.s32(); return v === -1 ? null : [v]; };
const pairs = (r) => { const n = r.s32(); return n <= 0 ? null : Array.from({ length: n }, () => [r.s32(), r.s32()]); };
const skip = (r, n = 1) => { for (let i = 0; i < n; i++) r.s32(); };

// One record per call; each table is read record by record until its data runs out.
const destructible = (r) => {
  const o = { id: r.s32(), layer: r.s32(), title: r.s32(), description: r.s32(), subType: r.s32(), action: r.s32() };
  skip(r);
  Object.assign(o, { killedOnlyCraftable: r.bool(), hideAtNeighbor: r.bool(), price: r.s32(), currency: r.s32() });
  skip(r, 2);
  Object.assign(o, { shopItem: r.bool(), rewardXp: r.s32(), rewardCoins: r.s32(), rewardStone: r.s32(), rewardFood: r.s32(), rewardEnergy: r.s32() });
  skip(r, 2);
  Object.assign(o, { maxHealth: r.s32(), tileSizeX: r.s32(), tileSizeY: r.s32(), tileSizeZ: r.s32(), walkable: r.bool() });
  skip(r);
  Object.assign(o, { icon: r.s32(), animations: ids(r), collisions: one(r), rewardExtraType: r.s32(), rewardExtra: pairs(r), shadow: r.s32() });
  return o;
};

const LAYOUTS = {
  DESTRUCTIBLEITEMS: [ITEM.DESTRUCTIBLE, destructible],
  ZOMBIEITEMS: [ITEM.DESTRUCTIBLE, (r) => ({ ...destructible(r), zombie: true })],
  FENCEITEMS: [ITEM.FENCE, (r) => {
    const o = { id: r.s32(), layer: r.s32(), title: r.s32(), description: r.s32(), action: r.s32(), destructibleItem: r.s32() };
    skip(r);
    Object.assign(o, { price: r.s32(), currency: r.s32() });
    skip(r, 2);
    Object.assign(o, { shopItem: r.bool(), tileSizeX: r.s32(), tileSizeY: r.s32(), tileSizeZ: r.s32(), walkable: r.bool(), maxHealth: r.s32(), damageProbability: r.s32(), rewardXp: r.s32() });
    skip(r, 2);
    return Object.assign(o, { icon: r.s32(), animations: ids(r), collisions: ids(r), shadow: -1 });
  }],
  CONSTRUCTIONITEMS: [ITEM.CONSTRUCTION, (r) => {
    const o = { id: r.s32(), layer: r.s32(), title: r.s32(), description: r.s32(), actions: ids(r) };
    skip(r);
    Object.assign(o, { requiredMission: r.s32(), price: r.s32(), currency: r.s32() });
    skip(r, 2);
    Object.assign(o, { requiredClicks: r.s32(), stonePerClick: r.s32(), coinsPerClick: r.s32(), clickRewardXp: r.s32() });
    skip(r);
    return Object.assign(o, {
      tileSizeX: r.s32(), tileSizeY: r.s32(), tileSizeZ: r.s32(), walkable: r.bool(), collectibleItems: pairs(r), craftingItems: ids(r),
      icon: r.s32(), animations: ids(r), collisions: one(r), shopItem: r.bool(), upgradeItems: pairs(r), shadow: -1,
    });
  }],
  DECORATIONITEMS: [ITEM.DECORATION, (r) => {
    const o = { id: r.s32(), layer: r.s32(), title: r.s32(), description: r.s32(), action: r.s32() };
    skip(r);
    Object.assign(o, { unlockMission: r.s32(), price: r.s32(), currency: r.s32() });
    skip(r, 2);
    Object.assign(o, { tileSizeX: r.s32(), tileSizeY: r.s32(), tileSizeZ: r.s32(), walkable: r.bool() });
    r.bool();
    return Object.assign(o, { rotatable: r.bool(), icon: r.s32(), animations: ids(r), collisions: ids(r), shopItem: r.bool(), shadow: r.s32() });
  }],
  FARMINGITEMS: [ITEM.FARMING, (r) => {
    const o = { id: r.s32(), title: r.s32(), description: r.s32(), layer: r.s32(), actions: ids(r), subType: r.s32(), requiredMission: r.s32() };
    skip(r);
    Object.assign(o, { price: r.s32(), currency: r.s32() });
    skip(r, 2);
    Object.assign(o, {
      tileSizeX: r.s32(), tileSizeY: r.s32(), tileSizeZ: r.s32(), walkable: r.bool(),
      growingMinutes: r.s32(), rewardFood: r.s32(), rewardCash: r.s32(), rewardEnergy: r.s32(), rewardXp: r.s32(), rewardCoins: r.s32(),
      rewardItemType: r.s32(), rewardItem: r.s32(), neighborRewardFood: r.s32(), neighborRewardXp: r.s32(), neighborRewardCoins: r.s32(),
      witherMinutes: r.s32(), witherRewardXp: r.s32(), witherRewardCoins: r.s32(), maxAgeMinutes: r.s32(),
    });
    r.bool();
    return Object.assign(o, { icon: r.s32(), animations: one(r), collisions: one(r), shopItem: r.bool(), revivePrice: r.s32(), reviveCurrency: r.s32(), shadow: r.s32() });
  }],
  PLAYERITEMS: [ITEM.PLAYER, (r) => ({
    id: r.s32(), title: r.s32(), description: r.s32(), layer: r.s32(), gender: r.s32(),
    torsoAnimations: ids(r), animations: ids(r), collisions: one(r), shadow: r.s32(), tileSizeX: 1, tileSizeY: 1, tileSizeZ: 1,
  })],
};

/** Parse one item table. Throws if a record runs past the end, so a wrong layout can't pass silently. */
export function parseItemTable(name, bytes) {
  const [type, read] = LAYOUTS[name];
  const r = new Reader(bytes);
  const rows = [];
  while (!r.done) rows.push({ type, table: name, ...read(r) });
  return rows;
}

/** Every scene item, keyed by `${type}:${id}` (the game's ItemManager.getItem(type, id)). */
export function loadItems(r1) {
  const items = new Map();
  for (const name of Object.keys(LAYOUTS)) {
    for (const item of parseItemTable(name, r1.entry(TABLE[name]))) {
      const key = `${item.type}:${item.id}`;
      if (!items.has(key)) items.set(key, item); // first table wins, as in the game's load order
    }
  }
  return items;
}

/**
 * A layout table (GAMEFIELDSETUP, GAMEFIELDSETUPTUTOR): 36-byte records of nine s32.
 * Field 5 is never read by the game.
 */
export function parseLayout(bytes) {
  if (bytes.length % 36) throw new Error(`Layout size ${bytes.length} isn't a multiple of 36`);
  const r = new Reader(bytes);
  const rows = [];
  while (!r.done) {
    const row = { id: r.s32(), itemType: r.s32(), itemId: r.s32(), column: r.s32(), row: r.s32() };
    r.s32();
    rows.push(Object.assign(row, { minutesAgo: r.s32(), health: r.s32(), mission: r.s32() }));
  }
  return rows;
}

/**
 * The saved scene (record RMS_GAMEFIELD, format version ≥ 103). Longs are returned as the game reads them:
 * the FIRST int is the low half. The writer puts the high half first, so a stored timestamp comes back
 * word-swapped (see the notes).
 */
export function parseSave(bytes) {
  const r = new Reader(bytes);
  const version = r.utf();
  const versionNumber = Number(version.replace(/\D/g, "")) || -1;
  if (versionNumber < 103) throw new Error(`Save version "${version}" uses the pre-1.0.3 object format, which isn't decoded`);
  const count = r.s32();
  r.s16(); r.s16(); r.s16(); r.u8(); r.u8(); // 8-byte block, always 0, -1, -1, 0, 0 when written
  const sizes = Array.from({ length: count }, () => r.u8());
  const objects = [];
  for (const size of sizes) {
    const o = { itemType: r.s16(), itemId: r.s16() };
    const start = r.p;
    Object.assign(o, { objectType: r.s16(), id: r.s16(), column: r.u8(), row: r.u8() });
    switch (o.objectType) {
      case OBJECT.CONSTRUCTION: Object.assign(o, { state: r.s8(), clicks: r.s8() }); break;
      case OBJECT.PLAYER: o.character = r.s32(); break;
      case OBJECT.ZOMBIE:
      case OBJECT.LOOT:
        o.health = r.s8();
        o.rewardItem = r.bool() ? r.s16() : null;
        o.spawnId = r.s16();
        break;
      case OBJECT.DECORATION: o.rotation = r.s16(); break;
      case OBJECT.FENCE: o.health = r.s8(); break;
      case OBJECT.FARMING:
        Object.assign(o, { timestamp: long(r), destructTimestamp: long(r), revived: r.bool(), harvested: r.bool(), destroyed: r.bool(), attacked: r.bool() });
        break;
    }
    if (r.p - start !== size) throw new Error(`Object ${objects.length} used ${r.p - start} bytes, expected ${size}`);
    objects.push(o);
  }
  const updateBreakableObjects = long(r);
  if (!r.done) throw new Error(`${r.bytes.length - r.p} bytes left after the scene`);
  return { version, versionNumber, objects, updateBreakableObjects };
}

const long = (r) => { const low = BigInt(r.s32() >>> 0), high = BigInt(r.s32() >>> 0); return BigInt.asIntN(64, (high << 32n) | low); };

// Geometry

/** World units per tile: 48 in standard definition, 96 in HD. Positions are tile centres. */
export const tileSize = (hd = false) => (hd ? 96 : 48);

export function tileToWorld(column, row, hd = false) {
  const s = tileSize(hd);
  return { x: column * s + s / 2, y: row * s + s / 2 };
}

/** Transform.toScreen: the matrix (40, 26; −10, 26), scaled by 0.65 / 48 (or 1.3 / 96 in HD). */
export function worldToScreen(x, y, hd = false) {
  const k = (hd ? 1.3 : 0.65) / tileSize(hd);
  return { x: (40 * x + 26 * y) * k, y: (-10 * x + 26 * y) * k };
}

/** Floor and sky animations (ANM_FLOOR02, ANM_SKY01). The floor is drawn with its anchor at screen (0, 0). */
export const FLOOR_ANIMATION = 0x13dc2;
export const SKY_ANIMATION = 0x1012b;

/**
 * Place a layout's rows like SceneLoader's uncompressed path: a row is skipped if its mission isn't
 * completed, the anchor moves down by the item's tileSizeY when that stays on the grid, and at a
 * neighbor's place destructibles marked hideAtNeighbor are skipped.
 * @param {(mission: number) => boolean} missionCompleted
 */
export function placeLayout(rows, items, { missionCompleted = () => false, atNeighbor = false } = {}) {
  const objects = [];
  const skipped = { mission: 0, neighbor: 0, unknownItem: 0 };
  for (const row of rows) {
    const item = items.get(`${row.itemType}:${row.itemId}`);
    if (!item) { skipped.unknownItem++; continue; }
    if (row.mission !== NO_MISSION && !missionCompleted(row.mission)) { skipped.mission++; continue; }
    if (row.itemType === ITEM.DESTRUCTIBLE && atNeighbor && item.hideAtNeighbor) { skipped.neighbor++; continue; }
    const anchorRow = item.tileSizeY + row.row < GRID ? row.row + item.tileSizeY : row.row;
    objects.push({
      id: row.id, item, objectType: objectTypeOf(item), column: row.column, row: anchorRow,
      health: row.health >= 0 ? row.health : item.maxHealth, minutesAgo: row.minutesAgo, mission: row.mission,
      state: 0, rotation: 0,
    });
  }
  return { objects, skipped };
}

function objectTypeOf(item) {
  switch (item.type) {
    case ITEM.CONSTRUCTION: return OBJECT.CONSTRUCTION;
    case ITEM.DECORATION: return OBJECT.DECORATION;
    case ITEM.PLAYER: return OBJECT.PLAYER;
    case ITEM.FENCE: return OBJECT.FENCE;
    case ITEM.FARMING: return OBJECT.FARMING;
    default: return item.zombie ? OBJECT.ZOMBIE : OBJECT.LOOT;
  }
}

/**
 * Which of the item's animations an object shows when idle, and which frame to hold (null = play).
 * Fences pick by neighbouring fences and hold a damage frame; other objects with health pick an
 * animation by damage; one-health loot with several animations picks one at random on creation
 * (seeded by object ID here so the preview is stable).
 */
export function idleAnimation(object, fenceAt) {
  const { item } = object;
  const count = item.animations?.length ?? 0;
  if (!count) return null;
  const damage = Math.max(item.maxHealth - object.health, 0);
  switch (object.objectType) {
    case OBJECT.FENCE: {
      const n = fenceAt(object.column, object.row - 1), s = fenceAt(object.column, object.row + 1);
      const w = fenceAt(object.column - 1, object.row), e = fenceAt(object.column + 1, object.row);
      return { index: fenceIndex(n, s, w, e), holdFrame: damage };
    }
    case OBJECT.CONSTRUCTION: return { index: Math.min(object.state, count - 1), holdFrame: null };
    case OBJECT.DECORATION: return { index: object.rotation && count > 1 ? 1 : 0, holdFrame: null };
    case OBJECT.LOOT:
      if (count > 1 && item.maxHealth > 1) return { index: Math.min(damage, count - 1), holdFrame: null };
      if (count > 1 && item.maxHealth === 1) return { index: hash(object.id) % count, holdFrame: null };
      return { index: 0, holdFrame: null };
    default: return { index: 0, holdFrame: null };
  }
}

/** FenceObject.setEdges: neighbours north (row − 1), south, west (column − 1), east → animation index. */
export function fenceIndex(n, s, w, e) {
  if (!n && !s && (w || e)) return 1;
  if ((n || s) && !w && !e) return 0;
  if (n && s && w && e) return 2;
  if (n && !s && !w && e) return 3;
  if (n && !s && w && !e) return 4;
  if (!n && s && !w && e) return 5;
  if (!n && s && w && !e) return 6;
  if (!n && s && w && e) return 7;
  if (n && s && w && !e) return 8;
  if (n && s && !w && e) return 9;
  if (n && !s && w && e) return 10;
  return 0; // a fence with no neighbours keeps its first animation
}

const hash = (n) => { let h = n | 0; h = Math.imul(h ^ (h >>> 16), 0x45d9f3b); h = Math.imul(h ^ (h >>> 16), 0x45d9f3b); return (h ^ (h >>> 16)) >>> 0; };

/**
 * IsometricScene.isObjectFrontOf as a sort: lower layer first, then smaller world y, then larger world x.
 * The game also defers objects that a multi-tile neighbour overlaps; that isn't modelled.
 */
export function drawOrder(a, b) {
  return (a.item.layer - b.item.layer) || (a.world.y - b.world.y) || (b.world.x - a.world.x);
}
