// Draws Zombie Lane animations onto a Canvas 2D context, following the drawing rules in
// ../notes/sprites-and-animations.md ("Drawing").

import { frameAt, timelineValue, PROFILE } from "./formats.js";

const DEG_PER_UNIT = 360 / 65536;
const css = (rgb) => `#${(rgb & 0xffffff).toString(16).padStart(6, "0")}`;

export class AnimationRenderer {
  /** @param {import("./assets.js").GameAssets} assets */
  constructor(assets) {
    this.assets = assets;
    this.profile = PROFILE.DEFAULT;
    this.shapes = true; // draw vector primitives (lines, rects, ellipses, paths)
    this.missing = 0; // images skipped in the last draw because their art isn't available
  }

  /**
   * Draw `animation` with its anchor at (x, y) at time t (ms).
   * flip: bit 0 mirrors horizontally, bit 1 vertically, around the anchor.
   */
  draw(ctx, animation, x, y, t, { flip = 0, loop = true } = {}) {
    this.missing = 0;
    this.#sprite(ctx, animation, x, y, t, flip, loop, 0);
  }

  #sprite(ctx, animation, x, y, t, flip, loop, depth) {
    if (animation.kind !== "animation" || animation.frames.length === 0 || depth > 8) return;
    ctx.save();
    if (animation.timeline) {
      const color = timelineValue(animation, 0, t, loop);
      const alpha = (color >>> 24) & 255;
      if (alpha === 0) { ctx.restore(); return; }
      x += timelineValue(animation, 1, t, loop);
      y += timelineValue(animation, 2, t, loop);
      ctx.translate(x, y);
      ctx.rotate((timelineValue(animation, 5, t, loop) * DEG_PER_UNIT * Math.PI) / 180);
      ctx.scale(timelineValue(animation, 3, t, loop) / 1024, timelineValue(animation, 4, t, loop) / 1024);
      ctx.globalAlpha *= alpha / 255; // RGB tint (0x80 = neutral) isn't applied yet
    } else {
      ctx.translate(x, y);
    }

    const length = animation.duration;
    const local = t >= length ? t % length : t;
    const index = frameAt(animation, local);
    const frame = animation.frames[index];
    if (frame?.data) {
      const nestedTime = animation.continuousNested ? t : local - frame.start;
      this.#frame(ctx, frame.data, flip, nestedTime, depth);
    }
    ctx.restore();
  }

  #frame(ctx, data, flip, nestedTime, depth) {
    const sx = flip & 1 ? -1 : 1, sy = flip & 2 ? -1 : 1;
    let clipped = false;
    for (const item of data.items) {
      switch (item.type) {
        case "image": {
          const region = this.assets.region(item);
          if (!region) { this.missing++; break; }
          ctx.save();
          ctx.scale(sx, sy);
          drawRegion(ctx, region, item.x, item.y, item.flip);
          ctx.restore();
          break;
        }
        case "clip": // replaces any earlier clip in this frame; unrotated, unflipped
          if (clipped) ctx.restore();
          ctx.save();
          clipped = true;
          ctx.beginPath();
          ctx.rect(item.x, item.y, item.w, item.h);
          ctx.clip();
          break;
        case "nested": {
          const child = this.assets.resolve(item.id, this.profile).animation;
          this.#sprite(ctx, child, item.x * sx, item.y * sy, nestedTime, flip, true, depth + 1);
          break;
        }
        case "particles":
          break; // 6 frames in the whole game; not simulated yet
        default:
          if (this.shapes) drawShape(ctx, item, flip);
      }
    }
    if (clipped) ctx.restore();
  }
}

function drawRegion(ctx, r, x, y, flip) {
  if (!flip) {
    ctx.drawImage(r.image, r.x, r.y, r.w, r.h, x, y, r.w, r.h);
    return;
  }
  ctx.save();
  ctx.translate(x + (flip & 1 ? r.w : 0), y + (flip & 2 ? r.h : 0));
  ctx.scale(flip & 1 ? -1 : 1, flip & 2 ? -1 : 1);
  ctx.drawImage(r.image, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
  ctx.restore();
}

function drawShape(ctx, item, flip) {
  ctx.fillStyle = ctx.strokeStyle = css(item.color);
  ctx.lineWidth = 1;
  switch (item.type) {
    case "line": // the original doesn't mirror lines
      ctx.beginPath();
      ctx.moveTo(item.x1, item.y1);
      ctx.lineTo(item.x2, item.y2);
      ctx.stroke();
      break;
    case "rect":
    case "fillRect":
    case "ellipse": {
      const x = flip === 1 && item.x !== 0 ? -item.x - item.w : item.x;
      if (item.type === "rect") ctx.strokeRect(x + 0.5, item.y + 0.5, item.w, item.h);
      else if (item.type === "fillRect") ctx.fillRect(x, item.y, item.w, item.h);
      else {
        ctx.beginPath();
        ctx.ellipse(x + item.w / 2, item.y + item.h / 2, item.w / 2, item.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "polygon":
    case "path": {
      const sx = flip & 1 ? -1 : 1;
      ctx.beginPath();
      for (let i = 0; i < item.points.length; i += 2) ctx.lineTo(item.points[i] * sx, item.points[i + 1]);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
}

/** Bounding box of everything an animation draws, relative to its anchor (images and shapes, all frames). */
export function measure(assets, animation) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const add = (x, y, w = 0, h = 0) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + w); y1 = Math.max(y1, y + h); };
  if (animation.kind !== "animation") return null;
  for (const frame of animation.frames) {
    for (const item of frame.data?.items ?? []) {
      if (item.type === "image") {
        const r = assets.region(item);
        if (r) add(item.x, item.y, r.w, r.h);
      } else if (item.type === "nested") add(item.x, item.y);
      else if (item.type === "line") { add(item.x1, item.y1); add(item.x2, item.y2); }
      else if ("w" in item) add(item.x, item.y, item.w, item.h);
    }
  }
  if (!Number.isFinite(x0)) {
    const b = animation.bounds;
    return b.w || b.h ? b : null;
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
