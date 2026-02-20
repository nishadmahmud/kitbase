import { getToolByHref } from "@/lib/toolsRegistry";
import MergePdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/merge");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["merge pdf", "combine pdf", "pdf joiner", "merge pdf files", "pdf merger free", "online pdf merge", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
            images: [{ url: `https://kitbase.tech/og?name=${encodeURIComponent(tool.name)}&desc=${encodeURIComponent(tool.description)}&cat=pdf`, width: 1200, height: 630, alt: `${tool.name} | Kitbase` }],
        },
        alternates: {
            canonical: `https://kitbase.tech/tools/pdf/merge`,
        },
    };
}

import { getToolSchema, getBreadcrumbSchema, getHowToSchema, getFaqSchema } from "@/lib/seo";

import ToolContent from "@/components/global/ToolContent";
import RelatedTools from "@/components/global/RelatedTools";

export default function MergePdfPage() {
    const tool = getToolByHref("/tools/pdf/merge");
    const jsonLd = getToolSchema(tool);
    const breadcrumbSchema = getBreadcrumbSchema(tool);

    const content = {
        title: "Merge PDF",
        steps: [
            "Click 'Select PDF files' to upload multiple PDF documents.",
            "Drag and drop files to reorder them as needed.",
            "Click 'Merge PDF' to combine them into a single file.",
            "Download your merged PDF document instantly."
        ],
        features: [
            { title: "100% Free & Secure", description: "All processing happens in your browser. No files are uploaded to any server, ensuring complete privacy." },
            { title: "Fast & Reliable", description: "Merge dozens of PDF files in seconds without installing any software or plugins." }
        ],
        faq: [
            { question: "Is it safe to merge sensitive PDFs?", answer: "Yes! Since Kitbase works entirely offline in your browser, your sensitive data never leaves your device." },
            { question: "Is there a file limit?", answer: "No, you can merge as many PDF files as your device memory allows." }
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
            <MergePdfClient />
            <RelatedTools currentHref="/tools/pdf/merge" />
            <ToolContent {...content} />
        </>
    );
}
