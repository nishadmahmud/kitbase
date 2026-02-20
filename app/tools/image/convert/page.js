import { getToolByHref } from "@/lib/toolsRegistry";
import ConvertImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/convert");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["convert image", "image converter", "png to jpg", "jpg to png", "webp converter", "image format", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function ConvertImagePage() {
    const tool = getToolByHref("/tools/image/convert");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ConvertImageClient />
        </>
    );
}
