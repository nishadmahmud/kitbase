import { getToolByHref } from "@/lib/toolsRegistry";
import LoremIpsumClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/lorem");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["lorem ipsum generator", "dummy text", "placeholder text", "generate lorem ipsum", "dummy content", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function LoremIpsumPage() {
    return <LoremIpsumClient />;
}
