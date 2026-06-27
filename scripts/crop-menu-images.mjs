import sharp from "sharp";
import path from "path";
import { mkdir } from "fs/promises";

const refsDir = path.resolve("src/assets/refs");
const outDir = path.resolve("src/assets/menu");

await mkdir(outDir, { recursive: true });

/**
 * Crop the left food-image square from a 3-column menu grid screenshot.
 */
async function cropGridItems(sheetName, itemIds, config) {
  const sheetPath = path.join(refsDir, sheetName);
  const meta = await sharp(sheetPath).metadata();
  const W = meta.width;
  const H = meta.height;

  const {
    cols = 3,
    header = 52,
    rowGap = 14,
    colGap = 16,
    imgSize = 118,
    imgPadLeft = 14,
    imgPadTop = 6,
    cardHeight,
  } = config;

  const rows = Math.ceil(itemIds.length / cols);
  const computedCardH =
    cardHeight ?? (H - header - rowGap * (rows - 1)) / rows;
  const cardW = (W - colGap * (cols - 1)) / cols;

  for (let i = 0; i < itemIds.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cellLeft = col * (cardW + colGap);
    const padLeft = col === 0 ? 56 : imgPadLeft;
    const left = Math.round(cellLeft + padLeft);
    const top = Math.round(header + row * (computedCardH + rowGap) + imgPadTop);
    let size = Math.min(imgSize, Math.round(computedCardH), Math.round(cardW));
    size = Math.min(size, W - left, H - top);
    if (size < 40) {
      console.warn(`⚠ skip ${itemIds[i]} — crop out of bounds (${left},${top})`);
      continue;
    }

    await sharp(sheetPath)
      .extract({ left, top, width: size, height: size })
      .resize(400, 400, { fit: "cover" })
      .jpeg({ quality: 92 })
      .toFile(path.join(outDir, `${itemIds[i]}.jpg`));

    console.log(`✓ ${itemIds[i]} from ${sheetName} @ (${left},${top}) ${size}x${size}`);
  }
}

/** Crop deal poster thumbnails from deals-menu horizontal cards */
async function cropDealsMenu() {
  const sheetPath = path.join(refsDir, "deals-menu.png");
  const meta = await sharp(sheetPath).metadata();
  const W = meta.width;
  const H = meta.height;
  const header = 44;
  const rowGap = 14;
  const colGap = 16;
  const imgPadLeft = 14;
  const imgPadTop = 6;
  const cols = 3;
  const cardH = (H - header - rowGap) / 2;
  const cardW = (W - colGap * 2) / 3;
  const imgSize = Math.min(118, Math.round(cardH));

  const ids = ["deal-half", "deal-full", "deal-platter-full", "deal-platter-half"];
  for (let i = 0; i < ids.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const cellLeft = col * (cardW + colGap);
    const padLeft = col === 0 ? 56 : imgPadLeft;
    const left = Math.round(cellLeft + padLeft);
    const top = Math.round(header + row * (cardH + rowGap) + imgPadTop);
    let size = Math.min(imgSize, Math.round(cardH), Math.round(cardW));
    size = Math.min(size, W - left, H - top);
    if (size < 40) {
      console.warn(`⚠ skip ${ids[i]} — crop out of bounds`);
      continue;
    }

    await sharp(sheetPath)
      .extract({ left, top, width: size, height: size })
      .resize(400, 400, { fit: "cover" })
      .jpeg({ quality: 92 })
      .toFile(path.join(outDir, `${ids[i]}.jpg`));
    console.log(`✓ ${ids[i]}`);
  }
}

/** Crop daigi deal posters from original reference */
async function cropDaigiPosters() {
  const sheetPath = path.join(refsDir, "daigi-deals.png");
  const meta = await sharp(sheetPath).metadata();
  const cardW = meta.width / 2;

  await sharp(sheetPath)
    .extract({ left: 0, top: 0, width: Math.round(cardW), height: 228 })
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "deal-half-poster.jpg"));

  await sharp(sheetPath)
    .extract({ left: Math.round(cardW), top: 0, width: Math.round(cardW), height: 228 })
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "deal-full-poster.jpg"));

  console.log("✓ daigi posters");
}

await cropGridItems(
  "ramadan.png",
  ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8"],
  { header: 50, rowGap: 14, colGap: 16, imgSize: 120 }
);

await cropGridItems(
  "appetizer.png",
  ["a1", "a2", "a3", "a4", "a5", "a6"],
  { header: 50, rowGap: 14, colGap: 16, imgSize: 120 }
);

await cropGridItems(
  "barbeque.png",
  ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9"],
  { header: 50, rowGap: 14, colGap: 16, imgSize: 120, cardHeight: 108 }
);

await cropGridItems(
  "juices.png",
  ["j1", "j2", "j3", "j4"],
  { header: 96, rowGap: 14, colGap: 16, imgSize: 120 }
);

await cropGridItems(
  "chowmien.png",
  ["c1", "c2", "c3", "c4", "c5"],
  { header: 50, rowGap: 14, colGap: 16, imgSize: 120 }
);

await cropGridItems(
  "shakes.png",
  ["s1", "s2", "s3"],
  { header: 96, rowGap: 14, colGap: 16, imgSize: 100, cardHeight: 100 }
);

await cropGridItems(
  "salad.png",
  ["sa1", "sa2", "sa3", "sa4", "sa5"],
  { header: 50, rowGap: 14, colGap: 16, imgSize: 120, cardHeight: 105 }
);

await cropDealsMenu();
await cropDaigiPosters();

console.log("\nDone — all menu images cropped from your screenshots.");
