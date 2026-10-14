// Starter for a browser rebuild: a fixed-timestep loop plus a "bring your own files" loader.
// Replace update() and render() with the game, using the specs in ../notes/.

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const TICK_MS = 1000 / 60; // match the original's simulation rate once REA confirms it
const state = { tick: 0, original: null };

// The player picks their own copy of the original (APK, ZIP, EXE, data file...).
// It is read locally. Parse whatever the game needs from state.original here.
document.getElementById("original").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  state.original = { name: file.name, bytes: new Uint8Array(await file.arrayBuffer()) };
});

function update() {
  state.tick++;
}

function render() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fb923c";
  ctx.font = "16px monospace";
  ctx.fillText(`tick ${state.tick}`, 16, 28);
  ctx.fillText(
    state.original ? `loaded ${state.original.name} (${state.original.bytes.length} bytes)` : "no original files loaded",
    16,
    52,
  );
}

let last = performance.now();
let acc = 0;
function frame(now) {
  acc += Math.min(now - last, 250); // avoid a spiral of death after a background tab
  last = now;
  while (acc >= TICK_MS) {
    update();
    acc -= TICK_MS;
  }
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
