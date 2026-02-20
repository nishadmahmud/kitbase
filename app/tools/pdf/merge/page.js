import { getToolByHref } from "@/lib/toolsRegistry";
import MergePdfClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/pdf/merge");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["merge pdf", "combine pdf", "pdf joiner", "merge pdf files", "pdf merger free", "online pdf merge", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function MergePdfPage() {
    return <MergePdfClient />;
}
