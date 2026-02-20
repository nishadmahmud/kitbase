/**
 * Swaps RelatedTools and ToolContent so RelatedTools comes first.
 * Before: <ToolContent ... />\n            <RelatedTools ... />
 * After:  <RelatedTools ... />\n            <ToolContent ... />
 * Run: node scripts/swap-related-order.js
 */

const fs = require("fs");
const path = require("path");

const toolsRoot = path.join(__dirname, "..", "app", "tools");

function findPages(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) results = results.concat(findPages(full));
        else if (entry.name === "page.js") results.push(full);
    }
    return results;
}

const pages = findPages(toolsRoot);
let modified = 0;

for (const file of pages) {
    let content = fs.readFileSync(file, "utf8");

    if (!content.includes("RelatedTools") || !content.includes("ToolContent")) continue;

    // Match: <ToolContent ... />\n(whitespace)<RelatedTools ... />
    const pattern = /(<ToolContent[^/]*\/>)\n(\s*)(<RelatedTools[^/]*\/>)/;
    if (!pattern.test(content)) continue;

    content = content.replace(
        pattern,
        (_, toolContent, ws, relatedTools) => `${relatedTools}\n${ws}${toolContent}`
    );

    fs.writeFileSync(file, content, "utf8");
    modified++;

    // Log the tool href for confirmation
    const rel = path.relative(toolsRoot, file).replace(/\\/g, "/");
    console.log(`✅ /tools/${rel.replace("/page.js", "")}`);
}

console.log(`\nDone. Reordered: ${modified} files`);
