import { getToolByHref } from "@/lib/toolsRegistry";
import HtmlEntityEncoderClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/html-entities");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["html entities", "html encoder", "html decoder", "escape html", "html special characters", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function HtmlEntityEncoderPage() {
    const tool = getToolByHref("/tools/dev/html-entities");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Select 'Encode' to convert characters to HTML entities, or 'Decode' to revert them.",
        "Paste your text mixed with special characters into the input box.",
        "The converted text will appear instantly in the output box.",
        "Copy the safe HTML string for use in your code."
    ];

    const features = [
        { title: "Full Character Set", description: "Supports all standard HTML entities, including symbols and accents." },
        { title: "Prevent XSS", description: "Essential for sanitizing user input to prevent Cross-Site Scripting (XSS) attacks." },
        { title: "Real-time", description: "See the results immediately as you type or paste text." },
        { title: "Developer Ready", description: "Perfect for web developers needing to safely display code snippets." }
    ];

    const faq = [
        { question: "What are HTML entities?", answer: "They are codes used to display reserved characters (like <, >, &) in HTML." },
        { question: "Why encode HTML?", answer: "To ensure that browsers display the characters correctly instead of interpreting them as HTML tags." },
        { question: "Does it support emojis?", answer: "Yes, it can convert emojis to their corresponding HTML entity codes." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HtmlEntityEncoderClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
