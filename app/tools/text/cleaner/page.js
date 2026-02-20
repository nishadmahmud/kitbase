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

export default function TextCleanerPage() {
    return <TextCleanerClient />;
}
