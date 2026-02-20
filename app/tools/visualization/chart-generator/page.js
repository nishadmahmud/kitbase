import { getToolByHref } from "@/lib/toolsRegistry";
import ChartGeneratorClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/visualization/chart-generator");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["chart generator", "data visualization", "bar chart", "line chart", "pie chart", "csv to chart", "online graph maker", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=visualization`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/visualization/chart-generator`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function ChartGeneratorPage() {
    const tool = getToolByHref("/tools/visualization/chart-generator");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Paste or import your data as CSV or JSON.",
        "Select a chart type: Bar, Line, Pie, Area, or Scatter.",
        "Customize colors, labels, and axis titles.",
        "Download your chart as a PNG or SVG image."
    ];

    const features = [
        { title: "Multiple Chart Types", description: "Supports Bar, Line, Pie, Area, Scatter, and more." },
        { title: "CSV Import", description: "Paste CSV data directly to generate charts instantly." },
        { title: "Customizable", description: "Change colors, fonts, labels, and legends." },
        { title: "Export Options", description: "Download as high-quality PNG or scalable SVG." }
    ];

    const faq = [
        { question: "Do I need to know coding?", answer: "No, the chart builder has a simple point-and-click interface." },
        { question: "What data format does it accept?", answer: "CSV and JSON formats are both supported." },
        { question: "Can I use it for reports?", answer: "Yes, you can export high-resolution charts for embedding in reports." }
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
            <ChartGeneratorClient />
            <RelatedTools currentHref="/tools/visualization/chart-generator" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
