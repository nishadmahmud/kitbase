import { getToolByHref } from "@/lib/toolsRegistry";
import ReorderPdfClient from "./ReorderClient";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/reorder");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["reorder pdf", "organize pdf pages", "rearrange pdf", "pdf page sorter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function ReorderPdfPage() {
    const tool = getToolByHref("/tools/pdf/reorder");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Upload a PDF file to see its pages displayed as thumbnails.",
        "Drag and drop pages to rearrange their order.",
        "Rotate individual pages or delete unwanted ones.",
        "Click 'Save PDF' to download your reorganized document."
    ];

    const features = [
        { title: "Drag & Drop", description: "Intuitive interface makes reorganizing pages as easy as moving icons." },
        { title: "Rotate Pages", description: "Fix pages that are upside down or sideways with a single click." },
        { title: "Delete Pages", description: "Remove blank or unnecessary pages to clean up your document." },
        { title: "Instant Preview", description: "See exactly how your new PDF will look before saving." }
    ];

    const faq = [
        { question: "Can I move pages between documents?", answer: "Currently this tool reorders pages within a single uploaded file." },
        { question: "Does it work with large files?", answer: "Yes, it efficiently handles documents with many pages." },
        { question: "Do I need to sign up?", answer: "No, the tool is free to use without registration." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ReorderPdfClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
