import { getToolByHref } from "@/lib/toolsRegistry";
import WatermarkPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/watermark");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["watermark pdf", "add watermark", "stamp pdf", "pdf watermark creator", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function WatermarkPdfPage() {
    const tool = getToolByHref("/tools/pdf/watermark");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <WatermarkPdfClient />
        </>
    );
}
