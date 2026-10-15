// Read the initial values of a class's static fields straight from a classes.dex file.
// Used to get names for resource IDs (com.dchoc.toolkit.ResourceIDs) from the player's own APK.

/**
 * @param {Uint8Array} dex
 * @param {string} descriptor  e.g. "Lcom/dchoc/toolkit/ResourceIDs;"
 * @returns {Map<string, number | boolean | string | null> | null}  null when the class isn't found
 */
export function staticValues(dex, descriptor) {
  const dv = new DataView(dex.buffer, dex.byteOffset, dex.byteLength);
  const u32 = (o) => dv.getUint32(o, true);
  let p = 0;
  const uleb = () => {
    let result = 0, shift = 0, b;
    do { b = dex[p++]; result |= (b & 0x7f) << shift; shift += 7; } while (b & 0x80);
    return result >>> 0;
  };
  const string = (i) => {
    const saved = p;
    p = u32(u32(0x3c) + 4 * i);
    const length = uleb();
    let out = "";
    for (let k = 0; k < length; k++) {
      const a = dex[p++];
      if (a < 0x80) out += String.fromCharCode(a);
      else if ((a & 0xe0) === 0xc0) out += String.fromCharCode(((a & 0x1f) << 6) | (dex[p++] & 0x3f));
      else { const b = dex[p++], c = dex[p++]; out += String.fromCharCode(((a & 0x0f) << 12) | ((b & 0x3f) << 6) | (c & 0x3f)); }
    }
    p = saved;
    return out;
  };
  const typeName = (t) => string(u32(u32(0x44) + 4 * t));
  const littleEndian = (bytes) => { let x = 0; for (let k = 0; k < bytes; k++) x |= dex[p + k] << (8 * k); return x; };

  const classCount = u32(0x60), classDefs = u32(0x64), fieldIds = u32(0x54);
  for (let c = 0; c < classCount; c++) {
    const def = classDefs + 32 * c;
    if (typeName(u32(def)) !== descriptor) continue;

    p = u32(def + 24); // class_data
    const staticCount = uleb(); uleb(); uleb(); uleb();
    const names = [];
    for (let i = 0, field = 0; i < staticCount; i++) {
      field += uleb(); uleb();
      names.push(string(u32(fieldIds + 8 * field + 4)));
    }

    const values = new Map();
    const valuesOffset = u32(def + 28);
    if (!valuesOffset) return values;
    p = valuesOffset;
    const n = uleb();
    for (let i = 0; i < n; i++) {
      const head = dex[p++], type = head & 0x1f, arg = head >> 5;
      let value = null;
      if (type === 0x1f) value = arg === 1; // boolean
      else if (type === 0x1e) value = null;
      else if (type === 0x00 || type === 0x02 || type === 0x03 || type === 0x04) { // byte, short, char, int
        let x = littleEndian(arg + 1);
        const bits = 8 * (arg + 1);
        if (type !== 0x03 && bits < 32 && x & (1 << (bits - 1))) x -= 2 ** bits;
        value = x | 0;
        p += arg + 1;
      } else if (type === 0x17) { // string
        value = string(littleEndian(arg + 1));
        p += arg + 1;
      } else p += arg + 1;
      values.set(names[i], value);
    }
    return values;
  }
  return null;
}
