import { getToolByHref } from "@/lib/toolsRegistry";
import ImageCropperClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/image/crop");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["crop image", "image cropper", "photo crop online", "trim image", "photo cropper", "kitbase"],
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

export default function ImageCropperPage() {
    const tool = getToolByHref("/tools/image/crop");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Upload your photo to the editor.",
        "Drag the handles to select the area you want to keep.",
        "Or choose a preset aspect ratio (16:9, 1:1, etc.).",
        "Click 'Crop' and download your new image."
    ];

    const features = [
        { title: "Visual Editor", description: "Easy-to-use visual interface for precise cropping." },
        { title: "Aspect Ratio Presets", description: "Quickly crop for social media (Instagram, Twitter, etc.)." },
        { title: "Lossless Cropping", description: "Crops without re-encoding to preserve original quality." },
        { title: "Secure", description: "All editing happens in your browser." }
    ];

    const faq = [
        { question: "Does it reduce quality?", answer: "No, we aim to preserve 100% of the original quality." },
        { question: "Can I crop a circle?", answer: "Currently we support rectangular crops, but circle crop is coming soon." },
        { question: "What formats are supported?", answer: "JPG, PNG, and WebP are all fully supported." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ImageCropperClient />
            <RelatedTools currentHref="/tools/image/crop" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
