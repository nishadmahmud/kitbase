import { mkdirSync, copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const srcDir = resolve(root, "node_modules/@jspawn/ghostscript-wasm");
const outDir = resolve(root, "public/wasm");

const files = ["gs.js", "gs.wasm"];

if (!existsSync(srcDir)) {
  console.warn("[ghostscript] source not found, skipping asset copy");
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });

for (const f of files) {
  copyFileSync(resolve(srcDir, f), resolve(outDir, f));
}

console.log(`[ghostscript] copied ${files.join(", ")} to public/wasm/`);

// Also copy QPDF wasm assets (used for Protect/Unlock PDF)
const qpdfSrcDir = resolve(root, "node_modules/@neslinesli93/qpdf-wasm/dist");
const qpdfFiles = ["qpdf.js", "qpdf.wasm"];

if (!existsSync(qpdfSrcDir)) {
  console.warn("[qpdf] source not found, skipping asset copy");
  process.exit(0);
}

for (const f of qpdfFiles) {
  copyFileSync(resolve(qpdfSrcDir, f), resolve(outDir, f));
}

console.log(`[qpdf] copied ${qpdfFiles.join(", ")} to public/wasm/`);

