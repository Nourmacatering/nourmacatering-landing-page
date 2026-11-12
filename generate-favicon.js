/**
 * generate-favicon.js
 * Crops assets/logo.png to a square focused on the icon mark,
 * writes assets/favicon-32.png and a valid multi-size favicon.ico
 * containing 16×16 and 32×32 bitmaps.
 *
 * Run: node generate-favicon.js
 * No npm packages required – uses only Node.js built-ins.
 */

'use strict';
const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

/* ------------------------------------------------------------------
   1. Read the PNG and parse its dimensions from the IHDR chunk
   We only need width/height – we don't need to fully decode it.
   Full pixel decode is done via a minimal inflate of IDAT chunks.
------------------------------------------------------------------ */
const SRC  = path.join(__dirname, 'assets', 'logo.png');
const OUT_PNG = path.join(__dirname, 'assets', 'favicon-32.png');
const OUT_ICO = path.join(__dirname, 'assets', 'favicon.ico');

const src = fs.readFileSync(SRC);

// Verify PNG signature
const PNG_SIG = Buffer.from([137,80,78,71,13,10,26,10]);
if (!src.slice(0,8).equals(PNG_SIG)) throw new Error('Not a PNG file');

// Parse all chunks
function parseChunks(buf) {
  const chunks = [];
  let off = 8;
  while (off < buf.length) {
    const len  = buf.readUInt32BE(off);     off += 4;
    const type = buf.slice(off, off+4).toString('ascii'); off += 4;
    const data = buf.slice(off, off+len);  off += len;
    off += 4; // skip CRC
    chunks.push({ type, data });
    if (type === 'IEND') break;
  }
  return chunks;
}
const chunks = parseChunks(src);

const ihdr   = chunks.find(c => c.type === 'IHDR').data;
const srcW   = ihdr.readUInt32BE(0);
const srcH   = ihdr.readUInt32BE(4);
const bitDepth  = ihdr[8];
const colorType = ihdr[9]; // 2=RGB, 6=RGBA
const channels  = colorType === 6 ? 4 : 3;
console.log(`Source: ${srcW}×${srcH} ${channels}-channel PNG`);

// Decompress IDAT(s) to raw scanlines
const idat = Buffer.concat(chunks.filter(c => c.type === 'IDAT').map(c => c.data));
const raw  = zlib.inflateSync(idat); // filter-byte + row data

const bytesPerPixel = channels * (bitDepth / 8);
const stride = srcW * bytesPerPixel; // bytes per row (after filter byte)

// Reconstruct pixels using PNG filter types (0=None,1=Sub,2=Up,3=Avg,4=Paeth)
function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// pixels[y][x] = {r,g,b,a}
const pixels = [];
for (let y = 0; y < srcH; y++) {
  const rowStart = y * (stride + 1);
  const filterType = raw[rowStart];
  const row = raw.slice(rowStart + 1, rowStart + 1 + stride);
  const prev = y > 0 ? pixels[y-1] : null;
  const decoded = Buffer.alloc(stride);

  for (let i = 0; i < stride; i++) {
    const x    = row[i];
    const a    = i >= bytesPerPixel ? decoded[i - bytesPerPixel] : 0;
    const b    = prev ? prev._raw[i] : 0;
    const c    = (prev && i >= bytesPerPixel) ? prev._raw[i - bytesPerPixel] : 0;
    switch (filterType) {
      case 0: decoded[i] = x; break;
      case 1: decoded[i] = (x + a) & 0xff; break;
      case 2: decoded[i] = (x + b) & 0xff; break;
      case 3: decoded[i] = (x + Math.floor((a + b) / 2)) & 0xff; break;
      case 4: decoded[i] = (x + paethPredictor(a, b, c)) & 0xff; break;
    }
  }
  decoded._raw = decoded; // keep reference for next row

  const pixelRow = [];
  for (let x = 0; x < srcW; x++) {
    const off = x * bytesPerPixel;
    pixelRow.push({
      r: decoded[off],
      g: decoded[off+1],
      b: decoded[off+2],
      a: channels === 4 ? decoded[off+3] : 255
    });
  }
  pixelRow._raw = decoded;
  pixels.push(pixelRow);
}
console.log('Pixels decoded.');

/* ------------------------------------------------------------------
   2. Crop: square centered horizontally, top quarter of image
      The logo mark occupies roughly the top 55% and horizontal centre.
      1536×1024: crop a 820×820 square starting at x=358, y=20
------------------------------------------------------------------ */
const CROP_SIZE = Math.round(srcH * 0.80);  // 819
const CROP_X    = Math.round((srcW - CROP_SIZE) / 2); // centres horizontally
const CROP_Y    = Math.round(srcH * 0.01);  // 10px from top

function samplePixel(x, y) {
  const cy = Math.min(Math.max(y, 0), srcH - 1);
  const cx = Math.min(Math.max(x, 0), srcW - 1);
  return pixels[cy][cx];
}

// Bicubic weight
function cubicWeight(d) {
  const a = -0.5;
  const ad = Math.abs(d);
  if (ad <= 1) return (a+2)*ad*ad*ad - (a+3)*ad*ad + 1;
  if (ad < 2)  return a*ad*ad*ad - 5*a*ad*ad + 8*a*ad - 4*a;
  return 0;
}

