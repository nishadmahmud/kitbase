import { getToolByHref } from "@/lib/toolsRegistry";
import WordCounterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/word-counter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["word counter", "character counter", "sentence counter", "word count online", "text analysis", "reading time calculator", "kitbase"],
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

export default function WordCounterPage() {
    const tool = getToolByHref("/tools/text/word-counter");
    const jsonLd = getToolSchema(tool);

    const steps = [
        "Type or paste your text into the text area.",
        "Real-time stats appear above the text box immediately.",
        "Check word count, character count, sentences, and paragraphs.",
        "See estimated reading and speaking times."
    ];

    const features = [
        { title: "Detailed Statistics", description: "Counts words, characters (with/without spaces), sentences, and paragraphs." },
        { title: "Time Estimation", description: "Calculates reading time and speaking time based on average speeds." },
        { title: "Auto-Save", description: "Your text is saved locally so you don't lose work if you accidentally refresh." },
        { title: "Privacy Focused", description: "All analysis happens in your browser; no text is sent to any server." }
    ];

    const faq = [
        { question: "Does it count spaces?", answer: "We provide two character counts: one with spaces and one without." },
        { question: "Is there a word limit?", answer: "No, you can paste as much text as your browser can handle." },
        { question: "How is reading time calculated?", answer: "We use an average reading speed of 200 words per minute." }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <WordCounterClient />
            <RelatedTools currentHref="/tools/text/word-counter" />
            <ToolContent title={tool.name} steps={steps} features={features} faq={faq} />
        </>
    );
}
