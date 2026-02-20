import { getToolByHref } from "@/lib/toolsRegistry";
import StringTransformClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/transform");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["string transform", "reverse text", "shuffle text", "repeat text", "text manipulation", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function StringTransformPage() {
    const tool = getToolByHref("/tools/text/transform");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Enter your input text.",
        "Choose a transformation (Reverse, Shuffle, Upside Down, Morse Code).",
        "View the transformed string instantly.",
        "Copy the result to use elsewhere."
    ];

    const features = [
        { title: "Fun Effects", description: "Create upside down text or reverse strings for fun." },
        { title: "Encoders", description: "Convert text to Morse code or Hex string." },
        { title: "Slugify", description: "Turn titles into URL-friendly slugs." },
        { title: "Instant Result", description: "See transformations happen as you type." }
    ];

    const faq = [
        { question: "What is Slugify?", answer: "It converts text like 'Hello World' to 'hello-world', useful for URLs." },
        { question: "Can I decode Morse code?", answer: "Currently this tool is one-way for Morse code, but a decoder is planned." },
        { question: "Is it reversible?", answer: "Simple transforms like Reverse are, but others like Slugify lose information." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <StringTransformClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
