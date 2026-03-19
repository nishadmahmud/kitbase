/**
 * Adds openGraph.images pointing to /og endpoint in all tool page.js files.
 * Run: node scripts/inject-og-images.js
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

const BASE = "https://kitbase.tech";
const pages = findPages(toolsRoot);
let modified = 0;

for (const file of pages) {
    let content = fs.readFileSync(file, "utf8");

    // Skip if already done
    if (content.includes("/og?")) continue;

    // Extract tool href and category
    const hrefMatch = content.match(/getToolByHref\("([^"]+)"\)/);
    if (!hrefMatch) continue;
    const toolHref = hrefMatch[1];

    // Derive category from href: /tools/pdf/merge → pdf
    const parts = toolHref.split("/"); // ["", "tools", "pdf", "merge"]
    const category = parts[2] || "dev";

    // Extract tool name from existing title line if possible
    // We'll pass name and desc via the openGraph object already in the file
    // Just add `images` to the existing openGraph block
    content = content.replace(
        /(            type: "website",)(\r?\n        },\r?\n        alternates:)/,
        (_, typeStr, rest) => {
            // Build the OG URL — name and desc will be resolved at runtime from the metadata
            // We use the href to build a predictable URL with category
            const ogUrl = `${BASE}/og?name=__NAME__&desc=__DESC__&cat=${category}`;
            return `${typeStr}\r\n            images: [{ url: \`${BASE}/og?name=\${encodeURIComponent(tool.name)}&desc=\${encodeURIComponent(tool.description)}&cat=${category}\`, width: 1200, height: 630, alt: \`\${tool.name} | Kitbase\` }],${rest}`;
        }
    );

    fs.writeFileSync(file, content, "utf8");
    modified++;
    console.log(`✅ ${toolHref}`);
}

console.log(`\nDone. Modified: ${modified} files`);
