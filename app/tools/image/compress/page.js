import { getToolByHref } from "@/lib/toolsRegistry";
import CompressImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/compress");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["compress image", "image compressor", "shrink image", "reduce image size", "jpg compress", "png compress", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=image`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/image/compress`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function CompressImagePage() {
    const tool = getToolByHref("/tools/image/compress");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Upload your JPG, PNG, or WebP images.",
        "Select the compression level (Low, Medium, High).",
        "The tool automatically reduces file size while maintaining quality.",
        "Download your optimized images individually or as a ZIP."
    ];

    const features = [
        { title: "Smart Compression", description: "Drastically reduce file size without visible loss in quality." },
        { title: "Bulk Processing", description: "Compress multiple images at once to save time." },
        { title: "Privacy First", description: "Images are processed locally in your browser and never uploaded." },
        { title: "Format Support", description: "Works with all major web image formats." }
    ];

    const faq = [
        { question: "How much space can I save?", answer: "You can often reduce file size by 50-80% depending on the image complexity." },
        { question: "Will my photos look blurry?", answer: "No, our smart algorithm removes invisible data first to preserve visual quality." },
        { question: "Is there a limit?", answer: "No daily limits. Process as many images as you need." }
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
            <CompressImageClient />
            <RelatedTools currentHref="/tools/image/compress" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
