import { getToolByHref } from "@/lib/toolsRegistry";
import ResizeImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/resize");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["resize image", "image resizer", "photo resizer", "resize jpg", "resize png", "web resizer", "online image resize", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=image`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/image/resize`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";

import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function ResizeImagePage() {
    const tool = getToolByHref("/tools/image/resize");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const content = {
        title: "Resize Image",
        steps: [
            "Upload your image (JPG, PNG, or WebP).",
            "Enter your desired width and height in pixels.",
            "Maintain aspect ratio is checked by default to prevent distortion.",
            "Click 'Resize Image' and download your optimized photo."
        ],
        features: [
            { title: "High Quality Resizing", description: "Our algorithm ensures your images look crisp even after resizing." },
            { title: "Batch Processing Support", description: "Coming soon! Resize multiple images at once for maximum productivity." }
        ],
        faq: [
            { question: "Does this reduce image quality?", answer: "Resizing down (making it smaller) generally maintains quality. Resizing up may cause some pixelation." },
            { question: "What formats are supported?", answer: "We support all major image formats including JPG, PNG, and WebP." }
        ]
    };

    const howToSchema = getHowToSchema(tool, content.steps);

    const faqSchema = getFaqSchema(content.faq);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <ResizeImageClient />
            <RelatedTools currentHref="/tools/image/resize" />
            <ToolContent {...content} />
        </>
    );
}
