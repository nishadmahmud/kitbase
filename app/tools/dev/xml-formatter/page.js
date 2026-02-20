import { getToolByHref } from "@/lib/toolsRegistry";
import XmlFormatterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/xml-formatter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["xml formatter", "xml beautifier", "format xml", "xml validator", "xml beautify", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function XmlFormatterPage() {
    const tool = getToolByHref("/tools/dev/xml-formatter");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <XmlFormatterClient />
        </>
    );
}
