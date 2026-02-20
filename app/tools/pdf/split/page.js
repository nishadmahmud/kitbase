import { getToolByHref } from "@/lib/toolsRegistry";
import SplitPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/split");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["split pdf", "extract pdf pages", "separate pdf", "pdf splitter free", "online pdf splitter", "kitbase"],
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

export default function SplitPdfPage() {
    const tool = getToolByHref("/tools/pdf/split");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Upload your PDF file by dragging it into the box or clicking to select.",
        "Choose to extract specific pages or split every page into a separate file.",
        "Enter page ranges (e.g., 1-3, 5) if extracting specific parts.",
        "Download your new PDF files individually or as a ZIP archive."
    ];

    const features = [
        { title: "Precise Extraction", description: "Extract exactly the pages you need with flexible range selection." },
        { title: "Bulk Splitting", description: "Explode a document into single-page files in one click." },
        { title: "Visual Preview", description: "See thumbnails of your pages to ensure you're splitting correctly." },
        { title: "Secure Processing", description: "Your files never leave your device; everything happens in your browser." }
    ];

    const faq = [
        { question: "How do I select specific pages?", answer: "You can type page numbers (e.g., 2, 4) or ranges (e.g., 1-5) in the input field." },
        { question: "Will the quality be reduced?", answer: "No, the split files retain the exact quality of the original document." },
        { question: "Can I split large files?", answer: "Yes, our tool handles large documents efficiently without uploading them." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SplitPdfClient />
            <RelatedTools currentHref="/tools/pdf/split" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
