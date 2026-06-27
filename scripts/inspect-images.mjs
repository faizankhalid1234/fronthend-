import sharp from "sharp";
import { readdir } from "fs/promises";
import path from "path";

const refsDir = path.resolve("src/assets/refs");
const files = await readdir(refsDir);

for (const file of files) {
  const meta = await sharp(path.join(refsDir, file)).metadata();
  console.log(`${file}: ${meta.width}x${meta.height}`);
}
