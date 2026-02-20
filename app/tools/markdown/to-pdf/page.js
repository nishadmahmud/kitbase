import { getToolByHref } from "@/lib/toolsRegistry";
import MarkdownToPdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/markdown/to-pdf");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["markdown to pdf", "md to pdf", "convert markdown", "document converter", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function MarkdownToPdfPage() {
    return <MarkdownToPdfClient />;
}
