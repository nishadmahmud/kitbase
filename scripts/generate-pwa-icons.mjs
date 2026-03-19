import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../app/icon.svg");
const outDir = resolve(__dirname, "../public/icons");

const svg = readFileSync(svgPath);

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svg).resize(size, size).png().toFile(`${outDir}/icon-${size}x${size}.png`);
  console.log(`Generated icon-${size}x${size}.png`);
}

console.log("Done.");
