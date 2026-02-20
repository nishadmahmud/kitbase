import { getToolByHref } from "@/lib/toolsRegistry";
import ImageFiltersClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/filters");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["image filters", "photo editor", "image adjustments", "photo brightness", "photo contrast", "kitbase", "instagram filters online"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function ImageFiltersPage() {
    const tool = getToolByHref("/tools/image/filters");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ImageFiltersClient />
        </>
    );
}
