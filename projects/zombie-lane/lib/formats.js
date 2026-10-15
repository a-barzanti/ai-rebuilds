// Parsers for Zombie Lane's data formats. Each layout is documented in ../notes/:
// resource-formats.md (indexed tables, IDs) and sprites-and-animations.md (bundles, animations).
// All integers are big-endian.

export const PROFILE = { DEFAULT: 0, VGA: 1, HD: 2 };
export const FIRST_ANIMATION = 22;
export const LAST_ANIMATION = 18691;

/** Resource ID → { file, index }. File 0 means a standalone asset file named by the index. */
export const splitId = (id) => ({ file: id >>> 16, index: id & 0xffff });

/** Image reference → bundle, PNG number (1-based) and region index. */
export const splitImageRef = (ref) => ({ bundle: ref >>> 20, png: (ref & 0xfffff) >>> 14, region: ref & 0x3fff });

class Reader {
  /** @param {Uint8Array} bytes */
  constructor(bytes) {
    this.bytes = bytes;
    this.dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.p = 0;
  }
  need(n) { if (this.p + n > this.bytes.length) throw new Error(`Unexpected end of data at byte ${this.p}`); }
  u8() { this.need(1); return this.bytes[this.p++]; }
  s8() { this.need(1); return this.dv.getInt8(this.p++); }
  s16() { this.need(2); const v = this.dv.getInt16(this.p); this.p += 2; return v; }
  s32() { this.need(4); const v = this.dv.getInt32(this.p); this.p += 4; return v; }
  get done() { return this.p === this.bytes.length; }
}

/** The indexed table container used by r1 and the l*_* text files. */
export function indexedTable(bytes) {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const count = dv.getUint32(4);
  const offset = (i) => dv.getUint32(8 + 4 * i);
  return {
    count,
    entry(i) {
      if (i < 0 || i >= count) throw new RangeError(`No entry ${i}`);
      return bytes.subarray(offset(i), i + 1 < count ? offset(i + 1) : bytes.length);
    },
  };
}

/** Java DataInput.readUTF: u16 length + modified UTF-8. */
export function readUTF(bytes, at = 0) {
  const length = (bytes[at] << 8) | bytes[at + 1];
  let out = "";
  for (let p = at + 2, end = p + length; p < end; ) {
    const a = bytes[p++];
    if (a < 0x80) out += String.fromCharCode(a);
    else if ((a & 0xe0) === 0xc0) out += String.fromCharCode(((a & 0x1f) << 6) | (bytes[p++] & 0x3f));
    else { const b = bytes[p++], c = bytes[p++]; out += String.fromCharCode(((a & 0x0f) << 12) | ((b & 0x3f) << 6) | (c & 0x3f)); }
  }
  return out;
}

/**
 * A bundle descriptor (assets/bundle_<id>/0). Pass isMaster for bundle_0, which starts with an
 * 8-byte header.
 */
export function parseBundle(bytes, isMaster = false) {
  const r = new Reader(bytes);
  let master = null;
  if (isMaster) master = { slots: r.s32(), bundles: r.s16(), pngs: r.s16() };
  const id = r.s32();
  const version = r.s32();
  r.u8();
  const colorDepth = r.u8();
  const pngCount = r.s16();
  /** @type {{x:number,y:number,w:number,h:number}[][]} */
  const pngs = [];
  for (let i = 0; i < pngCount; i++) {
    const regions = [];
    for (let n = r.s16(); n > 0; n--) regions.push({ x: r.s16(), y: r.s16(), w: r.s16(), h: r.s16() });
    pngs.push(regions);
  }
  return { id, version, colorDepth, pngs, master };
}

/**
 * One r1 entry in the animation range: either a link entry that picks a resolution variant,
 * or an animation.
 */
export function parseAnimationEntry(bytes) {
  const r = new Reader(bytes);
  if (r.u8() === 1) {
    /** @type {Record<number, number>} */
    const targets = {};
    for (let n = r.s32(); n > 0; n--) { const profile = r.s32(); targets[profile] = r.s32(); }
    return { kind: "link", targets };
  }
  return parseAnimation(r);
}

const CHANNEL_NEUTRAL = [-8355712, 0, 0, 1024, 1024, 0]; // color 0xFF808080, x, y, scale w, scale h, rotation

function parseAnimation(r) {
  const bundle = r.s32();
  const flags = r.u8();
  const wide = (flags & 1) !== 0;
  const wideDurations = (flags & 2) !== 0;
  const frameCount = r.u8();
  const loop = r.u8() !== 0;
  const continuousNested = r.u8() !== 0;
  const coord = () => (wide ? r.s16() : r.s8());
  const size = () => (wide ? r.s16() : r.u8());
  const rect = () => ({ x: coord(), y: coord(), w: size(), h: size() });
  const bounds = rect();
  const alignment = r.u8();

  const sharing = [];
  for (let f = 0; f < frameCount; f++) sharing.push(r.u8());
  const frames = [];
  let start = 0;
  for (let f = 0; f < frameCount; f++) {
    let duration = wideDurations ? r.s16() & 0xffff : r.u8();
    if (duration === 0) duration = Infinity; // hold forever
    frames.push({ start, duration, data: null });
    start += duration;
  }

  let timeline = null;
  if (r.u8()) {
    const timelineBounds = rect();
    const channels = [];
    for (let ch = 0; ch < 6; ch++) {
      const keys = [];
      for (let n = r.u8(); n > 0; n--) {
        const time = r.s32(), mode = r.u8();
        keys.push({ time, mode, value: ch === 1 || ch === 2 ? coord() : r.s32() });
      }
      channels.push(keys);
    }
    timeline = { bounds: timelineBounds, channels };
  }

  const ownsData = (f) => frameCount <= 1 || sharing[f] === 255;
  for (let f = 0; f < frameCount; f++) if (ownsData(f)) frames[f].data = parseFrame(r, coord, size, rect);
  for (let f = 0; f < frameCount; f++) if (!ownsData(f)) frames[f].data = frames[sharing[f]].data;

  return { kind: "animation", bundle, wide, loop, continuousNested, bounds, alignment, frames, duration: start, timeline };
}

