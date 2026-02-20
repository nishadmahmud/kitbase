import { getToolByHref } from "@/lib/toolsRegistry";
import GpaCalculatorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/gpa");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["gpa calculator", "grade point average", "calculate gpa", "college gpa", "high school gpa", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function GpaCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/gpa");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GpaCalculatorClient />
        </>
    );
}
