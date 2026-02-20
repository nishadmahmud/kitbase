import { getToolByHref } from "@/lib/toolsRegistry";
import WatermarkPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/watermark");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["watermark pdf", "add watermark", "stamp pdf", "pdf watermark creator", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function WatermarkPdfPage() {
    const tool = getToolByHref("/tools/pdf/watermark");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Upload the PDF you need to watermark.",
        "Enter your custom text (e.g., 'CONFIDENTIAL', 'DRAFT').",
        "Customize the position, opacity, size, and color.",
        "Apply the watermark and download your stamped PDF."
    ];

    const features = [
        { title: "Custom Text", description: "Add any text you like to mark ownership or status." },
        { title: "Flexible Positioning", description: "Place watermarks exactly where you need them on the page." },
        { title: "Batch Processing", description: "Apply the same watermark to all pages in the document instantly." },
        { title: "Opacity Control", description: "Make watermarks subtle or bold with transparency settings." }
    ];

    const faq = [
        { question: "Can I use an image logo?", answer: "Currently only text watermarks are supported, but image support is planned." },
        { question: "Can the watermark be removed?", answer: "It is permanently baked into the PDF content, making it difficult to remove." },
        { question: "Does it cover text?", answer: "You can adjust opacity so the underlying text remains readable." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <WatermarkPdfClient />
            <RelatedTools currentHref="/tools/pdf/watermark" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
