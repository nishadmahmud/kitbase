import { getToolByHref } from "@/lib/toolsRegistry";
import JsonFormatterClient from "./client";

export async function generateMetadata() {
    const tool = getToolByHref("/tools/dev/json-formatter");

    return {
        title: `${tool.name} | Kitbase - Free Online Tools`,
        description: tool.description,
        keywords: ["json formatter", "json validator", "json minify", "json beautifier", "json parser", "kitbase"],
        openGraph: {
            title: `${tool.name} | Kitbase`,
            description: tool.description,
            type: "website",
        },
    };
}

export default function JsonFormatterPage() {
    return <JsonFormatterClient />;
}
