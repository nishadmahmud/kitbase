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

export default function WordCounterPage() {
    return <WordCounterClient />;
}
