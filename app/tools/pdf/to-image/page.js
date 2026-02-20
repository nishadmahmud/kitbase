import { getToolByHref } from "@/lib/toolsRegistry";
import PdfToImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/to-image");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["pdf to image", "pdf to jpg", "pdf to png", "convert pdf to image", "pdf converter free", "online pdf to image", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function PdfToImagePage() {
    const tool = getToolByHref("/tools/pdf/to-image");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PdfToImageClient />
        </>
    );
}
