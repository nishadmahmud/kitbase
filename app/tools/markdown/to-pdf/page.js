import { getToolByHref } from "@/lib/toolsRegistry";
import MarkdownToPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/markdown/to-pdf");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["markdown to pdf", "md to pdf", "convert markdown", "document converter", "kitbase"],
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

export default function MarkdownToPdfPage() {
    const tool = getToolByHref("/tools/markdown/to-pdf");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Write or paste your Markdown content in the editor.",
        "See a live preview of how the rendered document looks.",
        "Adjust font and page size settings as needed.",
        "Click 'Download PDF' to save the generated document."
    ];

    const features = [
        { title: "Live Preview", description: "See the rendered output update in real time as you write." },
        { title: "Syntax Highlighting", description: "Code blocks are formatted with proper syntax highlighting in the PDF." },
        { title: "Custom Styling", description: "Adjust font size and page margin settings." },
        { title: "Clean Output", description: "Generates a professional-looking PDF from your Markdown." }
    ];

    const faq = [
        { question: "Does it support all Markdown?", answer: "Yes, standard CommonMark syntax is fully supported including tables and code." },
        { question: "What about images?", answer: "Images referenced with URLs render correctly in the preview and PDF." },
        { question: "Is the PDF editable?", answer: "The PDF is rendered as a document. For editable files, export as a different format." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MarkdownToPdfClient />
            <RelatedTools currentHref="/tools/markdown/to-pdf" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
