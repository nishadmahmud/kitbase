import { getToolByHref } from "@/lib/toolsRegistry";
import ImageToPdfClient from "./ImageToPdfClient";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/from-image");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["image to pdf", "jpg to pdf", "png to pdf", "images to pdf converter", "kitbase"],
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

export default function ImageToPdfPage() {
    const tool = getToolByHref("/tools/pdf/from-image");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Select or drag and drop your image files (JPG, PNG).",
        "Arrage the images in the order you want them to appear.",
        "Set page orientation (Portrait/Landscape) and margins.",
        "Click 'Create PDF' to combine them into a single document."
    ];

    const features = [
        { title: "One-Click Combine", description: "Merge multiple images into a single professional PDF file." },
        { title: "Adjustable Layout", description: "Control orientation and fit to make your document look perfect." },
        { title: "Universal Compatibility", description: "Accepts JPG, PNG, and WebP image formats." },
        { title: "Fast & Private", description: "Images are processed locally, ensuring your photos remain private." }
    ];

    const faq = [
        { question: "Does it reduce image quality?", answer: "We maintain high image quality by default, but optimize for reasonable file sizes." },
        { question: "can I reorder images?", answer: "Yes, simply drag and drop the thumbnails before generating the PDF." },
        { question: "Is there a limit?", answer: "You can add as many images as your device memory allows." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ImageToPdfClient />
            <RelatedTools currentHref="/tools/pdf/from-image" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
