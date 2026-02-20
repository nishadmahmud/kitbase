import { getToolByHref } from "@/lib/toolsRegistry";
import RegexTesterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/regex-tester");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["regex tester", "regular expression tester", "regex debugger", "javascript regex", "regex playground", "kitbase"],
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

export default function RegexTesterPage() {
    const tool = getToolByHref("/tools/dev/regex-tester");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Enter your regular expression pattern in the top input.",
        "Add flags (g, i, m, etc.) as needed.",
        "Paste your test string in the text area below.",
        "Matches and groups are highlighted instantly."
    ];

    const features = [
        { title: "Real-time Highlighting", description: "See matches update live as you type your pattern." },
        { title: "JavaScript Regex Engine", description: "Uses your browser's native JS engine for 100% accurate results." },
        { title: "Cheatsheet (Coming Soon)", description: "Quick reference for common regex tokens and patterns." },
        { title: "Match Information", description: " Detailed view of match indices and capturing groups." }
    ];

    const faq = [
        { question: "Which regex flavor is supported?", answer: "This tool supports JavaScript Regular Expressions (ECMAScript)." },
        { question: "Why is my pattern not matching?", answer: "Check if you need global (g) or case-insensitive (i) flags enabled." },
        { question: "Is this secure?", answer: "Yes, your patterns and test strings are processed locally." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RegexTesterClient />
            <RelatedTools currentHref="/tools/dev/regex-tester" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
