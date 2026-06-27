import sharp from "sharp";
import path from "path";

const publicDir = path.resolve("public");
const svg = path.join(publicDir, "pwa-icon.svg");

const sizes = [
  { name: "pwa-192.png", size: 192 },
  { name: "pwa-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(path.join(publicDir, name));
  console.log(`✓ ${name}`);
}

console.log("PWA icons generated.");
