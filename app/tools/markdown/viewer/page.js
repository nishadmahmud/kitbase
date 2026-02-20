import { getToolByHref } from "@/lib/toolsRegistry";
import MarkdownViewerClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/markdown/viewer");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["markdown viewer", "markdown editor", "live markdown preview", "markdown to html", "readme viewer", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function MarkdownViewerPage() {
    const tool = getToolByHref("/tools/markdown/viewer");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MarkdownViewerClient />
        </>
    );
}
