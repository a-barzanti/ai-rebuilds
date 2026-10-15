// Parse the item tables and scene layouts described in ../notes/scenes-and-saves.md with ../lib/scene.js,
// and check that every table is consumed exactly and every layout row names a known item.
// Usage: bun check-scenes.ts <extracted-apk>/assets
import { indexedTable } from "../lib/formats.js";
import { TABLE, parseItemTable, loadItems, parseLayout, placeLayout } from "../lib/scene.js";

const dir = Bun.argv[2];
if (!dir) throw new Error("usage: bun check-scenes.ts <extracted-apk>/assets");
const r1 = indexedTable(new Uint8Array(await Bun.file(`${dir}/r1`).arrayBuffer()));
let failed = 0;

for (const name of ["DESTRUCTIBLEITEMS", "ZOMBIEITEMS", "FENCEITEMS", "CONSTRUCTIONITEMS", "DECORATIONITEMS", "FARMINGITEMS", "PLAYERITEMS"] as const) {
  try {
    const rows = parseItemTable(name, r1.entry(TABLE[name]));
    console.log(`${name.padEnd(18)} ${String(rows.length).padStart(3)} records, exact`);
  } catch (error) {
    failed++;
    console.log(`${name.padEnd(18)} FAILED: ${error}`);
  }
}

const items = loadItems(r1);
for (const [name, atNeighbor] of [["GAMEFIELDSETUP", false], ["GAMEFIELDSETUPTUTOR", true]] as const) {
  const rows = parseLayout(r1.entry(TABLE[name]));
  const { objects, skipped } = placeLayout(rows, items, { atNeighbor, missionCompleted: () => true });
  const missions = [...new Set(rows.map((r) => r.mission).filter((m) => m !== -1))].sort((a, b) => a - b);
  if (skipped.unknownItem) failed++;
  console.log(`${name.padEnd(19)} ${rows.length} rows, ${objects.length} placed, ${skipped.unknownItem} unknown items` +
    (missions.length ? `, gated on missions ${missions.join(", ")}` : ""));
}
if (failed) process.exit(1);