function parseFrame(r, coord, size, rect) {
  const w = size(), h = size();
  const boxes = [];
  for (let n = r.u8(); n > 0; n--) boxes.push({ id: r.u8(), ...rect() });
  const items = [];
  for (let n = r.s16(); n > 0; n--) {
    const type = r.u8();
    if (type === 1) {
      const x = coord(), y = coord();
      const flip = r.u8() & 15;
      const ref = r.s32();
      r.u8(); // pixel format
      items.push({ type: "image", x, y, flip, ref, ...splitImageRef(ref) });
    } else if (type === 9) {
      const x = coord(), y = coord();
      const loop = r.u8();
      items.push({ type: "nested", x, y, loop, id: r.s32() });
    } else if (type === 7) {
      items.push({ type: "clip", ...rect() });
    } else if (type === 10) {
      const animations = [];
      for (let k = r.s16(); k > 0; k--) animations.push(r.s32());
      const area = rect();
      const bools = [r.u8(), r.u8(), r.u8(), r.u8(), r.u8()].map((b) => b === 1);
      const shorts = Array.from({ length: 13 }, () => r.s16());
      const ints = Array.from({ length: 4 }, () => r.s32());
      items.push({ type: "particles", animations, ...area, bools, shorts, ints });
    } else {
      const color = r.s32();
      if (type === 6 || type === 8) {
        const points = [];
        for (let k = r.u8(); k > 0; k--) points.push(coord(), coord());
        items.push({ type: type === 6 ? "polygon" : "path", color, points });
      } else if (type === 4) {
        items.push({ type: "line", color, x1: coord(), y1: coord(), x2: coord(), y2: coord() });
      } else if (type === 2 || type === 3 || type === 5) {
        items.push({ type: { 2: "fillRect", 3: "rect", 5: "ellipse" }[type], color, ...rect() });
      } else throw new Error(`Unknown renderable type ${type}`);
    }
  }
  return { w, h, boxes, items };
}

/** Index of the frame showing at time t (ms, already wrapped into the animation's length). */
export function frameAt(animation, t) {
  for (let f = animation.frames.length - 1; f >= 0; f--) if (t >= animation.frames[f].start) return f;
  return -1;
}

const idiv = (a, b) => Math.trunc(a / b);
const lerp = (a, b, t, span) => idiv((b - a) * t, span) + a;
const easeIn = (a, b, t, span) => idiv((b - a) * idiv(t * t, span), span) + a;
const easeOut = (a, b, t, span) => idiv(idiv(-(b - a) * t, span) * (t - 2 * span), span) + a;
function easeInOut(a, b, t, span) {
  const t2 = t * 2;
  if (t2 < span) return idiv(idiv(t2 * t2, span) * ((b - a) >> 1), span) + a;
  const u = t2 - span;
  return idiv((idiv(u * (u - 2 * span), span) - span) * -((b - a) >> 1), span) + a;
}
const perChannel = (fn, a, b, t, span) =>
  (fn((a >>> 24) & 255, (b >>> 24) & 255, t, span) << 24) |
  (fn((a >> 16) & 255, (b >> 16) & 255, t, span) << 16) |
  (fn((a >> 8) & 255, (b >> 8) & 255, t, span) << 8) |
  fn(a & 255, b & 255, t, span);

/**
 * Value of timeline channel ch (0 color, 1 x, 2 y, 3 scale w, 4 scale h, 5 rotation) at time t.
 * Scale is in 1/1024ths, rotation in 1/65536ths of a turn, color is 0xAARRGGBB with 0x80 = neutral.
 */
export function timelineValue(animation, ch, t, loop) {
  const length = animation.duration;
  if (t >= length) t = loop ? t % length : length - 1;
  const keys = animation.timeline.channels[ch];
  if (keys.length === 0) return CHANNEL_NEUTRAL[ch];
  let i = keys.length - 1;
  while (i >= 0 && t < keys[i].time) i--;
  if (i < 0) return -1;
  const key = keys[i];
  if (key.mode === 1) return key.value;
  let next = i + 1, span;
  if (next < keys.length) span = keys[next].time - key.time;
  else {
    if (!loop || !Number.isFinite(length)) return key.value;
    next = 0;
    span = length - key.time;
  }
  if (span <= 0) return key.value;
  const a = key.value, b = keys[next].value, dt = t - key.time;
  const fn = [lerp, null, easeIn, easeOut, easeInOut][key.mode];
  if (!fn) return -1;
  return ch === 0 ? perChannel(fn, a, b, dt, span) : fn(a, b, dt, span);
}
