import { getToolByHref } from "@/lib/toolsRegistry";
import StringTransformClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/text/transform");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["string transform", "reverse text", "shuffle text", "repeat text", "text manipulation", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function StringTransformPage() {
    return <StringTransformClient />;
}
