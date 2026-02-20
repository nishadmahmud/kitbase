import { getToolByHref } from "@/lib/toolsRegistry";
import ConvertImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/convert");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["convert image", "image converter", "png to jpg", "jpg to png", "webp converter", "image format", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=image`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/image/convert`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function ConvertImagePage() {
    const tool = getToolByHref("/tools/image/convert");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Upload the image you want to convert.",
        "Select the target format (JPG, PNG, WebP).",
        "Click convert to process the file instantly.",
        "Download your new image file."
    ];

    const features = [
        { title: "Universal Converter", description: "Convert between JPG, PNG, and WebP formats easily." },
        { title: "High Fidelity", description: "Preserves the color layout and quality of your original image." },
        { title: "No Server Uploads", description: "Your photos remain private on your device." },
        { title: "Fast conversion", description: "optimized specifically for speed." }
    ];

    const faq = [
        { question: "Why convert to WebP?", answer: "WebP offers superior compression and quality for web use compared to JPG or PNG." },
        { question: "Can I convert transparency?", answer: "Yes, converting PNG to WebP preserves transparency. JPG does not support it." },
        { question: "Is it free?", answer: "Yes, completely free forever." }
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
            <ConvertImageClient />
            <RelatedTools currentHref="/tools/image/convert" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
