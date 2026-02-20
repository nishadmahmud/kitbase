import { getToolByHref } from "@/lib/toolsRegistry";
import GradientGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/design/gradient-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["gradient generator", "css gradient", "background styles", "web design tools", "color gradients", "css 3", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function GradientGeneratorPage() {
    const tool = getToolByHref("/tools/design/gradient-generator");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GradientGeneratorClient />
        </>
    );
}
