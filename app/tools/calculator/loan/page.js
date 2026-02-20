import { getToolByHref } from "@/lib/toolsRegistry";
import LoanCalculatorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/loan");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["loan calculator", "mortgage calculator", "auto loan calculator", "monthly payments", "interest calculator", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";

export default function LoanCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/loan");
    const jsonLd = getToolSchema(tool);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LoanCalculatorClient />
        </>
    );
}
