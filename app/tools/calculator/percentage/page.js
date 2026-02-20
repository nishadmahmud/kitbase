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
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=calculator`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/calculator/percentage`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function PercentageCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/percentage");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Select the type of calculation (e.g., 'What is X% of Y?').",
        "Enter the required numbers into the fields.",
        "Click 'Calculate' to see the result immediately.",
        "Use different modes for increase, decrease, or difference calculations."
    ];

    const features = [
        { title: "Multiple Modes", description: "Calculate percentage of, increase, decrease, and difference." },
        { title: "Reverse Calculation", description: "Find the original number when you only know the result." },
        { title: "Simple Interface", description: "Straightforward inputs without confusing formulas." },
        { title: "Instant Results", description: "Answers appear as you type." }
    ];

    const faq = [
        { question: "How do I find what % one number is of another?", answer: "Use the 'X is what % of Y?' mode. Divide X by Y and multiply by 100." },
        { question: "How to calculate a discount?", answer: "Use 'Percentage decrease' mode with the original price and discount rate." },
        { question: "What's the percentage change formula?", answer: "((New Value - Old Value) / Old Value) Ã— 100. Our tool does this automatically." }
    ];

    const howToSchema = getHowToSchema(tool, steps);

    const faqSchema = getFaqSchema(faq);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <PercentageCalculatorClient />
            <RelatedTools currentHref="/tools/calculator/percentage" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
