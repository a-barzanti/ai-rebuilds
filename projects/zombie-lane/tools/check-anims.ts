// Parse every animation entry in r1 (indexes 22..18691) using the layout in
// ../notes/sprites-and-animations.md and report whether each one is consumed exactly.
// Usage: bun check-anims.ts <extracted-apk>/assets
import { existsSync } from "node:fs";

const dir = Bun.argv[2];
if (!dir) throw new Error("usage: bun check-anims.ts <extracted-apk>/assets");
const buf = new Uint8Array(await Bun.file(`${dir}/r1`).arrayBuffer());
const dv = new DataView(buf.buffer);
const count = dv.getUint32(4);
const start = (i: number) => dv.getUint32(8 + 4 * i);
const end = (i: number) => (i + 1 < count ? start(i + 1) : buf.length);
const FIRST_ANIM = 22, LAST_ANIM = 18691;

class Reader {
  p: number;
  constructor(public begin: number, public end: number) { this.p = begin; }
  private need(n: number) { if (this.p + n > this.end) throw new Error(`read past end at ${this.p - this.begin}`); }
  u8() { this.need(1); return buf[this.p++]; }
  s8() { const v = this.u8(); return v > 127 ? v - 256 : v; }
  s16() { this.need(2); const v = dv.getInt16(this.p); this.p += 2; return v; }
  s32() { this.need(4); const v = dv.getInt32(this.p); this.p += 4; return v; }
}

const tally = (o: Record<number, number>, k: number) => (o[k] = (o[k] ?? 0) + 1);
const stats = {
  linkEntries: 0, animEntries: 0, exact: 0, failed: 0, frames: 0, sharedFrames: 0, withTimeline: 0,
  renderables: {} as Record<number, number>, transforms: {} as Record<number, number>,
  linkProfiles: {} as Record<number, number>, imageRefs: 0, imageRefsMissingPng: 0,
};
const missingArt = new Set<number>();
const links: [number, number, number][] = []; // [entry, profile, target]
const failures: string[] = [];

function animation(entry: number, r: Reader) {
  r.s32(); // bundle id
  const flags = r.u8();
  const small = (flags & 1) === 0, byteDurations = (flags & 2) === 0;
  const frameCount = r.u8();
  r.u8(); r.u8(); // loop preference, continuous nested animations
  const xy = () => (small ? [r.s8(), r.s8()] : [r.s16(), r.s16()]);
  const wh = () => (small ? [r.u8(), r.u8()] : [r.s16(), r.s16()]);
  const rect = () => [...xy(), ...wh()];
  rect(); // bounds
  r.u8(); // alignment
  const shared = Array.from({ length: frameCount }, () => r.u8());
  const ownsData = (f: number) => frameCount <= 1 || shared[f] === 255;
  for (let f = 0; f < frameCount; f++) byteDurations ? r.u8() : r.s16();
  if (r.u8()) {
    stats.withTimeline++;
    rect(); // timeline bounds
    for (let channel = 0; channel < 6; channel++) {
      const keys = r.u8();
      for (let k = 0; k < keys; k++) {
        r.s32(); r.u8(); // time, easing mode
        channel === 1 || channel === 2 ? (small ? r.s8() : r.s16()) : r.s32();
      }
    }
  }
  for (let f = 0; f < frameCount; f++) {
    if (!ownsData(f)) { stats.sharedFrames++; continue; }
    stats.frames++;
    wh(); // frame size
    const boxes = r.u8();
    for (let b = 0; b < boxes; b++) { r.u8(); rect(); }
    const renderables = r.s16();
    for (let k = 0; k < renderables; k++) {
      const type = r.u8();
      tally(stats.renderables, type);
      if (type === 1) { // image
        xy();
        tally(stats.transforms, r.u8() & 15);
        const ref = r.s32();
        r.u8(); // pixel format
        stats.imageRefs++;
        const bundle = ref >>> 20, png = (ref & 0xfffff) >> 14;
        if (!existsSync(`${dir}/bundle_${bundle}/${png}.png`)) { stats.imageRefsMissingPng++; missingArt.add(entry); }
      } else if (type === 9) { xy(); r.u8(); r.s32(); } // nested animation
      else if (type === 7) rect(); // clip rect
      else if (type === 10) { // particle emitter
        const anims = r.s16();
        for (let j = 0; j < anims; j++) r.s32();
        rect();
        for (let j = 0; j < 5; j++) r.u8();
        for (let j = 0; j < 13; j++) r.s16();
        for (let j = 0; j < 4; j++) r.s32();
      } else { // primitives: color first
        r.s32();
        if (type === 6 || type === 8) { const points = r.u8(); for (let j = 0; j < points; j++) xy(); }
        else if (type === 4) { xy(); xy(); }
        else rect();
      }
    }
  }
}

for (let i = FIRST_ANIM; i <= LAST_ANIM; i++) {
  const r = new Reader(start(i), end(i));
  try {
    if (r.u8() === 1) {
      stats.linkEntries++;
      const n = r.s32();
      for (let j = 0; j < n; j++) { const profile = r.s32(), target = r.s32(); tally(stats.linkProfiles, profile); links.push([i, profile, target & 0xffff]); }
    } else {
      stats.animEntries++;
      animation(i, r);
    }
    if (r.p === r.end) stats.exact++;
    else { stats.failed++; failures.push(`${i}: ${r.end - r.p} bytes left over`); }
  } catch (e) { stats.failed++; failures.push(`${i}: ${(e as Error).message}`); }
}

const missing = (profile: number) => links.filter(([, p, t]) => p === profile && missingArt.has(t)).length;
console.log(JSON.stringify({
  ...stats,
  defaultTargetsWithMissingArt: missing(0),
  vgaTargetsWithMissingArt: missing(1),
  hdTargetsWithMissingArt: missing(2),
}, null, 1));
if (failures.length) console.log(failures.slice(0, 20).join("\n"));
