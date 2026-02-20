import { getToolByHref } from "@/lib/toolsRegistry";
import UnitConverterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/calculator/unit");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["unit converter", "metric converter", "imperial converter", "length converter", "weight converter", "temperature converter", "kitbase"],
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

export default function UnitConverterPage() {
    const tool = getToolByHref("/tools/calculator/unit");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Choose the measurement category (Length, Weight, Temperature, etc.).",
        "Enter the value you want to convert.",
        "Select the 'from' unit and the 'to' unit.",
        "The converted value appears instantly."
    ];

    const features = [
        { title: "Wide Coverage", description: "Covers length, area, mass, volume, speed, temperature, and more." },
        { title: "Real-time Conversion", description: "See results update as you type." },
        { title: "Metric & Imperial", description: "Converts between metric, imperial, and US customary units." },
        { title: "Precise Results", description: "High-precision conversions for scientific and engineering use." }
    ];

    const faq = [
        { question: "Can I convert Celsius to Fahrenheit?", answer: "Yes, temperature conversion is fully supported." },
        { question: "Does it do currency conversion?", answer: "No, this tool focuses on physical unit conversions." },
        { question: "How accurate is it?", answer: "Very accurate â€” we use standard scientific conversion factors." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <UnitConverterClient />
            <RelatedTools currentHref="/tools/calculator/unit" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
