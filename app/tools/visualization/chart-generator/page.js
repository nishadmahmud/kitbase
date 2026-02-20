import { getToolByHref } from "@/lib/toolsRegistry";
import ChartGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/visualization/chart-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["chart generator", "data visualization", "bar chart", "line chart", "pie chart", "csv to chart", "online graph maker", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function ChartGeneratorPage() {
    const tool = getToolByHref("/tools/visualization/chart-generator");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ChartGeneratorClient />
        </>
    );
}
