import { getToolByHref } from "@/lib/toolsRegistry";
import Base64Client from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/base64");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["base64 encoder", "base64 decoder", "base64 converter", "base64 to text", "text to base64", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function Base64EncoderPage() {
    const tool = getToolByHref("/tools/dev/base64");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Select 'Encode' or 'Decode' mode using the tabs.",
        "Enter your text or Base64 string into the input field.",
        "The result will appear instantly in the output box.",
        "Click the copy button to use the result in your code."
    ];

    const features = [
        { title: "Bi-directional", description: "Support for both encoding text to Base64 and decoding Base64 back to text." },
        { title: "Real-time Processing", description: "Conversion happens instantly as you type, no waiting for server requests." },
        { title: "UTF-8 Support", description: "Correctly handles special characters and emojis using UTF-8 encoding." },
        { title: "Clean Interface", description: "Simple, distraction-free design focused on getting the job done." }
    ];

    const faq = [
        { question: "What is Base64?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format." },
        { question: "Is this secure?", answer: "Base64 is encoding, not encryption. It's not secure for sensitive data without additional encryption." },
        { question: "Why use Base64?", answer: "It's commonly used to embed images directly in HTML/CSS or to transmit binary data over media that are designed to deal with text." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Base64Client />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
