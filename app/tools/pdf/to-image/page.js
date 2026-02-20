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
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function PdfToImagePage() {
    const tool = getToolByHref("/tools/pdf/to-image");
    const jsonLd = getToolSchema(tool);

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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PdfToImageClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
