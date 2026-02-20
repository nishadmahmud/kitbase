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

export default function CaseConverterPage() {
    return <CaseConverterClient />;
}
