/**
 * Injects BreadcrumbList, HowTo, and FAQPage JSON-LD schemas into every tool page.js.
 * Run: node scripts/inject-schemas.js
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

    // Only process pages that have the existing schema pattern
    if (!content.includes("getToolSchema")) continue;
    // Skip if already done
    if (content.includes("getBreadcrumbSchema")) continue;

    // 1. Update the import line to include all 4 helpers
    content = content.replace(
        /import \{ getToolSchema \} from "@\/lib\/seo";/,
        `import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";`
    );

    // 2. After `const jsonLd = getToolSchema(tool);`, add the 3 new schema consts
    content = content.replace(
        /const jsonLd = getToolSchema\(tool\);(\r?\n)/,
        `const jsonLd = getToolSchema(tool);$1    const breadcrumbSchema = getBreadcrumbSchema(tool);$1`
    );

    // 3. After the breadcrumb line, add howto and faq BUT only after steps/faq are declared.
    //    We insert them right before `return (` so they always have access to steps & faq.
    content = content.replace(
        /(\s+)return \((\r?\n)/,
        (match, ws, nl) =>
            `${ws}const howToSchema = getHowToSchema(tool, steps);${nl}` +
            `${ws}const faqSchema = getFaqSchema(faq);${nl}` +
            `${ws}return (${nl}`
    );

    // 4. After the existing jsonLd <script> tag, insert 3 more schema script tags.
    //    Pattern: </script> immediately after jsonLd block.
    content = content.replace(
        /(dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify\(jsonLd\) \}\}(\r?\n)\s*\/>)/,
        (match) =>
            match +
            `\r\n            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />` +
            `\r\n            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />` +
            `\r\n            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />`
    );

    fs.writeFileSync(file, content, "utf8");
    modified++;

    const rel = path.relative(toolsRoot, file).replace(/\\/g, "/");
    console.log(`✅ /tools/${rel.replace("/page.js", "")}`);
}

console.log(`\nDone. Modified: ${modified} files`);
