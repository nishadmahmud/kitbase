import { getToolByHref } from "@/lib/toolsRegistry";
import ImageFiltersClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/filters");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["image filters", "photo editor", "image adjustments", "photo brightness", "photo contrast", "kitbase", "instagram filters online"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=image`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/image/filters`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function ImageFiltersPage() {
    const tool = getToolByHref("/tools/image/filters");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Upload your photo to apply filters.",
        "Click on different filters (Grayscale, Sepia, Blur, etc.) to preview them.",
        "Adjust intensity sliders for brightness and contrast.",
        "Download your enhanced photo."
    ];

    const features = [
        { title: "Instant Effects", description: "Apply professional-looking filters with a single click." },
        { title: "Fine Tuning", description: "Adjust brightness, contrast, and saturation to perfection." },
        { title: "Real-time Preview", description: "See changes instantly as you move the sliders." },
        { title: "No Watermark", description: "Download your edited photos clean and free." }
    ];

    const faq = [
        { question: "Is this like Photoshop?", answer: "It provides basic adjustments and filters, making it much easier and faster for simple edits." },
        { question: "Can I undo changes?", answer: "Yes, you can reset to the original image at any time." },
        { question: "Is my photo uploaded?", answer: "No, all filtering tech runs directly in your browser." }
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
            <ImageFiltersClient />
            <RelatedTools currentHref="/tools/image/filters" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
