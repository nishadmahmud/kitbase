import { getToolByHref } from "@/lib/toolsRegistry";
import MarkdownViewerClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/markdown/viewer");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["markdown viewer", "markdown editor", "live markdown preview", "markdown to html", "readme viewer", "kitbase"],
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

export default function MarkdownViewerPage() {
    const tool = getToolByHref("/tools/markdown/viewer");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Paste your Markdown text into the editor pane.",
        "The rendered HTML preview appears instantly on the right.",
        "Edit in real time to see how different syntax renders.",
        "Copy the HTML output or the rendered text."
    ];

    const features = [
        { title: "Split View", description: "Side-by-side editor and preview for a seamless writing experience." },
        { title: "GFM Support", description: "Supports GitHub Flavored Markdown including tables and strikethrough." },
        { title: "Syntax Highlighting", description: "Code blocks are beautifully highlighted." },
        { title: "HTML Export", description: "Copy the rendered HTML output to use in your own projects." }
    ];

    const faq = [
        { question: "What is Markdown?", answer: "Markdown is a lightweight markup language using plain text formatting to create styled documents." },
        { question: "What is GFM?", answer: "GitHub Flavored Markdown is an extension of standard Markdown used on GitHub." },
        { question: "Can I use this for README files?", answer: "Absolutely, it's perfect for previewing README.md files before committing." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <MarkdownViewerClient />
            <RelatedTools currentHref="/tools/markdown/viewer" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
