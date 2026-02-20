import { getToolByHref } from "@/lib/toolsRegistry";
import PercentageCalculatorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/percentage");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["percentage calculator", "calculate percentage", "percent change", "what is percentage", "math tools", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function PercentageCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/percentage");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PercentageCalculatorClient />
        </>
    );
}
