import { getToolByHref } from "@/lib/toolsRegistry";
import UnitConverterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/unit");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["unit converter", "metric converter", "imperial converter", "length converter", "weight converter", "temperature converter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function UnitConverterPage() {
    const tool = getToolByHref("/tools/calculator/unit");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <UnitConverterClient />
        </>
    );
}
