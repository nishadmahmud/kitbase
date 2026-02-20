import { getToolByHref } from "@/lib/toolsRegistry";
import JsonFormatterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/json-formatter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["json formatter", "json validator", "json minify", "json beautifier", "json parser", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

import { getToolSchema } from "@/lib/seo";
import ToolContent from "@/components/global/ToolContent";

export default function JsonFormatterPage() {
    const tool = getToolByHref("/tools/dev/json-formatter");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Paste your unformatted or minified JSON into the input editor.",
        "Click the key format options to choose between 2-space or 4-space indentation.",
        "Instantly view the beautified JSON in the output editor.",
        "Use the copy button to grab the formatted code."
    ];

    const features = [
        { title: "Syntax Validation", description: "Automatically detects and highlights errors in your JSON structure." },
        { title: "Collapsible Trees", description: "Interactive viewer allows you to expand and collapse JSON objects and arrays." },
        { title: "Privacy Focused", description: "All processing happens in your browser. Your data is never sent to our servers." },
        { title: "Minification", description: "Quickly compress your JSON to remove whitespace for production use." }
    ];

    const faq = [
        { question: "Is my JSON data safe?", answer: "Yes, absolutely. The formatting is done entirely within your browser using JavaScript. No data leaves your device." },
        { question: "Can it handle large files?", answer: "Yes, it's optimized for performance and can handle significantly large JSON payloads without freezing." },
        { question: "Does it validate JSON?", answer: "Yes, if your JSON is invalid, it will show you exactly where the syntax error is located." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <JsonFormatterClient />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
