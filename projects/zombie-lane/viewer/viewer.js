// Zombie Lane asset viewer: pick the APK, browse animations, play them on a canvas.

import { GameAssets, KNOWN_SHA256, sha256 } from "../lib/assets.js";
import { AnimationRenderer, measure } from "../lib/render.js";
import { FIRST_ANIMATION, LAST_ANIMATION, PROFILE, frameAt } from "../lib/formats.js";

const $ = (id) => document.getElementById(id);
const els = {
  apk: $("apk"), drop: $("drop"), status: $("status"), workspace: $("workspace"), openPanel: $("open-panel"),
  search: $("search"), family: $("family"), variants: $("variants"), dropTitle: $("drop-title"), count: $("count"), list: $("list"),
  stage: $("stage"), stageWrap: $("stage-wrap"), note: $("stage-note"),
  prev: $("prev"), play: $("play"), next: $("next"), frameRead: $("frame-read"),
  speed: $("speed"), zoom: $("zoom"), variant: $("variant"), variantLabel: $("variant-label"),
  loop: $("loop"), flip: $("flip"), shapes: $("shapes"), boxes: $("boxes"), anchor: $("anchor"), bg: $("bg"),
  info: $("info"),
};
const LIST_LIMIT = 400;
const params = new URLSearchParams(location.search); // ?apk=… (local testing), ?t=… (start paused at a time)
const ALIGN = [[1, "top"], [2, "left"], [4, "vcenter"], [8, "bottom"], [16, "hcenter"], [32, "right"]];

/** @type {GameAssets} */ let assets;
/** @type {AnimationRenderer} */ let renderer;
/** @type {{ index: number, name: string, family: string, search: string }[]} */ let all = [];
let filtered = [];
let current = null; // { index, name, entry, resolved, box, missing }
let selectToken = 0;
let t = 0, playing = true, last = performance.now();

function setStatus(text, kind = "") {
  els.status.textContent = text;
  els.status.className = `status ${kind}`;
}

async function open(file) {
  try {
    setStatus("Reading the APK…");
    const [opened, hash] = await Promise.all([GameAssets.open(file), sha256(file)]);
    assets = opened;
    renderer = new AnimationRenderer(assets);
    setStatus("Reading resource names…");
    const names = await assets.names();
    all = [];
    for (let i = FIRST_ANIMATION; i <= LAST_ANIMATION; i++) {
      const name = names.get(i) ?? `#${i}`;
      const family = name.startsWith("ANM_") ? name.split("_")[1] : "(unnamed)";
      const variant = /_(IPHONE|IPAD|VGA)$/.test(name);
      all.push({ index: i, name, family, variant, search: `${name.toLowerCase().replaceAll("_", " ")} #${i}` });
    }
    fillFamilies();
    const version = hash === KNOWN_SHA256
      ? "Version 1.0.33, the build the specs describe."
      : "This isn't the 1.0.33 build the specs describe, so some animations may not decode.";
    setStatus(`${file.name || "APK"} loaded: ${all.length.toLocaleString()} animations. ${version}`, "ok");
    els.workspace.hidden = false;
    els.openPanel.classList.add("loaded");
    els.dropTitle.textContent = "Open another APK";
    const start = byName(decodeURIComponent(location.hash.slice(1))) ?? all.find((a) => a.name === "ANM_ZOMBIE_SUPERMART_WALK_DOWN") ?? all[0];
    if (start.variant) els.variants.checked = true;
    els.family.value = start.family;
    applyFilter();
    await select(start.index);
  } catch (error) {
    console.error(error);
    setStatus(error instanceof Error ? error.message : String(error), "error");
  }
}

const byName = (name) => all.find((a) => a.name === name);

function fillFamilies() {
  const counts = new Map();
  for (const a of all) counts.set(a.family, (counts.get(a.family) ?? 0) + 1);
  const families = [...counts].sort((a, b) => b[1] - a[1]);
  els.family.replaceChildren(new Option("All families", ""), ...families.map(([f, n]) => new Option(`${f} (${n})`, f)));
}

function applyFilter() {
  const tokens = els.search.value.toLowerCase().split(/\s+/).filter(Boolean);
  const family = els.family.value;
  const variants = els.variants.checked;
  filtered = all.filter((a) => (variants || !a.variant) && (!family || a.family === family) && tokens.every((tok) => a.search.includes(tok)));
  els.count.textContent = `${filtered.length.toLocaleString()} of ${all.length.toLocaleString()} entries`;
  renderList();
}

function renderList() {
  const items = filtered.slice(0, LIST_LIMIT).map((a) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = a.name;
    button.title = `${a.name} (r1 entry ${a.index})`;
    button.dataset.index = String(a.index);
    if (current?.index === a.index) button.setAttribute("aria-current", "true");
    li.append(button);
    return li;
  });
  if (filtered.length > LIST_LIMIT) {
    const li = document.createElement("li");
    li.className = "more";
    li.textContent = `${(filtered.length - LIST_LIMIT).toLocaleString()} more. Narrow the search to see them.`;
    items.push(li);
  }
  els.list.replaceChildren(...items);
}

