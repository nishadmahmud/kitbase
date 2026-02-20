/**
 * One-shot script: adds RelatedTools import + component to every tool page.js
 * that already has a ToolContent component (Phase 2 complete pages).
 * Run: node scripts/add-related-tools.js
 */

const fs = require("fs");
const path = require("path");

const toolsRoot = path.join(__dirname, "..", "app", "tools");

// Recursively find all page.js files under app/tools
function findPages(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(findPages(full));
        } else if (entry.name === "page.js") {
            results.push(full);
        }
    }
    return results;
}

const pages = findPages(toolsRoot);
let modified = 0;
let skipped = 0;

for (const file of pages) {
    let content = fs.readFileSync(file, "utf8");

    // Only process pages that already have ToolContent
    if (!content.includes("ToolContent")) {
        skipped++;
        continue;
    }

    // Skip if RelatedTools already added
    if (content.includes("RelatedTools")) {
        skipped++;
        continue;
    }

    // 1) Add import after the ToolContent import line
    content = content.replace(
        /import ToolContent from "@\/components\/global\/ToolContent";/,
        `import ToolContent from "@/components/global/ToolContent";\nimport RelatedTools from "@/components/global/RelatedTools";`
    );

    // 2) Derive the tool href from the file path
    // e.g. app/tools/pdf/merge/page.js  → /tools/pdf/merge
    const relative = path.relative(toolsRoot, file); // e.g. "pdf\\merge\\page.js"
    const parts = relative.replace(/\\/g, "/").split("/"); // ["pdf","merge","page.js"]
    parts.pop(); // remove "page.js"
    const href = "/tools/" + parts.join("/"); // "/tools/pdf/merge"

    // 3) Add <RelatedTools> after <ToolContent ... />
    content = content.replace(
        /(<ToolContent[^/]*\/>)/,
        `$1\n            <RelatedTools currentHref="${href}" />`
    );

    fs.writeFileSync(file, content, "utf8");
    modified++;
    console.log(`✅ ${href}`);
}

console.log(`\nDone. Modified: ${modified}, Skipped: ${skipped}`);
