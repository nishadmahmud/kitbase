import { getToolByHref } from "@/lib/toolsRegistry";
import TextCleanerClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/cleaner");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["text cleaner", "remove spaces", "remove empty lines", "deduplicate lines", "clean text online", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function TextCleanerPage() {
    const tool = getToolByHref("/tools/text/cleaner");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Paste your messy text into the editor.",
        "Select cleaning options (Remove extra spaces, Remove line breaks, Strip HTML).",
        "Click 'Clean Text' to apply the filters.",
        "Copy the sanitized result."
    ];

    const features = [
        { title: "Remove Whitespace", description: "Eliminate double spaces, tabs, and unnecessary blank lines." },
        { title: "Strip HTML", description: "Remove HTML tags to get plain text content." },
        { title: "Fix Punctuation", description: "Normalize quotes and smart quotes." },
        { title: "Email Friendly", description: "Clean up text forwarded in emails by removing '>' characters." }
    ];

    const faq = [
        { question: "Does it delete my text?", answer: "It only modifies the formatting based on your settings." },
        { question: "Can I remove emojis?", answer: "Yes, there is an option to strip emojis and special symbols." },
        { question: "Is my data stored?", answer: "No, cleaning happens entirely on your device." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <TextCleanerClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
