import { getToolByHref } from "@/lib/toolsRegistry";
import EdaClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/visualization/eda");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["eda", "exploratory data analysis", "correlation heatmap", "data visualization", "statistics", "csv analysis", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function EdaPage() {
    const tool = getToolByHref("/tools/visualization/eda");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <EdaClient />
        </>
    );
}
