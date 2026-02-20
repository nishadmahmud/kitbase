import { getToolByHref } from "@/lib/toolsRegistry";
import TextDiffClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/diff");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["text diff", "diff viewer", "compare text", "text difference", "code diff", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function TextDiffPage() {
    const tool = getToolByHref("/tools/dev/diff");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Paste the original text into the left 'Original' panel.",
        "Paste the modified text into the right 'Modified' panel.",
        "The tool will automatically highlight differences.",
        "Red highlights indicate deletions, and green indicates additions."
    ];

    const features = [
        { title: "Character-level Diff", description: "Precise comparison showing exactly which characters changed." },
        { title: "Syntax Highlighting", description: "Easier to read with clear color-coded visual indicators." },
        { title: "Side-by-Side View", description: "Classic split view makes it easy to compare versions." },
        { title: "Privacy First", description: "Comparisons happen locally in your browser for maximum security." }
    ];

    const faq = [
        { question: "Is there a limit on text size?", answer: "Browser memory is the only limit, but it comfortably handles large code files and documents." },
        { question: "Can I check code differences?", answer: "Yes, it's excellent for comparing code snippets, config files, or JSON objects." },
        { question: "Is my data sent to a server?", answer: "No, all processing is client-side. Your sensitive text never leaves your computer." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TextDiffClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
