import { getToolByHref } from "@/lib/toolsRegistry";
import Base64Client from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/base64");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["base64 encoder", "base64 decoder", "base64 converter", "base64 to text", "text to base64", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function Base64Page() {
    return <Base64Client />;
}
