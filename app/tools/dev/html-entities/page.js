import { getToolByHref } from "@/lib/toolsRegistry";
import HtmlEntityEncoderClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/html-entities");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["html entities", "html encoder", "html decoder", "escape html", "html special characters", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function HtmlEntityEncoderPage() {
    const tool = getToolByHref("/tools/dev/html-entities");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HtmlEntityEncoderClient />
        </>
    );
}
