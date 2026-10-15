// Minimal ZIP/APK reader for a File or Blob. Reads the central directory once,
// then reads and inflates single entries on demand. No dependencies.

/**
 * @typedef {{ name: string, method: number, compressedSize: number, size: number, localOffset: number }} ZipEntry
 */

/** @param {Blob} blob */
export async function openZip(blob) {
  const tailSize = Math.min(blob.size, 0xffff + 22);
  const tail = new DataView(await blob.slice(blob.size - tailSize).arrayBuffer());
  let eocd = -1;
  for (let i = tail.byteLength - 22; i >= 0; i--) {
    if (tail.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("This doesn't look like an APK or ZIP file.");

  const count = tail.getUint16(eocd + 10, true);
  const dirSize = tail.getUint32(eocd + 12, true);
  const dirOffset = tail.getUint32(eocd + 16, true);
  const dir = new DataView(await blob.slice(dirOffset, dirOffset + dirSize).arrayBuffer());
  const utf8 = new TextDecoder();

  /** @type {Map<string, ZipEntry>} */
  const entries = new Map();
  for (let p = 0, i = 0; i < count; i++) {
    if (dir.getUint32(p, true) !== 0x02014b50) throw new Error("Damaged ZIP directory.");
    const nameLength = dir.getUint16(p + 28, true);
    const extraLength = dir.getUint16(p + 30, true);
    const commentLength = dir.getUint16(p + 32, true);
    const name = utf8.decode(new Uint8Array(dir.buffer, p + 46, nameLength));
    entries.set(name, {
      name,
      method: dir.getUint16(p + 10, true),
      compressedSize: dir.getUint32(p + 20, true),
      size: dir.getUint32(p + 24, true),
      localOffset: dir.getUint32(p + 42, true),
    });
    p += 46 + nameLength + extraLength + commentLength;
  }

  /** Read one entry's bytes, or null when it isn't in the archive. */
  async function read(name) {
    const entry = entries.get(name);
    if (!entry) return null;
    const header = new DataView(await blob.slice(entry.localOffset, entry.localOffset + 30).arrayBuffer());
    if (header.getUint32(0, true) !== 0x04034b50) throw new Error(`Damaged ZIP entry: ${name}`);
    const start = entry.localOffset + 30 + header.getUint16(26, true) + header.getUint16(28, true);
    const data = new Uint8Array(await blob.slice(start, start + entry.compressedSize).arrayBuffer());
    if (entry.method === 0) return data;
    if (entry.method !== 8) throw new Error(`Unsupported compression (${entry.method}) for ${name}`);
    const inflate = new DecompressionStream("deflate-raw");
    const writer = inflate.writable.getWriter();
    writer.write(data).catch(() => {}); // errors surface on the readable side
    writer.close().catch(() => {});
    return new Uint8Array(await new Response(inflate.readable).arrayBuffer());
  }

  return { entries, has: (/** @type {string} */ name) => entries.has(name), read };
}
