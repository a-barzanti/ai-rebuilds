// Print static final constant values of one class from a classes.dex.
// Usage: bun dex-consts.ts <classes.dex> 'Lcom/pkg/Class;'  → JSON {name: value}
// Reads the class's static field initial values (ints, booleans, strings) straight from the DEX file.
const [dexPath, wanted] = Bun.argv.slice(2);
const buf = new Uint8Array(await Bun.file(dexPath).arrayBuffer());
const dv = new DataView(buf.buffer);
const u32 = (o: number) => dv.getUint32(o, true);
const u16 = (o: number) => dv.getUint16(o, true);

let p = 0;
function uleb(): number {
  let r = 0, s = 0, b;
  do { b = buf[p++]; r |= (b & 0x7f) << s; s += 7; } while (b & 0x80);
  return r >>> 0;
}
function str(i: number): string {
  p = u32(u32(0x3c) + 4 * i);
  const n = uleb();
  let out = "";
  for (let k = 0; k < n; k++) {
    const a = buf[p++];
    if (a < 0x80) out += String.fromCharCode(a);
    else if ((a & 0xe0) === 0xc0) out += String.fromCharCode(((a & 0x1f) << 6) | (buf[p++] & 0x3f));
    else { const b = buf[p++], c = buf[p++]; out += String.fromCharCode(((a & 0x0f) << 12) | ((b & 0x3f) << 6) | (c & 0x3f)); }
  }
  return out;
}
const typeName = (t: number) => str(u32(u32(0x44) + 4 * t));

const classCount = u32(0x60), classOff = u32(0x64), fieldOff = u32(0x54);
for (let c = 0; c < classCount; c++) {
  const d = classOff + 32 * c;
  if (typeName(u32(d)) !== wanted) continue;
  const dataOff = u32(d + 24), valOff = u32(d + 28);
  p = dataOff;
  const nStatic = uleb(); uleb(); uleb(); uleb();
  const fields: number[] = [];
  let idx = 0;
  for (let i = 0; i < nStatic; i++) { idx += uleb(); uleb(); fields.push(idx); }
  const names = fields.map((f) => str(u32(fieldOff + 8 * f + 4)));
  const out: Record<string, number | boolean | string | null> = {};
  if (valOff) {
    p = valOff;
    const n = uleb();
    for (let i = 0; i < n; i++) {
      const h = buf[p++], type = h & 0x1f, arg = h >> 5;
      let v: number | boolean | string | null = null;
      if (type === 0x1f) v = arg === 1;
      else if (type === 0x1e) v = null;
      else if ([0x00, 0x02, 0x03, 0x04].includes(type)) {
        let x = 0;
        for (let k = 0; k <= arg; k++) x |= buf[p + k] << (8 * k);
        const bits = 8 * (arg + 1);
        if (type !== 0x03 && bits < 32 && x & (1 << (bits - 1))) x -= 1 << bits;
        v = x | 0; p += arg + 1;
      } else if (type === 0x17) {
        let x = 0;
        for (let k = 0; k <= arg; k++) x |= buf[p + k] << (8 * k);
        p += arg + 1;
        const back = p; v = str(x); p = back;
      } else { v = `(encoded type ${type})`; p += arg + 1; }
      out[names[i]] = v;
    }
  }
  console.log(JSON.stringify(out));
  process.exit(0);
}
console.error("class not found");
process.exit(1);
