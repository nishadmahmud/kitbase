import { getToolByHref } from "@/lib/toolsRegistry";
import SqlFormatterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/sql-formatter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["sql formatter", "sql beautifier", "format sql", "sql query formatter", "database tools", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function SqlFormatterPage() {
    const tool = getToolByHref("/tools/dev/sql-formatter");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SqlFormatterClient />
        </>
    );
}
