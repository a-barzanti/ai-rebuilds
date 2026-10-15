// Parse every assets/bundle_<id>/0 descriptor using the layout in
// ../notes/sprites-and-animations.md and report whether each one is consumed exactly.
// Usage: bun check-bundles.ts <extracted-apk>/assets
import { readdirSync } from "node:fs";

const dir = Bun.argv[2];
if (!dir) throw new Error("usage: bun check-bundles.ts <extracted-apk>/assets");
let exact = 0, regions = 0;
const notes: string[] = [];

for (const name of readdirSync(dir).filter((n) => n.startsWith("bundle_"))) {
  const id = Number(name.slice("bundle_".length));
  const b = new Uint8Array(await Bun.file(`${dir}/${name}/0`).arrayBuffer());
  const dv = new DataView(b.buffer);
  let p = 0;
  if (id === 0) {
    const slots = dv.getInt32(0), bundles = dv.getInt16(4), pngs = dv.getInt16(6);
    notes.push(`bundle_0 master header: ${slots} bundle slots, ${bundles} bundles, ${pngs} PNGs`);
    p = 8;
  }
  const bundleId = dv.getInt32(p); p += 4;
  p += 4; // version
  p += 1; // unused
  p += 1; // color depth
  const pngCount = dv.getInt16(p); p += 2;
  for (let png = 0; png < pngCount; png++) {
    const n = dv.getInt16(p); p += 2;
    regions += n;
    p += 8 * n; // x, y, w, h as s16
  }
  const files = readdirSync(`${dir}/${name}`).filter((f) => f.endsWith(".png")).length;
  if (bundleId !== id) notes.push(`${name}: descriptor id ${bundleId}`);
  if (files !== pngCount) notes.push(`${name}: descriptor lists ${pngCount} PNGs, folder has ${files}`);
  if (p === b.length) exact++;
  else notes.push(`${name}: ${b.length - p} bytes left over`);
}

console.log({ exact, regions });
console.log(notes.join("\n"));
