import { getToolByHref } from "@/lib/toolsRegistry";
import MarkdownViewerClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/markdown/viewer");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["markdown viewer", "markdown editor", "live markdown preview", "markdown to html", "readme viewer", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function MarkdownViewerPage() {
    return <MarkdownViewerClient />;
}
