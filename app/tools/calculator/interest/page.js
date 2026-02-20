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
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function InterestCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/interest");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Enter your principal (starting) amount.",
        "Input the annual interest rate percentage.",
        "Select Simple or Compound interest and the time period.",
        "Click 'Calculate' to see the total amount and interest earned."
    ];

    const features = [
        { title: "Simple & Compound", description: "Calculate both simple and compound interest scenarios." },
        { title: "Growth Chart", description: "Visual chart showing investment growth over time." },
        { title: "Compound Frequency", description: "Choose daily, monthly, quarterly, or annual compounding." },
        { title: "Breakdown Table", description: "Year-by-year breakdown of principal and interest." }
    ];

    const faq = [
        { question: "What is compound interest?", answer: "Compound interest is interest calculated on both the initial principal and the accumulated interest." },
        { question: "Is compound better than simple?", answer: "For savings, compound interest earns more. For loans, simple interest costs less." },
        { question: "How often should interest compound?", answer: "The more frequently it compounds, the more you earn (or owe). Daily is the most common for savings." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <InterestCalculatorClient />
            <RelatedTools currentHref="/tools/calculator/interest" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
