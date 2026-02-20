import { getToolByHref } from "@/lib/toolsRegistry";
import PdfToImageClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/to-image");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["pdf to image", "pdf to jpg", "pdf to png", "convert pdf to image", "pdf converter free", "online pdf to image", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=pdf`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/pdf/to-image`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function PdfToImagePage() {
    const tool = getToolByHref("/tools/pdf/to-image");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const steps = [
        "Upload the PDF you wish to convert.",
        "Choose the output format (JPG or PNG) and image quality.",
        "Click convert to process the file.",
        "Download your images as a ZIP file or individually."
    ];

    const features = [
        { title: "High Quality", description: "Renders pages into crisp, high-resolution images." },
        { title: "Multiple Formats", description: "Support for popular image formats like JPG and PNG." },
        { title: "Full Document", description: "Converts every single page of your PDF automatically." },
        { title: "No Watermarks", description: "Get clean images without any branding added." }
    ];

    const faq = [
        { question: "What's the difference between JPG and PNG?", answer: "JPG is smaller and better for photos. PNG is higher quality and better for text/graphics." },
        { question: "Can I convert protected PDFs?", answer: "You need to unlock the PDF first using our Unlock tool before converting." },
        { question: "Is it fast?", answer: "Yes, conversion happens rapidly in your browser." }
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
            <PdfToImageClient />
            <RelatedTools currentHref="/tools/pdf/to-image" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