async function select(index) {
  const token = ++selectToken;
  const meta = all.find((a) => a.index === index);
  const id = 0x10000 | index;
  const entry = assets.entry(id);
  const profile = Number(els.variant.value);
  renderer.profile = profile;
  const resolved = assets.resolve(id, profile);
  let missing = 0;
  if (resolved.animation.kind === "animation") missing = await assets.prepare(resolved.animation, profile);
  if (token !== selectToken) return;
  current = { index, name: meta?.name ?? `#${index}`, entry, resolved, missing, box: measure(assets, resolved.animation) };
  t = 0;
  playing = !params.has("t");
  if (params.has("t")) t = Number(params.get("t")) || 0;
  els.variantLabel.hidden = entry.kind !== "link";
  history.replaceState(null, "", `${location.search}#${encodeURIComponent(current.name)}`);
  for (const b of els.list.querySelectorAll("button")) {
    if (b.dataset.index === String(index)) { b.setAttribute("aria-current", "true"); b.scrollIntoView({ block: "nearest" }); }
    else b.removeAttribute("aria-current");
  }
  updateInfo();
  updatePlayButton();
}

function updateInfo() {
  const { resolved, entry, index, name, missing } = current;
  const a = resolved.animation;
  const rows = [["Name", name], ["Resource ID", `${0x10000 | index} (r1 entry ${index})`]];
  if (entry.kind === "link") {
    const labels = { 0: "default", 1: "VGA", 2: "HD" };
    rows.push(["Variants", Object.entries(entry.targets).map(([p, id]) => `${labels[p]} #${id & 0xffff}`).join(", ")]);
    rows.push(["Showing", `#${resolved.id & 0xffff}${resolved.scale !== 1 ? ` at ${resolved.scale}×` : ""}`]);
  }
  if (a.kind === "animation") {
    const counts = {};
    for (const f of new Set(a.frames.map((f) => f.data))) for (const item of f?.items ?? []) counts[item.type] = (counts[item.type] ?? 0) + 1;
    rows.push(["Bundle", String(a.bundle)]);
    rows.push(["Frames", String(a.frames.length)]);
    rows.push(["Length", Number.isFinite(a.duration) ? `${a.duration} ms` : "holds on a frame"]);
    rows.push(["Loops by default", a.loop ? "yes" : "no"]);
    rows.push(["Timeline", a.timeline ? "yes" : "no"]);
    rows.push(["Alignment", ALIGN.filter(([bit]) => a.alignment & bit).map(([, n]) => n).join(", ") || "none"]);
    rows.push(["Draws", Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ") || "nothing"]);
    if (missing) rows.push(["Missing images", String(missing)]);
  }
  els.info.replaceChildren(...rows.map(([k, v]) => {
    const div = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = v;
    div.append(dt, dd);
    return div;
  }));
}

function updatePlayButton() {
  els.play.textContent = playing ? "Pause" : "Play";
}

function step(direction) {
  const a = current?.resolved.animation;
  if (a?.kind !== "animation") return;
  playing = false;
  updatePlayButton();
  const local = Number.isFinite(a.duration) && t >= a.duration ? t % a.duration : t;
  const n = a.frames.length;
  const f = (frameAt(a, local) + direction + n) % n;
  t = a.frames[f].start;
}

// Rendering

let checker = null;
function background(ctx, w, h) {
  const mode = els.bg.value;
  if (mode === "checker") {
    const dark = getComputedStyle(document.documentElement).getPropertyValue("color-scheme").trim() === "dark";
    const key = dark ? "dark" : "light";
    if (checker?.key !== key) {
      const c = new OffscreenCanvas(16, 16);
      const g = c.getContext("2d");
      g.fillStyle = dark ? "#1b1e25" : "#f3efe7"; g.fillRect(0, 0, 16, 16);
      g.fillStyle = dark ? "#23272f" : "#e6e0d4"; g.fillRect(0, 0, 8, 8); g.fillRect(8, 8, 8, 8);
      checker = { key, pattern: ctx.createPattern(c, "repeat") };
    }
    ctx.fillStyle = checker.pattern;
  } else ctx.fillStyle = { dark: "#121418", light: "#f6f3ec", grass: "#5f7d3c" }[mode];
  ctx.fillRect(0, 0, w, h);
}

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(now - last, 500);
  last = now;
  const canvas = els.stage;
  const dpr = window.devicePixelRatio || 1;
  const w = els.stageWrap.clientWidth, h = els.stageWrap.clientHeight;
  if (!w || !h) return; // hidden until an APK is open
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  background(ctx, w, h);

  const a = current?.resolved.animation;
  if (a?.kind === "animation") {
    if (playing) {
      t += dt * Number(els.speed.value);
      if (!els.loop.checked && Number.isFinite(a.duration) && t >= a.duration) {
        t = a.duration - 1;
        playing = false;
        updatePlayButton();
      }
    }
    const scale = current.resolved.scale;
    const box = current.box ?? { x: -16, y: -16, w: 32, h: 32 };
    let zoom = Number(els.zoom.value);
    if (els.zoom.value === "fit") zoom = Math.max(0.25, Math.min(6, (w - 48) / (box.w * scale || 1), (h - 48) / (box.h * scale || 1)));
    const flip = els.flip.checked ? 1 : 0;
    const cx = (box.x + box.w / 2) * (flip ? -1 : 1);
    const ax = Math.round(w / 2 - cx * zoom * scale);
    const ay = Math.round(h / 2 - (box.y + box.h / 2) * zoom * scale);

    ctx.save();
    ctx.imageSmoothingEnabled = zoom * scale < 1;
    ctx.translate(ax, ay);
    ctx.scale(zoom * scale, zoom * scale);
    renderer.shapes = els.shapes.checked;
    renderer.draw(ctx, a, 0, 0, t, { flip, loop: els.loop.checked });
    ctx.restore();

    const local = Number.isFinite(a.duration) && t >= a.duration ? t % a.duration : t;
    const index = frameAt(a, local);
    if (els.boxes.checked) {
      ctx.save();
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;
      for (const b of a.frames[index]?.data?.boxes ?? []) {
        const bx = flip ? -b.x - b.w : b.x;
        ctx.strokeRect(ax + bx * zoom * scale + 0.5, ay + b.y * zoom * scale + 0.5, b.w * zoom * scale, b.h * zoom * scale);
      }
      ctx.restore();
    }
    if (els.anchor.checked) {
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ax - 8, ay + 0.5); ctx.lineTo(ax + 9, ay + 0.5);
      ctx.moveTo(ax + 0.5, ay - 8); ctx.lineTo(ax + 0.5, ay + 9);
      ctx.stroke();
    }
    els.frameRead.textContent = `frame ${index + 1}/${a.frames.length} · ${Math.floor(local)} ms`;
    const notes = [];
    if (current.resolved.note) notes.push(current.resolved.note);
    if (renderer.missing) notes.push(`${renderer.missing} image(s) in this frame aren't in the APK.`);
    els.note.hidden = notes.length === 0;
    els.note.textContent = notes.join(" ");
  } else if (current) {
    els.frameRead.textContent = "–";
    els.note.hidden = false;
    els.note.textContent = "This entry isn't an animation the viewer can draw.";
  }
}

