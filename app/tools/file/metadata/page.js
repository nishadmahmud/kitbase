import { getToolByHref } from "@/lib/toolsRegistry";
import MetadataViewerClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/file/metadata");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["metadata viewer", "exif viewer", "pdf metadata", "image metadata", "video metadata", "file properties", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function MetadataViewerPage() {
    const tool = getToolByHref("/tools/file/metadata");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MetadataViewerClient />
        </>
    );
}
