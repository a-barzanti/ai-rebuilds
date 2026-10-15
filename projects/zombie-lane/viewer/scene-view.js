// Scenes tab of the asset viewer: draws a layout table (GAMEFIELDSETUP*) on the isometric grid.

import { measure } from "../lib/render.js";
import { readUTF, indexedTable } from "../lib/formats.js";
import {
  TABLE, GRID, OBJECT, FLOOR_ANIMATION, SKY_ANIMATION,
  loadItems, parseLayout, placeLayout, idleAnimation, tileToWorld, worldToScreen, drawOrder,
} from "../lib/scene.js";

const SCENES = {
  home: { table: TABLE.GAMEFIELDSETUP, atNeighbor: false },
  rob: { table: TABLE.GAMEFIELDSETUPTUTOR, atNeighbor: true },
};
const KIND = { [OBJECT.CONSTRUCTION]: "building", [OBJECT.PLAYER]: "player", [OBJECT.ZOMBIE]: "zombie", [OBJECT.LOOT]: "object", [OBJECT.DECORATION]: "decoration", [OBJECT.FENCE]: "fence", [OBJECT.FARMING]: "crop" };

export class SceneView {
  /**
   * @param {import("../lib/assets.js").GameAssets} assets
   * @param {import("../lib/render.js").AnimationRenderer} renderer
   */
  constructor(assets, renderer, els) {
    this.assets = assets;
    this.renderer = renderer;
    this.els = els;
    this.items = loadItems(assets.r1);
    this.scene = null; // { key, objects, skipped, floor, sky, box }
    this.view = null; // { x, y, zoom } in CSS pixels; null = fit
    this.highlight = null; // item key to outline
    this.hover = null;
    this.token = 0;
  }

  async texts() {
    if (this.text) return this.text;
    const bytes = await this.assets.zip.read("assets/l0_0");
    const table = bytes ? indexedTable(bytes) : null;
    this.text = (id) => (table && id >= 0 && (id & 0xffff) < table.count ? readUTF(table.entry(id & 0xffff)) : "");
    return this.text;
  }

  async load(key) {
    const token = ++this.token;
    const { table, atNeighbor } = SCENES[key];
    const text = await this.texts();
    const allDone = this.els.missions.checked;
    const rows = parseLayout(this.assets.r1.entry(table));
    const { objects, skipped } = placeLayout(rows, this.items, { missionCompleted: () => allDone, atNeighbor });

    const fences = new Set(objects.filter((o) => o.objectType === OBJECT.FENCE).map((o) => o.column * GRID + o.row));
    const fenceAt = (c, r) => fences.has(c * GRID + r);
    const jobs = [];
    const prepared = new Map();
    const prepare = (id) => {
      if (!prepared.has(id)) {
        const animation = this.assets.resolve(id).animation;
        prepared.set(id, animation);
        if (animation.kind === "animation") jobs.push(this.assets.prepare(animation));
      }
      return prepared.get(id);
    };
    for (const o of objects) {
      o.world = tileToWorld(o.column, o.row);
      o.screen = worldToScreen(o.world.x, o.world.y);
      o.name = text(o.item.title) || `${KIND[o.objectType]} ${o.item.type}:${o.item.id}`;
      o.key = `${o.item.type}:${o.item.id}`;
      const pick = idleAnimation(o, fenceAt);
      const id = pick && o.item.animations[pick.index];
      o.animation = id > 0 ? prepare(id) : null;
      o.holdFrame = pick?.holdFrame ?? null;
      o.shadow = o.item.shadow > 0 ? prepare(o.item.shadow) : null;
      o.phase = (o.id * 397) % 1000; // so identical objects don't animate in lockstep
    }
    objects.sort(drawOrder);
    const floor = prepare(FLOOR_ANIMATION);
    const sky = prepare(SKY_ANIMATION);
    await Promise.all(jobs);
    if (token !== this.token) return;
    const box = measure(this.assets, floor) ?? { x: 0, y: -330, w: 2150, h: 1170 };
    this.scene = { key, objects, skipped, floor, sky, box, skyBox: measure(this.assets, sky) };
    this.view = null;
    this.highlight = null;
    this.fillList();
    this.fillInfo();
  }

