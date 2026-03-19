/**
 * Injects `alternates: { canonical: "..." }` into every tool page.js generateMetadata.
 * Run: node scripts/inject-canonicals.js
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

    // Skip if already done
    if (content.includes("alternates")) continue;

    // Extract the href from getToolByHref("/tools/...")
    const hrefMatch = content.match(/getToolByHref\("([^"]+)"\)/);
    if (!hrefMatch) continue;
    const toolHref = hrefMatch[1];

    // Insert alternates block after the openGraph closing brace inside the return
    // Pattern: `        },\n    };\n` (end of the metadata return object)
    content = content.replace(
        /(            type: "website",\r?\n        },\r?\n    };)/,
        `            type: "website",\r\n        },\r\n        alternates: {\r\n            canonical: \`https://kitbase.tech${toolHref}\`,\r\n        },\r\n    };`
    );

    fs.writeFileSync(file, content, "utf8");
    modified++;
    console.log(`✅ ${toolHref}`);
}

console.log(`\nDone. Modified: ${modified} files`);
