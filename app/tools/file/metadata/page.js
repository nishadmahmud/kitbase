import { getToolByHref } from "@/lib/toolsRegistry";
import MetadataViewerClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/file/metadata");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["metadata viewer", "exif viewer", "pdf metadata", "image metadata", "video metadata", "file properties", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=file`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/file/metadata`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function MetadataViewerPage() {
    const tool = getToolByHref("/tools/file/metadata");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Upload an image, PDF, or other supported file.",
        "The tool reads and displays all embedded metadata.",
        "Browse through EXIF data, creation dates, author info, and more.",
        "Export the metadata as JSON if needed."
    ];

    const features = [
        { title: "EXIF Data", description: "View camera settings, GPS location, and timestamps from photos." },
        { title: "PDF Metadata", description: "See author, creation date, and software for PDF documents." },
        { title: "Privacy Audit", description: "Find out what personal info is embedded in your files before sharing." },
        { title: "No Upload", description: "File metadata is read directly in your browser." }
    ];

    const faq = [
        { question: "What is EXIF data?", answer: "EXIF data is information embedded in photos by your camera, including location, date, and settings." },
        { question: "Does it show GPS location?", answer: "Yes, if your photo has GPS data, it will be extracted and displayed." },
        { question: "Should I remove metadata before sharing?", answer: "Yes, metadata can reveal personal info like your home location." }
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
            <MetadataViewerClient />
            <RelatedTools currentHref="/tools/file/metadata" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
