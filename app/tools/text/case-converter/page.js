import { getToolByHref } from "@/lib/toolsRegistry";
import CaseConverterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/case-converter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["case converter", "uppercase converter", "lowercase converter", "title case", "camel case", "text transformation", "kitbase"],
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

export default function CaseConverterPage() {
    const tool = getToolByHref("/tools/text/case-converter");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Type or paste your text into the input field.",
        "Click the button for the format you want (UPPERCASE, lowercase, Title Case, etc.).",
        "The text converts instantly.",
        "Copy your converted text with one click."
    ];

    const features = [
        { title: "Multiple Formats", description: "Convert to UPPERCASE, lowercase, Title Case, Sentence case, and camelCase." },
        { title: "Instant Conversion", description: "Zero latency text transformation." },
        { title: "Clipboard Ready", description: "One-click copy to clipboard for fast workflow." },
        { title: "Secure Processing", description: "Your text never leaves your browser." }
    ];

    const faq = [
        { question: "What is Title Case?", answer: "Title Case capitalizes the first letter of every major word, useful for headlines." },
        { question: "Does it fix accidental Caps Lock?", answer: "Yes, use 'Sentence case' or 'lowercase' to fix text typed with Caps Lock on." },
        { question: "Is there a character limit?", answer: "Practically none, it handles large blocks of text easily." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CaseConverterClient />
            <RelatedTools currentHref="/tools/text/case-converter" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
