import { getToolByHref } from "@/lib/toolsRegistry";
import StringTransformClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/transform");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["string transform", "reverse text", "shuffle text", "repeat text", "text manipulation", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function StringTransformPage() {
    const tool = getToolByHref("/tools/text/transform");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StringTransformClient />
        </>
    );
}
