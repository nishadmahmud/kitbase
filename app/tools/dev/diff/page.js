import { getToolByHref } from "@/lib/toolsRegistry";
import TextDiffClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/diff");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["text diff", "diff viewer", "compare text", "text difference", "code diff", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function TextDiffPage() {
    return <TextDiffClient />;
}
