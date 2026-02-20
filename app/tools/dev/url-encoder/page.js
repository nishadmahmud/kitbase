import { getToolByHref } from "@/lib/toolsRegistry";
import UrlEncoderClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/url-encoder");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["url encoder", "url decoder", "percent encoding", "url escape", "url unescape", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function UrlEncoderPage() {
    const tool = getToolByHref("/tools/dev/url-encoder");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Choose 'Encode' to make a URL safe, or 'Decode' to make it readable.",
        "Paste your URL string into the input box.",
        "The converted string appears instantly below.",
        "Copy the result to your clipboard with one click."
    ];

    const features = [
        { title: "Standard Compliance", description: "Uses standard percent-encoding (RFC 3986) for maximum compatibility." },
        { title: "Instant Conversion", description: "Zero latency conversion as you type." },
        { title: "Handles Special Chars", description: "Correctly encodes spaces, slashes, and non-ASCII characters." },
        { title: "Secure", description: "Client-side processing ensures your URLs remain private." }
    ];

    const faq = [
        { question: "Why do I need to encode URLs?", answer: "URLs can only send a limited set of characters. Encoding ensures special characters (like spaces or &) are transmitted correctly." },
        { question: "What is percent-encoding?", answer: "It's a mechanism for encoding information in a Uniform Resource Identifier (URI) using the % character followed by two hexadecimal digits." },
        { question: "Is this the same as base64?", answer: "No, URL encoding is different and specifically designed for URI components." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <UrlEncoderClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
