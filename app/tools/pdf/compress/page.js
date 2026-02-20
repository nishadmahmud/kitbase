import { getToolByHref } from "@/lib/toolsRegistry";
import CompressPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/compress");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["compress pdf", "reduce pdf size", "optimize pdf", "shrink pdf", "pdf compressor free", "online pdf compression", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=pdf`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/pdf/compress`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function CompressPdfPage() {
    const tool = getToolByHref("/tools/pdf/compress");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Select the PDF file you want to compress.",
        "Choose your compression level: Low (best quality) to High (smallest size).",
        "Wait a moment while the tool optimizes your file.",
        "Download your smaller, lighter PDF document."
    ];

    const features = [
        { title: "Smart Optimization", description: "Reduces file size by removing unused data and optimizing images." },
        { title: "Adjustable Quality", description: "Control the balance between file size and image clarity." },
        { title: "Batch Compression", description: "Process multiple files to save time (coming soon)." },
        { title: "Client-side Privacy", description: "Compression is performed locally on your device." }
    ];

    const faq = [
        { question: "How much can I reduce the size?", answer: "It depends on the content, but reductions of 50-80% are common for image-heavy PDFs." },
        { question: "Does it affect text clarity?", answer: "Text remains perfectly crisp. Compression mainly changes image resolution." },
        { question: "Is it free?", answer: "Yes, completely free with no daily limits or watermarks." }
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
            <CompressPdfClient />
            <RelatedTools currentHref="/tools/pdf/compress" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