  fillList() {
    const { objects, skipped } = this.scene;
    const groups = new Map();
    for (const o of objects) {
      const g = groups.get(o.key) ?? { name: o.name, kind: KIND[o.objectType], n: 0 };
      g.n++;
      groups.set(o.key, g);
    }
    const sorted = [...groups].sort((a, b) => b[1].n - a[1].n || a[1].name.localeCompare(b[1].name));
    this.els.list.replaceChildren(...sorted.map(([key, g]) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.key = key;
      button.textContent = `${g.n} × ${g.name}`;
      button.title = `${g.kind}, item ${key}. Click to outline them.`;
      li.append(button);
      return li;
    }));
    const hidden = skipped.mission ? `, ${skipped.mission} waiting for missions` : "";
    this.els.count.textContent = `${objects.length} objects${hidden}`;
  }

  fillInfo() {
    const { objects, skipped, key } = this.scene;
    const counts = {};
    for (const o of objects) counts[KIND[o.objectType]] = (counts[KIND[o.objectType]] ?? 0) + 1;
    const rows = [
      ["Layout table", key === "home" ? "GAMEFIELDSETUP (r1 entry 18723)" : "GAMEFIELDSETUPTUTOR (r1 entry 18724)"],
      ["Grid", `${GRID} × ${GRID} tiles`],
      ["Placed", Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v} ${k}`).join(", ")],
    ];
    if (skipped.mission) rows.push(["Hidden until a mission is done", String(skipped.mission)]);
    if (skipped.neighbor) rows.push(["Hidden when visiting", String(skipped.neighbor)]);
    if (objects.some((o) => o.objectType === OBJECT.PLAYER)) rows.push(["Not drawn", "the player (their avatar comes from the profile)"]);
    this.els.info.replaceChildren(...rows.map(([k, v]) => {
      const div = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = k;
      dd.textContent = v;
      div.append(dt, dd);
      return div;
    }));
  }

  fit(w, h) {
    const { box } = this.scene;
    const zoom = Math.min((w - 24) / box.w, (h - 24) / box.h);
    return { zoom, x: w / 2 - (box.x + box.w / 2) * zoom, y: h / 2 - (box.y + box.h / 2) * zoom };
  }

  currentView(w, h) {
    if (this.view) return this.view;
    const z = this.els.zoom.value;
    const fit = this.fit(w, h);
    if (z === "fit") return fit;
    const zoom = Number(z);
    const { box } = this.scene;
    return { zoom, x: w / 2 - (box.x + box.w / 2) * zoom, y: h / 2 - (box.y + box.h / 2) * zoom };
  }

  draw(ctx, w, h, t) {
    if (!this.scene) return;
    const { objects, floor, sky, skyBox } = this.scene;
    const r = this.renderer;
    if (sky.kind === "animation" && skyBox) {
      ctx.save();
      ctx.scale(w / skyBox.w, h / skyBox.h);
      r.draw(ctx, sky, -skyBox.x, -skyBox.y, t);
      ctx.restore();
    } else {
      ctx.fillStyle = "#6f8fa8";
      ctx.fillRect(0, 0, w, h);
    }
    const v = this.currentView(w, h);
    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.scale(v.zoom, v.zoom);
    ctx.imageSmoothingEnabled = v.zoom < 1;
    r.shapes = true; // the ground is drawn with filled triangles
    r.draw(ctx, floor, 0, 0, t);
    if (this.els.grid.checked) this.drawGrid(ctx, v.zoom);
    const shadows = this.els.shadows.checked;
    for (const o of objects) {
      if (shadows && o.shadow) r.draw(ctx, o.shadow, o.screen.x, o.screen.y, t);
    }
    for (const o of objects) {
      const a = o.animation;
      if (a?.kind !== "animation") continue;
      const time = o.holdFrame !== null ? a.frames[Math.min(o.holdFrame, a.frames.length - 1)].start : t + o.phase;
      r.draw(ctx, a, o.screen.x, o.screen.y, time);
    }
    for (const o of objects) {
      if (o.key !== this.highlight && o !== this.hover) continue;
      ctx.strokeStyle = o === this.hover ? "#facc15" : "#ef4444";
      ctx.lineWidth = 2 / v.zoom;
      this.tileOutline(ctx, o.column, o.row);
    }
    ctx.restore();
  }

  tileOutline(ctx, c, r) {
    const corners = [[c, r], [c + 1, r], [c + 1, r + 1], [c, r + 1]].map(([cc, rr]) => worldToScreen(cc * 48, rr * 48));
    ctx.beginPath();
    for (const p of corners) ctx.lineTo(p.x, p.y);
    ctx.closePath();
    ctx.stroke();
  }

  drawGrid(ctx, zoom) {
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1 / zoom;
    ctx.beginPath();
    for (let i = 0; i <= GRID; i++) {
      let a = worldToScreen(i * 48, 0), b = worldToScreen(i * 48, GRID * 48);
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      a = worldToScreen(0, i * 48); b = worldToScreen(GRID * 48, i * 48);
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
  }

  /** Object whose tile is under a point in CSS pixels, front-most first. */
  pick(px, py, w, h) {
    if (!this.scene) return null;
    const v = this.currentView(w, h);
    const sx = (px - v.x) / v.zoom, sy = (py - v.y) / v.zoom;
    // Invert the projection: screen = k·M·world with M = (40, 26; −10, 26).
    const k = 0.65 / 48, det = 40 * 26 - 26 * -10;
    const wx = (26 * sx - 26 * sy) / (det * k), wy = (10 * sx + 40 * sy) / (det * k);
    const c = Math.floor(wx / 48), r = Math.floor(wy / 48);
    for (let i = this.scene.objects.length - 1; i >= 0; i--) {
      const o = this.scene.objects[i];
      if (o.column === c && o.row === r && o.animation) return o;
    }
    return null;
  }

  /** Zoom by `factor` keeping the point (px, py) fixed. */
  zoomAt(px, py, factor, w, h) {
    const v = { ...this.currentView(w, h) };
    const zoom = Math.max(0.1, Math.min(6, v.zoom * factor));
    v.x = px - ((px - v.x) * zoom) / v.zoom;
    v.y = py - ((py - v.y) * zoom) / v.zoom;
    v.zoom = zoom;
    this.view = v;
  }

  panBy(dx, dy, w, h) {
    const v = { ...this.currentView(w, h) };
    v.x += dx;
    v.y += dy;
    this.view = v;
  }
}
