import { getToolByHref } from "@/lib/toolsRegistry";
import InterestCalculatorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/interest");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["interest calculator", "simple interest", "compound interest", "investment calculator", "money growth", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function InterestCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/interest");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <InterestCalculatorClient />
        </>
    );
}
