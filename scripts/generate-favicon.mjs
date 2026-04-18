import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "src", "app", "favicon.ico");

const BG = "#004923";
const FG = "#FFFBEC";

async function createIconPng(size) {
  const fontSize = Math.round(size * 0.4);
  const lineGap = Math.round(size * 0.02);
  const yTop = Math.round(size * 0.32);
  const yBot = yTop + fontSize + lineGap;

  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${BG}"/>
    <text x="50%" y="${yTop}" dominant-baseline="central" text-anchor="middle"
          font-family="Arial,Helvetica,sans-serif" font-weight="800"
          font-size="${fontSize}" fill="${FG}" letter-spacing="-0.5">RIC</text>
    <text x="50%" y="${yBot}" dominant-baseline="central" text-anchor="middle"
          font-family="Arial,Helvetica,sans-serif" font-weight="800"
          font-size="${fontSize}" fill="${FG}" letter-spacing="-0.5">CC</text>
  </svg>`;

  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

function createIcoBuffer(pngs) {
  const count = pngs.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * count;
  let dataOffset = headerSize + dirSize;

  const entries = [];
  for (const { size, data } of pngs) {
    entries.push({ size, data, offset: dataOffset });
    dataOffset += data.length;
  }

  const buf = Buffer.alloc(dataOffset);
  // ICO header
  buf.writeUInt16LE(0, 0);      // reserved
  buf.writeUInt16LE(1, 2);      // type: icon
  buf.writeUInt16LE(count, 4);  // image count

  let pos = headerSize;
  for (const { size, data, offset } of entries) {
    buf.writeUInt8(size >= 256 ? 0 : size, pos);       // width
    buf.writeUInt8(size >= 256 ? 0 : size, pos + 1);   // height
    buf.writeUInt8(0, pos + 2);                         // palette
    buf.writeUInt8(0, pos + 3);                         // reserved
    buf.writeUInt16LE(1, pos + 4);                      // color planes
    buf.writeUInt16LE(32, pos + 6);                     // bits per pixel
    buf.writeUInt32LE(data.length, pos + 8);            // image size
    buf.writeUInt32LE(offset, pos + 12);                // data offset
    pos += dirEntrySize;
  }

  for (const { data, offset } of entries) {
    data.copy(buf, offset);
  }

  return buf;
}

const sizes = [16, 32, 48, 64, 128, 256];
const pngs = await Promise.all(
  sizes.map(async (size) => ({ size, data: await createIconPng(size) }))
);

const ico = createIcoBuffer(pngs);
writeFileSync(OUTPUT, ico);
console.log(`Wrote ${OUTPUT} (${ico.length} bytes) with sizes: ${sizes.join(", ")}`);
