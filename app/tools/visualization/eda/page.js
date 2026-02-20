import { getToolByHref } from "@/lib/toolsRegistry";
import EdaClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/visualization/eda");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["eda", "exploratory data analysis", "correlation heatmap", "data visualization", "statistics", "csv analysis", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=visualization`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/visualization/eda`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function EdaPage() {
    const tool = getToolByHref("/tools/visualization/eda");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Upload a CSV file containing your dataset.",
        "The tool auto-generates summary statistics for every column.",
        "View correlation heatmaps, histograms, and distribution charts.",
        "Identify outliers and missing values at a glance."
    ];

    const features = [
        { title: "Statistical Summary", description: "Get mean, median, std deviation, min/max for every column." },
        { title: "Correlation Heatmap", description: "Visualize which variables are most correlated." },
        { title: "Histograms", description: "See the distribution of any numerical column." },
        { title: "Missing Value Analysis", description: "Identify and visualize gaps in your dataset." }
    ];

    const faq = [
        { question: "What is EDA?", answer: "Exploratory Data Analysis is the process of visually and statistically summarizing a dataset." },
        { question: "What file format does it need?", answer: "CSV files with a header row are the standard supported format." },
        { question: "Is my data uploaded to a server?", answer: "No, all analysis is performed locally in your browser." }
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
            <EdaClient />
            <RelatedTools currentHref="/tools/visualization/eda" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
