import { getToolByHref } from "@/lib/toolsRegistry";
import CaseConverterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/case-converter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["case converter", "uppercase converter", "lowercase converter", "title case", "camel case", "text transformation", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function CaseConverterPage() {
    const tool = getToolByHref("/tools/text/case-converter");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CaseConverterClient />
        </>
    );
}