function resampleBicubic(srcPixels, cX, cY, cSize, dstSize) {
  const out = [];
  for (let dy = 0; dy < dstSize; dy++) {
    const row = [];
    for (let dx = 0; dx < dstSize; dx++) {
      const sx = cX + (dx + 0.5) * (cSize / dstSize) - 0.5;
      const sy = cY + (dy + 0.5) * (cSize / dstSize) - 0.5;
      let r=0,g=0,b=0,a=0,wSum=0;
      for (let ky = -1; ky <= 2; ky++) {
        for (let kx = -1; kx <= 2; kx++) {
          const px = samplePixel(Math.round(sx)+kx, Math.round(sy)+ky);
          const w  = cubicWeight(sx - (Math.round(sx)+kx)) *
                     cubicWeight(sy - (Math.round(sy)+ky));
          r += px.r * w; g += px.g * w; b += px.b * w; a += px.a * w;
          wSum += w;
        }
      }
      row.push({
        r: Math.min(255,Math.max(0,Math.round(r/wSum))),
        g: Math.min(255,Math.max(0,Math.round(g/wSum))),
        b: Math.min(255,Math.max(0,Math.round(b/wSum))),
        a: Math.min(255,Math.max(0,Math.round(a/wSum)))
      });
    }
    out.push(row);
  }
  return out;
}

console.log(`Cropping ${CROP_SIZE}×${CROP_SIZE} at (${CROP_X},${CROP_Y}), resampling to 32×32 and 16×16...`);
const img32 = resampleBicubic(pixels, CROP_X, CROP_Y, CROP_SIZE, 32);
const img16 = resampleBicubic(pixels, CROP_X, CROP_Y, CROP_SIZE, 16);
console.log('Resampling done.');

/* ------------------------------------------------------------------
   3. Encode as PNG (RGBA, uncompressed filter-0 rows)
------------------------------------------------------------------ */
function crc32(buf, start, len) {
  let crc = 0xffffffff;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[i]=c;}
    return t;
  })());
  for (let i = start; i < start + len; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const lenBuf  = Buffer.alloc(4); lenBuf.writeUInt32BE(data.length);
  const crcBuf  = Buffer.alloc(4);
  const combined = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(combined, 0, combined.length));
  return Buffer.concat([lenBuf, combined, crcBuf]);
}

function encodePNG(imgPixels, size) {
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    row[0] = 0; // filter None
    for (let x = 0; x < size; x++) {
      const p = imgPixels[y][x];
      row[1 + x*4]   = p.r;
      row[1 + x*4+1] = p.g;
      row[1 + x*4+2] = p.b;
      row[1 + x*4+3] = p.a;
    }
    rows.push(row);
  }
  const rawData = Buffer.concat(rows);
  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // RGBA
  ihdrData[10] = ihdrData[11] = ihdrData[12] = 0;

  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdrData),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const png32 = encodePNG(img32, 32);
fs.writeFileSync(OUT_PNG, png32);
console.log(`Written: ${OUT_PNG}`);

/* ------------------------------------------------------------------
   4. Write a proper .ico file containing 16×16 and 32×32 bitmaps
      ICO format: ICONDIR header + ICONDIRENTRY[] + image data
      We embed each size as a PNG (supported by all modern browsers
      and Windows Vista+).
------------------------------------------------------------------ */
function writeIco(images) {
  // images = [{size, pngBuf}, ...]
  const count = images.length;

  // ICONDIR: 6 bytes
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0);     // reserved
  iconDir.writeUInt16LE(1, 2);     // type: 1 = ICO
  iconDir.writeUInt16LE(count, 4); // number of images

  // Each ICONDIRENTRY: 16 bytes
  const entrySize = 16;
  const headerSize = 6 + entrySize * count;

  const entries = [];
  let offset = headerSize;
  for (const img of images) {
    const entry = Buffer.alloc(entrySize);
    entry[0] = img.size === 256 ? 0 : img.size; // width  (0 = 256)
    entry[1] = img.size === 256 ? 0 : img.size; // height (0 = 256)
    entry[2] = 0;  // color count (0 = no palette)
    entry[3] = 0;  // reserved
    entry.writeUInt16LE(1, 4);  // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.pngBuf.length, 8);  // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    entries.push(entry);
    offset += img.pngBuf.length;
  }

  return Buffer.concat([
    iconDir,
    ...entries,
    ...images.map(i => i.pngBuf)
  ]);
}

const png16 = encodePNG(img16, 16);
const ico = writeIco([
  { size: 16, pngBuf: png16 },
  { size: 32, pngBuf: png32 }
]);
fs.writeFileSync(OUT_ICO, ico);
console.log(`Written: ${OUT_ICO}`);
console.log('Done! Add to HTML <head>:');
console.log('  <link rel="icon" href="assets/favicon.ico" sizes="any">');
console.log('  <link rel="icon" href="assets/favicon-32.png" type="image/png" sizes="32x32">');
console.log('  <link rel="apple-touch-icon" href="assets/favicon-32.png">');
