import { getToolByHref } from "@/lib/toolsRegistry";
import CompressPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/compress");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["compress pdf", "reduce pdf size", "optimize pdf", "shrink pdf", "pdf compressor free", "online pdf compression", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function CompressPdfPage() {
    const tool = getToolByHref("/tools/pdf/compress");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CompressPdfClient />
        </>
    );
}
