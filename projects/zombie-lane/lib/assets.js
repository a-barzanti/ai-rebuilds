// Loads Zombie Lane's art from the player's own APK: r1 animation entries, bundle descriptors and PNG atlases.
// Nothing leaves the browser.

import { openZip } from "./zip.js";
import { staticValues } from "./dex.js";
import { indexedTable, parseAnimationEntry, parseBundle, splitId, PROFILE } from "./formats.js";

export const KNOWN_SHA256 = "39b93f6f5409a3e9f84a47efdd23e3067333117bc5edad6c27887091ebda0ad6"; // 1.0.33

export class GameAssets {
  /** @param {Awaited<ReturnType<typeof openZip>>} zip */
  constructor(zip, r1) {
    this.zip = zip;
    this.r1 = r1;
    /** @type {Map<number, any>} */ this.entries = new Map();
    /** @type {Map<number, Promise<any>>} */ this.bundles = new Map();
    /** @type {Map<string, Promise<ImageBitmap | null>>} */ this.pngs = new Map();
    /** @type {Map<string, ImageBitmap | null>} */ this.readyPngs = new Map();
    /** @type {Map<number, any>} */ this.readyBundles = new Map();
  }

  /** @param {Blob} file */
  static async open(file) {
    const zip = await openZip(file);
    const r1 = await zip.read("assets/r1");
    if (!r1) throw new Error("No assets/r1 in this APK. Is it Zombie Lane?");
    return new GameAssets(zip, indexedTable(r1));
  }

  /** Resource names (ANM_*, RID_*) by r1 index, read from the APK's own classes.dex. */
  async names() {
    const dex = await this.zip.read("classes.dex");
    const values = dex && staticValues(dex, "Lcom/dchoc/toolkit/ResourceIDs;");
    /** @type {Map<number, string>} */
    const byIndex = new Map();
    if (!values) return byIndex;
    for (const [name, value] of values) {
      if (typeof value !== "number" || value === -1) continue;
      const { file, index } = splitId(value);
      if (file === 1 && !byIndex.has(index)) byIndex.set(index, name);
    }
    return byIndex;
  }

  /** Parsed r1 entry for a resource ID (cached). */
  entry(id) {
    const { index } = splitId(id);
    let entry = this.entries.get(index);
    if (!entry) {
      entry = parseAnimationEntry(this.r1.entry(index));
      this.entries.set(index, entry);
    }
    return entry;
  }

  hasBundle(id) {
    return this.zip.has(`assets/bundle_${id}/0`);
  }

  bundle(id) {
    let promise = this.bundles.get(id);
    if (!promise) {
      promise = this.zip.read(`assets/bundle_${id}/0`).then((bytes) => {
        const bundle = bytes ? parseBundle(bytes, id === 0) : null;
        this.readyBundles.set(id, bundle);
        return bundle;
      });
      this.bundles.set(id, promise);
    }
    return promise;
  }

  png(bundle, n) {
    const key = `${bundle}/${n}`;
    let promise = this.pngs.get(key);
    if (!promise) {
      promise = this.zip.read(`assets/bundle_${key}.png`).then(async (bytes) => {
        const image = bytes ? await createImageBitmap(new Blob([bytes], { type: "image/png" })) : null;
        this.readyPngs.set(key, image);
        return image;
      });
      this.pngs.set(key, promise);
    }
    return promise;
  }

  /**
   * Pick the animation to show for a resource ID, following the game's variant rules
   * (notes/sprites-and-animations.md, "Link entries").
   * @returns {{ id: number, animation: any, scale: number, profile: number, note: string }}
   */
  resolve(id, profile = PROFILE.DEFAULT) {
    const entry = this.entry(id);
    if (entry.kind !== "link") return { id, animation: entry, scale: 1, profile: PROFILE.DEFAULT, note: "" };
    const { targets } = entry;
    const fallback = (scale, note) => ({ id: targets[0], animation: this.entry(targets[0]), scale, profile: PROFILE.DEFAULT, note });
    if (profile === PROFILE.VGA && targets[1] !== undefined) {
      return { id: targets[1], animation: this.entry(targets[1]), scale: 1, profile, note: "" };
    }
    if (profile === PROFILE.HD) {
      if (targets[2] === undefined) return fallback(2, "No HD variant: the game draws the default art at 2×.");
      const hd = this.entry(targets[2]);
      if (hd.kind === "animation" && !this.hasBundle(hd.bundle)) {
        return fallback(2, "The HD art was a server download and isn't in the APK. The game falls back to the default art at 2×, as shown here.");
      }
      return { id: targets[2], animation: hd, scale: 1, profile, note: "" };
    }
    return fallback(1, "");
  }

  /** Load every PNG an animation (and its nested animations) draws. Returns how many images are missing. */
  async prepare(animation, profile = PROFILE.DEFAULT, seen = new Set()) {
    let missing = 0;
    const jobs = [];
    for (const frame of animation.frames) {
      if (!frame.data || seen.has(frame.data)) continue;
      seen.add(frame.data);
      for (const item of frame.data.items) {
        if (item.type === "image") {
          jobs.push(Promise.all([this.bundle(item.bundle), this.png(item.bundle, item.png)]).then(([b, img]) => {
            if (!b || !img) missing++;
          }));
        } else if (item.type === "nested" || item.type === "particles") {
          for (const id of item.type === "nested" ? [item.id] : item.animations) {
            const child = this.resolve(id, profile).animation;
            if (child.kind === "animation") jobs.push(this.prepare(child, profile, seen).then((m) => { missing += m; }));
          }
        }
      }
    }
    await Promise.all(jobs);
    return missing;
  }

  /** Synchronous lookup for drawing; call prepare() first. */
  region(item) {
    const image = this.readyPngs.get(`${item.bundle}/${item.png}`);
    const bundle = this.readyBundles.get(item.bundle);
    const rect = bundle?.pngs[item.png - 1]?.[item.region];
    return image && rect ? { image, ...rect } : null;
  }
}

/** SHA-256 of a file as hex. */
export async function sha256(file) {
  const hash = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}
