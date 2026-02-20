import { getToolByHref } from "@/lib/toolsRegistry";
import JsonCsvConverterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/json-csv");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["json to csv", "csv to json", "data converter", "json converter", "csv converter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=dev`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/dev/json-csv`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function JsonCsvConverterPage() {
    const tool = getToolByHref("/tools/dev/json-csv");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Choose conversion direction: JSON to CSV or CSV to JSON.",
        "Paste your data into the input panel.",
        "View the converted data immediately in the output panel.",
        "Download the result as a .csv or .json file."
    ];

    const features = [
        { title: "Two-way Conversion", description: "Seamlessly convert between structured JSON and flat CSV formats." },
        { title: "Table View", description: "Preview your data in a readable table format before downloading." },
        { title: "Handling Nested Data", description: "Intelligently flattens nested JSON objects for CSV compatibility." },
        { title: "Fast Processing", description: "Capable of handling large datasets without server delays." }
    ];

    const faq = [
        { question: "How are nested objects handled?", answer: "Nested keys are typically flattened using dot notation (e.g., user.address.city)." },
        { question: "Can I convert Excel files?", answer: "If you save your Excel file as CSV first, yes, you can convert it to JSON here." },
        { question: "Is there a row limit?", answer: "Practically limited by your browser's memory, but suitable for most typical data files." }
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
            <JsonCsvConverterClient />
            <RelatedTools currentHref="/tools/dev/json-csv" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
