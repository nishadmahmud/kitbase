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
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function GpaCalculatorPage() {
    const tool = getToolByHref("/tools/calculator/gpa");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Enter each course name and the number of credit hours.",
        "Select your letter grade or enter a grade point for each course.",
        "Click 'Calculate' to compute your cumulative GPA.",
        "Add your previous GPA for a running cumulative calculation."
    ];

    const features = [
        { title: "Multi-Course Input", description: "Add as many courses as your semester requires." },
        { title: "Cumulative GPA", description: "Factor in your past GPA to see your overall standing." },
        { title: "4.0 & 5.0 Scale", description: "Supports both the standard 4.0 and weighted 5.0 GPA scales." },
        { title: "Instant Result", description: "GPA is recalculated in real time as you add courses." }
    ];

    const faq = [
        { question: "What is a good GPA?", answer: "A GPA of 3.5 or above is generally considered excellent. A 3.0 is a solid B average." },
        { question: "What is a 4.0 scale?", answer: "The most common scale where A=4, B=3, C=2, D=1, F=0." },
        { question: "Can I calculate a target GPA?", answer: "Yes, you can work backwards by entering what grade you need in upcoming courses." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GpaCalculatorClient />
            <RelatedTools currentHref="/tools/calculator/gpa" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
