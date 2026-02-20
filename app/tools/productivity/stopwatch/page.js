import { getToolByHref } from "@/lib/toolsRegistry";
import StopwatchClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/productivity/stopwatch");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["online stopwatch", "lap timer", "digital stopwatch", "timer", "chronometer", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function StopwatchPage() {
    const tool = getToolByHref("/tools/productivity/stopwatch");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StopwatchClient />
        </>
    );
}