// Events

els.apk.addEventListener("change", () => { if (els.apk.files[0]) open(els.apk.files[0]); });
for (const type of ["dragenter", "dragover"]) els.drop.addEventListener(type, (e) => { e.preventDefault(); els.drop.classList.add("over"); });
for (const type of ["dragleave", "drop"]) els.drop.addEventListener(type, () => els.drop.classList.remove("over"));
els.drop.addEventListener("drop", (e) => { e.preventDefault(); const f = e.dataTransfer?.files[0]; if (f) open(f); });

els.search.addEventListener("input", applyFilter);
els.family.addEventListener("change", applyFilter);
els.variants.addEventListener("change", applyFilter);
window.addEventListener("hashchange", () => {
  const target = assets && byName(decodeURIComponent(location.hash.slice(1)));
  if (target && target.index !== current?.index) select(target.index);
});
els.list.addEventListener("click", (e) => {
  const button = e.target instanceof Element ? e.target.closest("button[data-index]") : null;
  if (button) select(Number(button.dataset.index));
});
els.play.addEventListener("click", () => { playing = !playing; updatePlayButton(); });
els.prev.addEventListener("click", () => step(-1));
els.next.addEventListener("click", () => step(1));
els.variant.addEventListener("change", () => current && select(current.index));

document.addEventListener("keydown", (e) => {
  if (!current || e.target instanceof HTMLInputElement && e.target.type === "search" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  if (e.target instanceof HTMLSelectElement) return;
  if (e.key === " " && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); playing = !playing; updatePlayButton(); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    const at = filtered.findIndex((a) => a.index === current.index);
    const next = filtered[Math.max(0, Math.min(filtered.length - 1, at + (e.key === "ArrowDown" ? 1 : -1)))];
    if (next && next.index !== current.index) select(next.index);
  }
});

requestAnimationFrame(frame);

// For local testing: ?apk=/binaries/your.apk loads a same-origin file without the picker.
if (params.has("apk")) {
  const url = new URL(params.get("apk"), location.href);
  if (url.origin === location.origin) {
    setStatus("Fetching the APK…");
    fetch(url).then((r) => (r.ok ? r.blob() : Promise.reject(new Error(`Couldn't fetch ${url.pathname}`))))
      .then((blob) => open(new File([blob], url.pathname.split("/").pop())))
      .catch((error) => setStatus(error.message, "error"));
  }
}
